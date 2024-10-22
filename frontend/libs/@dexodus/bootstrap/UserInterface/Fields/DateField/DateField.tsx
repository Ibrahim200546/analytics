"use client";

import React from "react";
import styles from "./DateField.module.scss";
import DateInput from "@/libs/@dexodus/bootstrap/inputs/DateInput";
import FieldComponent, {FieldComponentProps} from "../../../../react-form/src/fields/FieldComponent";

interface DateFieldProps extends FieldComponentProps {
}

const DateField: FieldComponent<DateFieldProps> = ({value, onChange, className}) => {
    return (
        <DateInput value={value} setValue={onChange}/>
    );
};

export default DateField;
