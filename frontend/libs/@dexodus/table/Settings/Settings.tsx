"use client";

import React, {useEffect, useState} from "react";
import styles from "./Settings.module.scss";
import {MdOutlineDragIndicator} from "react-icons/md";
import DraggableListInput from "@/libs/@dexodus/bootstrap/inputs/DraggableListInput";
import {Column} from "@/libs/@dexodus/table/adapter/AdapterInterface";
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
                        <input type="checkbox" checked={item.show} onClick={() => {
                            setColumns(columns.map(column => {
                                if (column.dataKey === item.dataKey) {
                                    column.show = !column.show;

                                    if (!column.show) {
                                        for (const filter of column.filters) {
                                            filter.data = undefined;
                                            refreshData();
                                        }
                                    }
                                }

                                return column;
                            }));
                        }}/>
                        {item.title}
                    </div>
                )
            }}/>
        </div>
    );
};

export default Settings;
