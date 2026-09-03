"use client";

import React from "react";
import styles from "./Settings.module.scss";
import {MdOutlineDragIndicator} from "react-icons/md";
import DraggableListInput from "@dexodus/bootstrap/src/inputs/DraggableListInput";
import {Column} from "@dexodus/table/src/adapter/AdapterInterface";
import classnames from "classnames";

interface SettingsProps {
    columns: Column[];
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
    refreshData: () => void;
}

const Settings: React.FC<SettingsProps> = ({columns, setColumns, refreshData}) => {
    return (
        <div className={styles.settings}>
            Выберите отображение полей:
            <DraggableListInput value={columns} setValue={setColumns} template={(item, dragStart, isDragging) => {
                return (
                    <div className={styles.columnsOrderItem}>
                        <div onMouseDown={dragStart} className={classnames(styles.columnsOrderItem__icon, !isDragging && styles.columnsOrderItem__icon_canDrag)}>
                            <MdOutlineDragIndicator/>
                        </div>
                        <input type="checkbox" checked={item.show} onChange={event => {
                            const show = event.target.checked;

                            setColumns(currentColumns => currentColumns.map(column => {
                                if (column.dataKey !== item.dataKey) {
                                    return column;
                                }

                                return {
                                    ...column,
                                    show,
                                    filters: show
                                        ? column.filters
                                        : column.filters.map(filter => ({...filter, data: undefined})),
                                };
                            }));

                            if (!show) {
                                refreshData();
                            }
                        }}/>
                        {item.title}
                    </div>
                )
            }}/>
        </div>
    );
};

export default Settings;
