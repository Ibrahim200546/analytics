import {Action, Column, ColumnFilter, ColumnFilterType, ColumnSort, SortType} from "../adapter/AdapterInterface";
import styles from "./Columns.module.scss";
import {FaSort, FaSortDown, FaSortUp} from "react-icons/fa";
import React, {useState} from "react";
import SearchFilter from "../filter/SearchFilter/SearchFilter";
import FilterComponentInterface from "../filter/FilterComponentInterface";
import AsyncSearchFilter from "../filter/AsyncSearchFilter/AsyncSearchFilter";
import TextTranslation from "@/libs/@dexodus/translation/src/client/TextTranslation";
import EnumSearchFilter from "@dexodus/table/src/filter/EnumSearchFilter";
import DateIntervalFilter from "@dexodus/table/src/filter/DateIntervalFilter/DateIntervalFilter";

interface ColumnsProps {
    sortColumn: (column: Column, sort: ColumnSort) => void;
    filterColumn: (filter: ColumnFilter, ...data: string[]) => void;
    refreshData: () => void;
    columns: Column[];
    actions: Action[];
}

const DELAY_BEFORE_FILTER = 500;

const getFilterComponent = (filterType: ColumnFilterType): FilterComponentInterface => {
    switch (filterType) {
        case ColumnFilterType.ASYNC_SEARCH:
            return AsyncSearchFilter;
        case ColumnFilterType.SEARCH:
            return SearchFilter;
        case ColumnFilterType.ENUM_SEARCH:
            return EnumSearchFilter;
        case ColumnFilterType.DATE:
            return DateIntervalFilter;
    }

    throw new Error(`Can't find filter component for "${filterType}"`)
}

const Columns = ({sortColumn, filterColumn, refreshData, columns, actions}: ColumnsProps) => {
    const [filterTimers, setFilterTimers] = useState<{ filter: ColumnFilter, timer: NodeJS.Timeout }[]>([]);

    const sort = (needSortColumn: Column, orderSort: boolean) => {
        if (!orderSort) {
            for (const column of columns) {
                if (column !== needSortColumn) {
                    sortColumn(column, {type: SortType.NONE, order: 0})
                }
            }
        }

        let lastOrder = 0;

        for (const column of columns) {
            if (column.sort && column.sort.type !== SortType.NONE) {
                lastOrder = Math.max(column.sort.order, lastOrder);
            }
        }

        if (!needSortColumn.sort || needSortColumn.sort.type === SortType.NONE) {
            sortColumn(needSortColumn, {type: SortType.ASC, order: lastOrder + 1})
            return refreshData();
        }

        if (needSortColumn.sort.type === SortType.ASC) {
            sortColumn(needSortColumn, {type: SortType.DESC, order: needSortColumn.sort.order})
            return refreshData();
        }

        sortColumn(needSortColumn, {type: SortType.NONE, order: 0});
        refreshData();
    }

    const getColumnSortOrder = (sortColumn: Column): number | undefined => {
        if (!sortColumn.sort || sortColumn.sort.type === SortType.NONE) {
            return undefined;
        }

        let order = 1;
        let totalNeedSortColumns = 0;

        for (const column of columns) {
            if (!column.sort || column.sort.type === SortType.NONE) {
                continue;
            }

            order += column.sort.order < sortColumn.sort.order ? 1 : 0;
            totalNeedSortColumns++;
        }

        return totalNeedSortColumns > 1 ? order : undefined;
    }

    const useFilter = (filter: ColumnFilter, ...data: string[]) => {
        const timer = setTimeout(() => {
            setFilterTimers(filterTimers => {
                return filterTimers.filter(filterTimer => filterTimer.filter !== filter);
            })

            filterColumn(filter, ...data);
        }, DELAY_BEFORE_FILTER);

        setFilterTimers(filterTimers => {
            const timers = filterTimers.filter(filterTimer => {
                if (filterTimer.filter !== filter) {
                    return true;
                }

                clearTimeout(filterTimer.timer);

                return false;
            });

            return [...timers, {filter: filter, timer: timer}];
        });
    }

    return (
        <>
            <tr className={styles.columns} style={{backgroundColor: '#F2F2F2', height: '24px'}}>
                {columns.filter(column => column.show).map((column) => {
                    const order = getColumnSortOrder(column);

                    return (
                        <th key={column.dataKey}>
                            <div className={styles.column_container}>
                                <span className={styles.column}>
                                    <TextTranslation label={column.title} defaultValue={column.title}/>
                                    {column.sortable && (
                                        <>
                                            <span
                                                className={styles.sort}
                                                onClick={event => sort(column, event.ctrlKey)}
                                            >
                                                {(!column.sort || column.sort.type === SortType.NONE) && <FaSort/>}
                                                {column.sort?.type === SortType.ASC && <FaSortUp/>}
                                                {column.sort?.type === SortType.DESC && <FaSortDown/>}
                                            </span>
                                            <span className={styles.sort__number}>
                                                {order}
                                            </span>
                                        </>
                                    )}
                                </span>
                            </div>
                        </th>
                    )
                })}
                {actions.length > 0 && (
                    <th>
                        Действия
                    </th>
                )}
            </tr>

            <tr className={styles.columns} style={{backgroundColor: '#F2F2F2'}}>
                {columns.filter(column => column.show).map((column) => (
                    <th key={column.dataKey} style={{paddingTop: 0, paddingLeft: '2px', paddingRight: '2px'}}>
                        <div className={styles.column_container}>
                            <div className={styles.filters}>
                                {column.filters.map((filter) => {
                                    let FilterComponent = getFilterComponent(filter.type);

                                    // eslint-disable-next-line react-hooks/rules-of-hooks
                                    return <FilterComponent key={filter.config} column={column} filter={filter} applyFilter={(...data: string[]) => useFilter(filter, ...data)}/>;
                                })}
                            </div>
                        </div>
                    </th>
                ))}
                {actions.length > 0 && (
                    <th>
                    </th>
                )}
            </tr>
        </>
    )
}

export default Columns;
