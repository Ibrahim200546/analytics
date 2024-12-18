"use client";

import React from "react";
import styles from "./DropdownField.module.scss";
import FieldComponent, {FieldComponentProps} from "@dexodus/react-form/src/fields/FieldComponent";
import SelectInput from "../../../inputs/SelectInput";
import {SelectOption} from "../../../inputs/SelectInput/SelectInput";

interface DropdownFieldProps extends FieldComponentProps {
    options: {
        [value: string]: string;
    }
}

const DropdownField: FieldComponent<DropdownFieldProps> = ({value, onChange, options}) => {
    const mappedOptions: SelectOption[] = Object.entries(options).map(([value, title]) => {
        return {value: title, key: value};
    })

    return (
        <div className={styles.dropdownField}>
            <SelectInput value={value} setValue={onChange} loadOptions={(page) => {
                return mappedOptions.slice(page * 10, page * 10 + 10);
            }}/>
        </div>
    );
};

export default DropdownField;
