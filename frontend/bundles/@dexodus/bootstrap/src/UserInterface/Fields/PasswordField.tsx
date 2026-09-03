"use client";

import React, {FocusEventHandler, MouseEventHandler} from "react";
import FieldComponent, {FieldComponentProps} from "@dexodus/react-form/src/fields/FieldComponent";
import PasswordInput from "../../inputs/PasswordInput";

interface PasswordFieldProps extends FieldComponentProps {
    value: any;
    icon?: React.ReactNode;
    placeholder?: string;
    onClick?: MouseEventHandler<HTMLInputElement>;
    onFocus?: FocusEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    name?: string;
    autoComplete?: string;
}

const PasswordField: FieldComponent<PasswordFieldProps> = ({value, onChange, icon, placeholder, name, autoComplete}) => {
    return (
        <PasswordInput
            value={value}
            setValue={onChange}
            icon={icon}
            placeholder={placeholder}
            name={name}
            autoComplete={autoComplete}
        />
    )
}

export default PasswordField;
