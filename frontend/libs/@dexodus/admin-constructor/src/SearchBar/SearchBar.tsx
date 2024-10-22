'use client'

import React, {useEffect, useRef, useState} from "react";
import styles from "./SearchBar.module.scss";
import Input from "@/libs/@dexodus/admin-constructor/src/Form/Input";
import Link from "next/link";
import classnames from "classnames";
import {useRouter} from "next/navigation";
import useOnClickInDocument from "@/libs/@dexodus/bootstrap/hooks/useOnClickInDocument";
import useApiFetch from "@/libs/@dexodus/api-fetch/src/hooks/useApiFetch";

interface SearchBarProps {
}

interface SystemItem {
    content: string;
    link: string;
}

const KEY_UP = 'ArrowUp';
const KEY_DOWN = 'ArrowDown';
const KEY_ENTER = 'Enter';

const SearchBar: React.FC<SearchBarProps> = () => {
    const [search, setSearch] = useState<string>('');
    const [systemItems, setSystemItems] = useState<SystemItem[]>([]);
    const [searchQueryTimer, setSearchQueryTimer] = useState<NodeJS.Timeout | undefined>();
    const [selectedSystemItem, setSelectedSystemItem] = useState<number | undefined>();
    const divRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const apiFetch = useApiFetch();
    useOnClickInDocument([divRef], () => {setSearch(''); searchSystemItems()});

    const searchSystemItems = () => {
        if (search.trim() === '') {
            setSystemItems([]);

            return;
        }

        (async () => {
            const data = await apiFetch(`/search-engine/search/${search}`);
            const systemItems: SystemItem[] = Object.values(await data.json());
            setSystemItems(systemItems);
            setSearchQueryTimer(undefined);
            setSelectedSystemItem(undefined);
        })();
    }

    useEffect(() => {
        if (searchQueryTimer) {
            clearTimeout(searchQueryTimer);
        }

        setSearchQueryTimer(setTimeout(searchSystemItems, 200));
    }, [search]);

    const generatePathForSystemItem = (systemItem: SystemItem): string => {
        return '/admin/' + systemItem.link.replaceAll('.', '/');
    }

    const keyPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === KEY_ENTER && selectedSystemItem !== undefined) {
            const systemItem = systemItems[selectedSystemItem];
            const path = generatePathForSystemItem(systemItem);

            setSelectedSystemItem(undefined);
            setSystemItems([]);
            setSearch('');

            router.push(path);

            return;
        }

        if (event.code !== KEY_UP && event.code !== KEY_DOWN) {
            return;
        }

        event.preventDefault();

        if (selectedSystemItem === undefined && systemItems.length > 0) {
            setSelectedSystemItem(0);

            return;
        }

        if (selectedSystemItem === undefined) {
            return;
        }

        setSelectedSystemItem(selectedSystemItem => {
            const newSelectedSystemItem = selectedSystemItem as number + (event.code === KEY_UP ? -1 : 1);

            if (newSelectedSystemItem < 0) {
                return systemItems.length - 1;
            }

            if (newSelectedSystemItem >= systemItems.length) {
                return 0;
            }

            return newSelectedSystemItem;
        });
    }

    return (
        <div ref={divRef} className={styles.searchContainer}>
            <Input
                value={search}
                onChange={event => setSearch(event.target.value)}
                className={styles.searchBar}
                placeholder="Поиск в системе..."
                onKeyDown={event => keyPressed(event)}
            />
            {systemItems.length > 0 && (
                <div className={styles.systemItemsContainer}>
                    {systemItems.map((systemItem, index) => (
                        <Link
                            href={generatePathForSystemItem(systemItem)}
                            key={systemItem.link}
                            className={classnames(styles.systemItem, index === selectedSystemItem ? styles.selected : '')}
                            onClick={() => {
                                setSystemItems([]);
                                setSearch('');
                            }}
                        >
                            {systemItem.content}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SearchBar;
