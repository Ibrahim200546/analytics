"use client";

import React, {useState, useRef, useEffect} from "react";
import styles from "./DraggableListInput.module.scss";
import { InputProps } from "@/libs/@dexodus/bootstrap/inputs/types";

interface DraggableListInputProps<T> extends InputProps {
    template: (item: T, dragStart: React.MouseEventHandler, isDragging: boolean) => React.ReactNode;
    value: T[];
    setValue: React.Dispatch<React.SetStateAction<T[]>>;
}

const DraggableListInput = <T,>({ value, setValue, template }: DraggableListInputProps<T>) => {
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [draggingItemTop, setDraggingItemTop] = useState<number>(0);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const draggedElementRef = useRef<HTMLDivElement | null>(null);
    const draggingItemHeightRef = useRef<number>(0);
    const [draggingStartOffset, setDraggingStartOffset] = useState<number>(0);
    const [isDraggedItem, setIsDraggedItem] = useState<boolean>(false);

    const handleMouseDown = (e: React.MouseEvent, index: number) => {
        setDraggingIndex(index);
        setIsDragging(true);
        setDragOverIndex(index);
        document.body.style.cursor = 'grabbing';

        if (containerRef.current) {
            containerRef.current.style.minHeight = `${containerRef.current?.offsetHeight}px`;

            const rect = containerRef.current?.children[index].getBoundingClientRect();
            const offset = e.clientY - rect?.top;
            setDraggingStartOffset(offset);
            setDraggingItemTop(e.clientY - offset);
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        setIsDraggedItem(true);

        if (isDragging && draggedElementRef.current && containerRef.current) {
            const clientY = e.clientY;
            const rect = draggedElementRef.current.getBoundingClientRect();
            draggingItemHeightRef.current = rect.height;
            const containerRect = containerRef.current.getBoundingClientRect();
            const newTop = Math.max(containerRect.top, Math.min(clientY - draggingItemHeightRef.current / 2, containerRect.bottom - draggingItemHeightRef.current));
            setDraggingItemTop(newTop);

            // Определяем, над каким элементом находится перетаскиваемый элемент
            const draggedOverItemIndex = Math.floor(
                (newTop - containerRect.top + draggingItemHeightRef.current / 2) / draggingItemHeightRef.current
            );
            setDragOverIndex(draggedOverItemIndex);
        }
    };

    const handleMouseUp = () => {
        setIsDraggedItem(false);
        document.body.style.cursor = 'unset';

        if (draggingIndex != null && dragOverIndex !== null && draggingIndex !== dragOverIndex) {
            const updatedList = [...value];
            const [draggedItem] = updatedList.splice(draggingIndex, 1);
            updatedList.splice(dragOverIndex, 0, draggedItem);
            setValue(updatedList);
        }

        setDraggingIndex(null);
        setDragOverIndex(null);
        setIsDragging(false);
    };

    useEffect(() => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
    }, [isDragging, draggedElementRef.current, containerRef.current, dragOverIndex, draggingStartOffset]);

    return (
        <div className={styles.draggableListInput} ref={containerRef} style={{ position: 'relative' }}>
            {value.map((item, index) => {
                let offset = 0;

                if (isDragging && draggingIndex !== null && dragOverIndex !== null) {
                    if (index === draggingIndex) {
                        return (
                            <div
                                key={index}
                                ref={draggedElementRef}
                                className={styles.draggableItem}
                                style={{
                                    position: "absolute",
                                    top: `${draggingItemTop - containerRef.current!.getBoundingClientRect().top}px`,
                                    width: "100%",
                                    zIndex: 1000,
                                    opacity: 1,
                                }}
                            >
                                {template(item, () => {}, isDragging)}
                            </div>
                        );
                    }

                    if (index > dragOverIndex || (index <= draggingIndex && index >= dragOverIndex)) {
                        offset = draggingItemHeightRef.current;
                    }
                }

                return (
                    <div
                        key={index}
                        className={styles.draggableItem}
                        style={{
                            transform: `translateY(${offset}px)`,
                            transition: (draggingIndex !== index && isDraggedItem) ? "transform 0.2s ease" : "none",
                        }}
                    >
                        {template(item, event => handleMouseDown(event, index), isDragging)}
                    </div>
                );
            })}
        </div>
    );
};

export default DraggableListInput;
