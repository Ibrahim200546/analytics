"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "./InfinityContainer.module.scss";
import classnames from "classnames";

interface InfinityContainerProps {
    loadPage: (page: number) => React.ReactNode[] | Promise<React.ReactNode[]>;
    className?: string;
}

const InfinityContainer: React.FC<InfinityContainerProps> = ({ loadPage, className }) => {
    const [isFinish, setIsFinish] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [items, setItems] = useState<React.ReactNode[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const scrollParentRef = useRef<HTMLElement | Window>(window);

    // Функция для поиска родительского элемента с прокруткой
    const findScrollParent = (element: HTMLElement): HTMLElement | Window => {
        let parent: HTMLElement | null = element;
        while (parent && parent !== document.body) {
            const { overflowY } = getComputedStyle(parent);
            if (overflowY === "auto" || overflowY === "scroll") {
                return parent;
            }
            parent = parent.parentElement;
        }
        return window; // По умолчанию window
    };

    const applyLoadPage = useCallback(async () => {
        if (isFinish || loading) return;

        setLoading(true);
        const result = loadPage(page);
        const loadedItems = result instanceof Promise ? await result : result;

        if (!loadedItems.length) {
            setIsFinish(true);
        } else {
            setPage((prevPage) => prevPage + 1);
            setItems((prevItems) => [...prevItems, ...loadedItems]);
        }
        setLoading(false);
    }, [isFinish, loading, loadPage, page]);

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;

        const scrollParent = scrollParentRef.current as HTMLElement | Window;

        // Получаем размеры контейнера и прокрутки
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentBottom =
            scrollParent instanceof Window
                ? window.innerHeight
                : scrollParent.getBoundingClientRect().bottom;

        if (containerRect.bottom <= parentBottom + 50 && !loading) {
            applyLoadPage();
        }
    }, [applyLoadPage, loading]);

    useEffect(() => {
        if (page === 1) {
            applyLoadPage();
        }
    }, [applyLoadPage]);

    useEffect(() => {
        if (containerRef.current) {
            scrollParentRef.current = findScrollParent(containerRef.current);
        }

        const scrollParent = scrollParentRef.current;
        scrollParent.addEventListener("scroll", handleScroll);
        return () => {
            scrollParent.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll, applyLoadPage]);

    return (
        <div ref={containerRef} className={classnames(styles.infinityContainer, className)}>
            {items}
            {loading && <div className={styles.loader}>Загрузка...</div>}
        </div>
    );
};

export default InfinityContainer;
