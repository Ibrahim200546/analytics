"use client";

import React, {useEffect, useState} from "react";
import styles from "./DropdownField.module.scss";
import Select from "@/libs/@dexodus/common-fields/src/Select"
import FieldComponent, {FieldComponentProps} from "@/libs/@dexodus/react-form/src/fields/FieldComponent";
import SelectInput from "@/libs/@dexodus/bootstrap/inputs/SelectInput";
import {SelectOption} from "@/libs/@dexodus/bootstrap/inputs/SelectInput/SelectInput";

interface DropdownFieldProps extends FieldComponentProps {
    options: {
        [value: string]: string;
    }
}

const DropdownField: FieldComponent<DropdownFieldProps> = ({value, onChange, options}) => {
    const [dropdownValue, setDropdownValue] = useState<SelectOption|null>(null);

    const mappedOptions: SelectOption[] = Object.entries(options).map(([value, title]) => {
        return {value: title, key: value};
    })

    useEffect(() => {
        if (dropdownValue) {
            onChange(dropdownValue.key);
        }
    }, [dropdownValue])

    return (
        <div className={styles.dropdownField}>
            <SelectInput value={dropdownValue} setValue={setDropdownValue} loadOptions={(page) => {
                return mappedOptions.slice(page * 10, page * 10 + 10);
            }}/>
        </div>
    );
};

export default DropdownField;
