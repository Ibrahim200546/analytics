"use client";

import React from "react";
import FieldComponent, {FieldComponentProps} from "@dexodus/react-form/src/fields/FieldComponent";
import PhoneInput from "../../inputs/PhoneInput";

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
