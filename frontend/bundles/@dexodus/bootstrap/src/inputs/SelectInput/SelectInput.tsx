"use client";

import React, {useEffect, useRef, useState} from "react";
import styles from "./SelectInput.module.scss";
import BasicInput from "../BasicInput";
import {InputProps} from "../types";
import useOnClickInDocument from "../../hooks/useOnClickInDocument";
import classnames from "classnames";
import {useFullScroll} from "../../hooks/useFullScroll";
import {ThreeDots} from "react-loader-spinner";
import {useOnValueChange} from "../../hooks/useOnValueChange";
import {calculateHtmlTextSize} from "../../common/html";
import {useQueueCallback} from "../../hooks/useQueueCallback";

export interface SelectOption {
    key: string | number | null;
    value: React.ReactNode;
}

interface SelectInputProps extends InputProps {
    value: null | SelectOption;
    setValue: React.Dispatch<React.SetStateAction<null | SelectOption>>
    loadOptions: (page: number, search: string) => SelectOption[] | Promise<SelectOption[]>;
}

const SelectInput: React.FC<SelectInputProps> = (
    {
        value: option,
        setValue: setOption,
        loadOptions,
        containerRef: containerRefParam,
        inputRef: inputRefParam,
        ...otherProps
    },
) => {
    const [options, setOptions] = useState<SelectOption[]>([]);
    const [isListVisible, setIsListVisible] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [isFullLoaded, setIsFullLoaded] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('')
    const [loadId, setLoadId] = useState(0);
    const containerRef = containerRefParam ?? useRef<HTMLDivElement>(null);
    const inputRef = inputRefParam ?? useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const queueCallback = useQueueCallback();

    useFullScroll(listRef, () => {
        queueCallback.next(async () => await startLoadOptions(page, search, options, isFullLoaded));
    })

    const {isTimeoutWaiting: isSearchTimeoutWaiting} = useOnValueChange(search, 300, () => {
        queueCallback.next(async () => {
            await startLoadOptions(0, search, [], false)
            if (listRef.current) {
                listRef.current.scrollTop = 0;
            }
        });
    });

    const startLoadOptions = async (page: number, search: string, options: SelectOption[], isFullLoaded: boolean) => {
        if (isFullLoaded) {
            return;
        }

        const currentLoadId = loadId;
        const result = loadOptions(page, search);
        const newOptions = result instanceof Promise ? await result : result;

        if (currentLoadId !== loadId) {
            return;
        }

        const mergedOptions = [...options, ...newOptions].reduce((acc, option) => {
            if (acc.find(accOption => accOption.key === option.key)) {
                return acc;
            }

            return [...acc, option];
        }, [] as SelectOption[]);

        if (mergedOptions.length === options.length) {
            setIsFullLoaded(true);
        } else {
            setIsFullLoaded(false);
        }

        setOptions(mergedOptions);
        setPage(page + 1);
        setLoadId(loadId + 1);
    }

    const showList = () => {
        setIsListVisible(true);
    }
    const hideList = () => setIsListVisible(false);

    useOnClickInDocument([containerRef, listRef], () => hideList());

    useEffect(() => {
        queueCallback.next(async () => await startLoadOptions(page, search, options, isFullLoaded));

        if (!listRef.current || !containerRef.current) {
            return;
        }

        listRef.current.style.width = `${Math.max(containerRef.current.offsetWidth, 300)}px`;
        const inputElement = inputRef.current;
        inputElement?.addEventListener('focus', showList);

        return () => {
            inputElement?.removeEventListener('focus', showList);
        }
    }, [inputRef.current]);

    useEffect(() => {
        if (!inputRef.current || !containerRef.current) {
            return;
        }

        // containerRef.current.style.minWidth = `${containerRef.current.offsetWidth}px`;
        // containerRef.current.style.maxWidth = `${containerRef.current.offsetWidth}px`;
        if (!inputRef.current.style.maxWidth) {
            inputRef.current.style.maxWidth = `${containerRef.current.offsetWidth - 48}px`;
        }
        const size = option ? 0 : Math.min(containerRef.current.offsetWidth - 48, calculateHtmlTextSize(inputRef.current.value || inputRef.current.placeholder));
        inputRef.current.style.width = `${size}px`;
        if (inputRef.current.value) {
            setOption(null);
        }
    }, [search, option]);

    const onSelect = (option: SelectOption): void => {
        setSearch('');
        setOption(option);
        setIsListVisible(false);
    }

    useEffect(() => {
        if (inputRef.current) {
            if (option && option.key) {
                inputRef.current.placeholder = '';
            } else {
                inputRef.current.placeholder = 'Выберите...';
            }
        }
    }, [option]);

    const isLoading = queueCallback.isRunning || isSearchTimeoutWaiting;

    return (
        <div className={styles.selectInput}>
            <BasicInput
                type="string"
                value={search}
                setValue={setSearch}
                containerRef={containerRef}
                inputRef={inputRef}
                placeholder="Выберите..."
                inputClassName={styles.input}
                {...otherProps}
            >
                {(icon, input) => (
                    <>
                        <div className={styles.inputWrapper}>
                            {icon}
                            {input}
                            {option?.value}
                        </div>
                        <div style={{opacity: isLoading ? 1 : 0}}>
                            <ThreeDots width={16} height={16}/>
                        </div>
                    </>
                )}
            </BasicInput>
            <div {...(!isListVisible ? {style: {display: 'none'}} : {})} className={classnames(styles.list, 'select-list')} ref={listRef}>
                {options.map(listOption => (
                    <div
                        key={listOption.key}
                        className={classnames(
                            styles.item,
                            option && option.key === listOption.key && styles.active,
                            styles.selectable,
                            'select-list-item',
                            option && option.key === listOption.key && 'active',
                            'selectable',
                        )}
                        onClick={() => onSelect(listOption)}
                    >
                        {listOption.value}
                    </div>
                ))}
                {!options.length && (
                    <div className={classnames(styles.item, 'select-list-item')}>
                        {isLoading ? 'Загрузка...' : 'Ничего не найдено'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectInput;
