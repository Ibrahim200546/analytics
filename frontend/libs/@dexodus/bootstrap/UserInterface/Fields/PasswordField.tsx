"use client";

import React, {FocusEventHandler, MouseEventHandler} from "react";
import styles from "./StringField.module.scss";
import FieldComponent, {FieldComponentProps} from "@/libs/@dexodus/react-form/src/fields/FieldComponent";
import classnames from "classnames";
import TextInput from "@/libs/@dexodus/bootstrap/inputs/TextInput";
import PasswordInput from "@/libs/@dexodus/bootstrap/inputs/PasswordInput";

interface PasswordFieldProps extends FieldComponentProps {
    value: any;
    icon?: React.ReactNode;
    placeholder?: string;
    onClick?: MouseEventHandler<HTMLInputElement>;
    onFocus?: FocusEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
}

const PasswordField: FieldComponent<PasswordFieldProps> = ({value, onChange, icon, placeholder}) => {
    return (
        <PasswordInput
            value={value}
            setValue={onChange}
            icon={icon}
            placeholder={placeholder}
        />
    )
}

export default PasswordField;
