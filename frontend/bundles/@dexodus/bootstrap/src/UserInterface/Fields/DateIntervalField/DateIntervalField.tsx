"use client";

import React from "react";
import {FieldComponent, FieldComponentProps} from "@dexodus/react-form";
import DateIntervalInput from "@dexodus/bootstrap/src/inputs/DateIntervalInput";

interface DateIntervalFieldProps extends FieldComponentProps {
}

const DateIntervalField: FieldComponent<DateIntervalFieldProps> = ({value, onChange}) => {
    return (
        <DateIntervalInput value={value} setValue={onChange}/>
    );
};

export default DateIntervalField;
