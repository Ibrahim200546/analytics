"use client";

import React, {useRef, useState} from "react";
import styles from "./TableEditor.module.scss";
import classnames from "classnames";
import {arrayPad} from "@/libs/@dexodus/bootstrap/common/array";

interface TableEditorProps {
    data: React.ReactNode[][];
}

const MARGIN_SELECTION_ERROR = 2; // px
const COLUMN_MIN_WIDTH = 50; // px
const COLUMNS_COUNT = 26;

const TableEditor: React.FC<TableEditorProps> = ({data}) => {
    const defaultColumnSizes = [];

    for (let i = 0; i < COLUMNS_COUNT; i++) {
        defaultColumnSizes.push(192);
    }

    const [columnsWidth, setColumnsWidth] = useState<number[]>(defaultColumnSizes);
    const [isCanChangeBorderSize, setIsCanChangeBorderSize] = useState<boolean>(false);
    const [changedBorderSizeIndex, setChangedBorderSizeIndex] = useState<number|null>(null);
    const tableRef = useRef<HTMLDivElement>(null);

    const getBorderIndex = (x: number): null|number => {
        let offset = 0;

        for (const columnWidthIndex in columnsWidth.slice(0, -1)) {
            offset += columnsWidth[columnWidthIndex];

            if (offset - MARGIN_SELECTION_ERROR < x && x < offset + MARGIN_SELECTION_ERROR) {
                return parseInt(columnWidthIndex);
            }
        }

        return null;
    }

    const getBeforeOffset = (borderIndex: number): number => {
        let offset = 0;

        for (const columnWidthIndex in columnsWidth.slice(0, -1)) {
            if (columnWidthIndex === `${borderIndex}`) {
                return offset;
            }

            offset += columnsWidth[columnWidthIndex];
        }

        return offset;
    }

    const mouseDown = (x: number, y: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const borderIndex = getBorderIndex(x);

        if (borderIndex !== null) {
            event.preventDefault();
        }

        setChangedBorderSizeIndex(getBorderIndex(x));
    }

    const mouseMove = (x: number, y: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsCanChangeBorderSize(getBorderIndex(x) !== null);

        if (changedBorderSizeIndex === null) {
            return;
        }

        const beforeOffset = getBeforeOffset(changedBorderSizeIndex);

        setColumnsWidth(columnsWidth => {
            const maxWidth = columnsWidth.reduce((acc, columnsWidth) => acc + columnsWidth, 0);
            const currentTableWidth = maxWidth - columnsWidth[changedBorderSizeIndex] - columnsWidth[changedBorderSizeIndex + 1]
                + Math.max(x - beforeOffset, COLUMN_MIN_WIDTH) + Math.max(columnsWidth[changedBorderSizeIndex + 1] + columnsWidth[changedBorderSizeIndex] - (x - beforeOffset), COLUMN_MIN_WIDTH);

            if (currentTableWidth !== maxWidth) {
                return columnsWidth;
            }

            return columnsWidth.map((columnWidth, index) => {
                if (index === changedBorderSizeIndex) {
                    return Math.max(x - beforeOffset, COLUMN_MIN_WIDTH);
                } else if (index === changedBorderSizeIndex + 1 && (x - beforeOffset) >= COLUMN_MIN_WIDTH) {
                    return Math.max(columnWidth + columnsWidth[changedBorderSizeIndex] - (x - beforeOffset), COLUMN_MIN_WIDTH);
                }
                return columnWidth;
            }
        )});
    }

    return (
        <div className={styles.tableEditor}
             onMouseUp={event => setChangedBorderSizeIndex(null)}
             onMouseDown={event => {
                 if (!(tableRef.current instanceof HTMLDivElement)) {
                     return;
                 }

                 const rect = tableRef.current.getBoundingClientRect();
                 mouseDown(event.clientX - rect.left + tableRef.current.scrollLeft, event.clientY - rect.top + tableRef.current.scrollTop, event);
             }}
             onMouseMove={event => {
                 if (!(tableRef.current instanceof HTMLDivElement)) {
                     return;
                 }

                 const rect = tableRef.current.getBoundingClientRect();
                 mouseMove(event.clientX - rect.left + tableRef.current.scrollLeft, event.clientY - rect.top + tableRef.current.scrollTop, event);
             }}
        >
            <div
                className={classnames(
                    styles.table,
                    isCanChangeBorderSize && styles.canGrab,
                    changedBorderSizeIndex !== null && styles.grab,
                )}
                style={{gridTemplateColumns: columnsWidth.map(columnsWidth => `${columnsWidth}px`).join(' ')}}
            >
                {columnsWidth.map((columnWidth, columnIndex) => (
                    <div key={columnIndex}>
                        {String.fromCharCode(65 + columnIndex)}
                    </div>
                ))}
            </div>
            <div
                ref={tableRef}
                className={classnames(
                    styles.table,
                    isCanChangeBorderSize && styles.canGrab,
                    changedBorderSizeIndex !== null && styles.grab,
                )}
                style={{gridTemplateColumns: columnsWidth.map(columnsWidth => `${columnsWidth}px`).join(' ')}}
            >
                {data.map((row, rowIndex) => (
                    arrayPad(row, COLUMNS_COUNT, '').map((column, columnIndex) => (
                        <div key={`${rowIndex} ${columnIndex}`}>
                            {column}
                        </div>
                    ))
                ))}
            </div>
        </div>
    );
};

export default TableEditor;
