"use client";

import React, {FocusEventHandler, MouseEventHandler} from "react";
import styles from "./StringField.module.scss";
import FieldComponent, {FieldComponentProps} from "@/libs/@dexodus/react-form/src/fields/FieldComponent";
import classnames from "classnames";
import TextInput from "@/libs/@dexodus/bootstrap/inputs/TextInput";
import PasswordInput from "@/libs/@dexodus/bootstrap/inputs/PasswordInput";
import PhoneInput from "@/libs/@dexodus/bootstrap/inputs/PhoneInput";

interface PhoneFieldProps extends FieldComponentProps {
    value: any;
    icon?: React.ReactNode;
    placeholder?: string;
}

const PhoneField: FieldComponent<PhoneFieldProps> = ({value, onChange, icon, placeholder}) => {
    return (
        <PhoneInput
            value={value}
            setValue={onChange}
            placeholder={placeholder}
        />
    )
}

export default PhoneField;
