"use client";

import React from "react";
import DateInput from "../../../inputs/DateInput";
import FieldComponent, {FieldComponentProps} from "@dexodus/react-form/src/fields/FieldComponent";

interface DateFieldProps extends FieldComponentProps {
}

const DateField: FieldComponent<DateFieldProps> = ({value, onChange}) => {
    return (
        <DateInput value={value} setValue={onChange}/>
    );
};

export default DateField;
