"use client";

import React, {FocusEventHandler, MouseEventHandler} from "react";
import styles from "./StringField.module.scss";
import FieldComponent, {FieldComponentProps} from "@/libs/@dexodus/react-form/src/fields/FieldComponent";
import classnames from "classnames";
import TextInput from "@/libs/@dexodus/bootstrap/inputs/TextInput";

interface StringFieldProps extends FieldComponentProps {
    value: any;
    icon?: React.ReactNode;
    placeholder?: string;
    mask?: string;
    onClick?: MouseEventHandler<HTMLInputElement>;
    onFocus?: FocusEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
}

const StringField: FieldComponent<StringFieldProps> = ({value, onChange, icon, placeholder, mask}) => {
    return (
        <TextInput
            value={value}
            setValue={(value) => onChange(value)}
            icon={icon}
            placeholder={placeholder}
            mask={mask}
        />
    )
}

export default StringField;
