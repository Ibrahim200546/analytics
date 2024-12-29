"use client";

import React, {useEffect} from "react";
import DateInput from "../../../inputs/DateInput";
import FieldComponent, {FieldComponentProps} from "@dexodus/react-form/src/fields/FieldComponent";

interface DateFieldProps extends FieldComponentProps {
}

const DateField: FieldComponent<DateFieldProps> = ({value, onChange, defaultValue}) => {
    useEffect(() => {
        if (!value) {
            onChange(defaultValue)
        }
    }, [])

    if (!value) {
        return <p>Загрузка...</p>
    }

    return (
        <DateInput value={value} setValue={onChange}/>
    );
};

export default DateField;
