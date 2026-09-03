"use client";

import React, {FocusEventHandler, MouseEventHandler, RefObject} from "react";
import FieldComponent, {FieldComponentProps} from "@dexodus/react-form/src/fields/FieldComponent";
import TextInput from "../../../inputs/TextInput";

interface StringFieldProps extends FieldComponentProps {
    value: any;
    icon?: React.ReactNode;
    placeholder?: string;
    mask?: string;
    onClick?: MouseEventHandler<HTMLInputElement>;
    onFocus?: FocusEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    inputRef?: RefObject<HTMLInputElement>;
    name?: string;
    autoComplete?: string;
}

const StringField: FieldComponent<StringFieldProps> = ({inputRef, value, onChange, icon, placeholder, mask, name, autoComplete}) => {
    return (
        <TextInput
            inputRef={inputRef}
            value={value}
            setValue={(value) => onChange(value)}
            icon={icon}
            placeholder={placeholder}
            mask={mask}
            name={name}
            autoComplete={autoComplete}
        />
    )
}

export default StringField;
