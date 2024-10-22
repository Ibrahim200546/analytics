"use client";

import React, {useEffect, useRef, useState} from "react";
import styles from "./TextInput.module.scss";
import {createMaskTokens, processValueByMaskTokens} from "@/libs/@dexodus/bootstrap/common/mask";
import {Input, InputProps} from "@/libs/@dexodus/bootstrap/inputs/types";
import {MaskTokenInterface} from "@/libs/@dexodus/bootstrap/common/mask/MaskTokenInterface";
import classnames from "classnames";
import BasicInput from "@/libs/@dexodus/bootstrap/inputs/BasicInput";

interface TextInputProps extends InputProps {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    mask?: string;
    placeholder?: string;
}

const TextInput: Input<TextInputProps> = (
    {
        placeholder = 'Введите значение...',
        value,
        setValue,
        mask,
        ...otherProps
    },
) => {
    const [maskTokens, setMaskTokens] = useState<MaskTokenInterface[]>([]);

    const processValue = (newValue: string): string => {
        if (mask) {
            const valueByMaskTokens = processValueByMaskTokens(newValue, value, maskTokens);

            return valueByMaskTokens.length ? valueByMaskTokens : '';
        }

        return newValue.length ? newValue : '';
    }

    useEffect(() => {
        if (mask) {
            setMaskTokens(createMaskTokens(mask));
        }

    }, [mask]);

    useEffect(() => {
        setValue(processValue(value));
    }, [maskTokens]);

    const onChange = (value: string) => {
        const newValue = processValue(value);
        setValue(newValue);
    }

    return (
        <BasicInput
            type="text"
            value={value}
            setValue={onChange}
            placeholder={placeholder}
            {...otherProps}
        />
    );
};

export default TextInput;
