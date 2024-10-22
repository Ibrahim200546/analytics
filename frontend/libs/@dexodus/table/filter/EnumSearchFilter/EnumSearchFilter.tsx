"use client";

import React, {useEffect, useState} from "react";
import styles from "./EnumSearchFilter.module.scss";
import FilterComponentInterface from "@/libs/@dexodus/table/filter/FilterComponentInterface";
import {EnumSearchFilter as EnumSearchColumnFilter} from "@/libs/@dexodus/table/adapter/EntityTableAdapter";
import SelectInput from "@/libs/@dexodus/bootstrap/inputs/SelectInput";
import {SelectOption} from "@/libs/@dexodus/bootstrap/inputs/SelectInput/SelectInput";

const EnumSearchFilter: FilterComponentInterface = ({filter, applyFilter, column}) => {
    const columnFilter = filter as unknown as EnumSearchColumnFilter;

    // @ts-ignore
    const defaultValue = (filter.data?.length ? columnFilter.options.options.find((option: any) => option.value === filter.data[0]) : null);
    const [value, setValue] = useState<SelectOption|null>(defaultValue ? {value: defaultValue.label, key: defaultValue.value} : null);

    useEffect(() => {
        if (!value) {
            return;
        }

        if (value.key === '') {
            setValue(null);
            applyFilter();

            return;
        }

        if (typeof value.key === "string") {
            applyFilter(value.key);
        }
    }, [value]);

    return (
        <SelectInput containerClassName={styles.enumSearchFilter} value={value} setValue={setValue} loadOptions={(page, search) => {
            const slicedOptions = columnFilter.options.options.slice(page * 10, page * 10 + 10).map(option => ({key: option.value, value: option.label} as SelectOption));

            if (page === 0) {
                return [{key: '', value: 'Все'}, ...slicedOptions];
            }

            return slicedOptions;
        }}/>
    );
};

export default EnumSearchFilter;
