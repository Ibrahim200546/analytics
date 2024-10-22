"use client";

import {Action, AdapterInterface, Column, ColumnFilter, ColumnSort, Data} from "./adapter/AdapterInterface";
import React, {useEffect, useRef, useState} from "react";
import Paginator from "./Paginator/Paginator";
import Columns from "./Columns/Columns";
import {addFunction, Jsel, JselContext} from "@dexodus/jsel";
import {useRouter} from "next/navigation";
import styles from "./Table.module.scss";
import classnames from "classnames";
import Button, {ButtonSizes} from "@/libs/@dexodus/bootstrap/UserInterface/Button";
import {BallTriangle} from "react-loader-spinner";
import useModal from "@/libs/@dexodus/bootstrap/UserInterface/Modal/useModal";
import DraggableListInput from "@/libs/@dexodus/bootstrap/inputs/DraggableListInput";
import {CgSelect} from "react-icons/cg";
import {MdOutlineDragIndicator} from "react-icons/md";
import Settings from "@/libs/@dexodus/table/Settings";

interface TableProps {
    adapter: AdapterInterface;
    className?: string;
    setRefresh?: React.Dispatch<React.SetStateAction<any>>
    name?: string;
    setShowSettings?: (showSettings: () => void) => void;
}

const generateUniqueIdForData = (data: Data, columns: Column[]): string => {
    let id = '';

    for (const column of columns) {
        id += data[column.dataKey];
    }

    return id;
}

const Table =  ({adapter, className, setRefresh, name, setShowSettings}: TableProps) => {
    const [data, setData] = useState<Data[]>([]);
    const [columns, setColumns] = useState<Column[]>([]);
    const [actions, setActions] = useState<Action[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const defaultFetch = 'fetch' in adapter ? adapter.fetch as any : fetch;
    const tableRef = useRef<HTMLTableElement>();
    const router = useRouter();

    const refreshData = () => {
        (async () => {
            setLoading(true);
            setData(await adapter.getData());
            saveOptions();
            setLoading(false);
        })()
    };

    const {modal: settingsModal, show} = useModal((
        <Settings columns={columns} setColumns={setColumns} refreshData={refreshData}/>
    ), (
        <div>
            Настройки таблицы
        </div>
    ));

    const jselRef = useRef(new Jsel(new JselContext({
        inArray: (needle: any, haystack: any[]) => {
            return Array.isArray(haystack) && haystack.includes(needle);
        },
        refreshData,
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
        fetchJson: (path: string) => {
            return (async () => {
                const result = await defaultFetch(path);
                return await result.json();
            })();
        },
    })));

    useEffect(() => {
        if (setShowSettings) {
            setShowSettings(show);
        }

        if (setRefresh) {
            setRefresh(() => refreshData as any);
        }

        (async () => {
            if (!adapter.isInit()) {
                await adapter.init();
            }

            const tableOptions = window.sessionStorage.getItem(`${name}_options`) ?? window.localStorage.getItem(`${name}_options`);

            if (tableOptions) {
                adapter.importOptions(JSON.parse(tableOptions))
            }

            setData(await adapter.getData());
            setColumns(adapter.getColumns());
            setActions(adapter.getActions());
            addFunction('routerPush', ((path: string) => {
                router.push(path);
            }) as any)
            setLoading(false);
        })()
    }, []);

    useEffect(() => {
        if (columns.length) {
            adapter.setColumns(columns);
            saveOptions();
        }
    }, [columns]);

    const saveOptions = () => {
        const options = adapter.exportOptions();

        window.sessionStorage.setItem(`${name}_options`, JSON.stringify(options));
        window.localStorage.setItem(`${name}_options`, JSON.stringify({
            currentPage: options.currentPage,
            columns: options.columns.map(column => {
                const newColumn = {...column} as Column;
                const filters = [];

                for (const filter of newColumn.filters) {
                    const newFilter = {...filter};
                    newFilter.data = undefined;
                    filters.push(newFilter);
                }

                newColumn.filters = filters;

                return newColumn;
            }),
        }));
    }

    const changePage = (pageNumber: number) => {
        adapter.setCurrentPage(pageNumber);
        refreshData();
        saveOptions();
    }

    const sortColumn = (column: Column, sort: ColumnSort): void => {
        adapter.sortColumn(column, sort);
        saveOptions();
    }

    const filterColumn = (filter: ColumnFilter, ...data: string[]) => {
        if (adapter.filterColumn(filter, ...data)) {
            refreshData();
            saveOptions();
        }
    }

    const onClickAction = async (action: Action, data: Data): Promise<void> => {
        jselRef.current.assign('entity', data);
        const result = jselRef.current.exec(action.onClick);

        if (result instanceof Promise) {
            setLoading(true);
            const onClick = await result;
            setLoading(false);

            if (typeof onClick === 'string') {
                onClickAction({...action, onClick}, data);
            }
        }
    }

    if (!adapter.isInit()) {
        return <BallTriangle height={32}/>
    }

    return (
        <div className={styles.tableContainer}>
            {loading && (
                <div className={styles.fade} style={{
                    width: `${tableRef.current?.offsetWidth}px`,
                    height: `${tableRef.current?.offsetHeight}px`,
                }}>
                    <BallTriangle height={32}/>
                </div>
            )}
            <table className={classnames(styles.table, className)} ref={tableRef as any}>
                <thead>
                <Columns
                    sortColumn={sortColumn}
                    columns={columns}
                    refreshData={refreshData}
                    filterColumn={filterColumn}
                    actions={actions}
                />
                </thead>
                <tbody>
                {data.map(datum => (
                    <tr key={generateUniqueIdForData(datum, columns)}>
                        {columns.filter(column => column.show).map((column) => (
                            <td key={column.dataKey}>{datum[column.dataKey]}</td>
                        ))}
                        {actions.length > 0 && (
                            <td className={styles.actions}>
                                {actions.filter(action => {
                                    jselRef.current.assign('entity', datum)

                                    return jselRef.current.exec(action.isVisible)
                                }).map(action => (
                                    <Button size={ButtonSizes.ExtraSmall} key={action.title} onClick={() => onClickAction(action, datum)} style={action.style} className={styles.action}>
                                        {action.title}
                                    </Button>
                                ))}
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan={columns.length + Math.min(actions.length, 1)}>
                        <div className={styles.tableFooter}>
                            <Paginator
                                countPages={adapter.getCountPages()}
                                currentPage={adapter.getCurrentPage()}
                                setCurrentPage={pageNumber => changePage(pageNumber)}
                            />
                            <i>Всего: {adapter.getTotalData()}</i>
                        </div>
                    </td>
                </tr>
                </tfoot>
            </table>
            {settingsModal}
        </div>
    );
}

export default Table;
