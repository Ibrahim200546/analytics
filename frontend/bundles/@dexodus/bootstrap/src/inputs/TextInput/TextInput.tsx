"use client";

import React, {useEffect, useState} from "react";
import {createMaskTokens, processValueByMaskTokens} from "../../common/mask";
import {Input, InputProps} from "../types";
import {MaskTokenInterface} from "../../common/mask/MaskTokenInterface";
import BasicInput from "../BasicInput";

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
