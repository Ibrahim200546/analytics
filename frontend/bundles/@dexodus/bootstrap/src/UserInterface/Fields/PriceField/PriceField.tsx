"use client";

import React, {useEffect, useRef} from "react";
import {FieldComponent, FieldComponentProps} from "@dexodus/react-form";
import StringField from "@dexodus/bootstrap/src/UserInterface/Fields/StringField";
import {convertNumberToPrice} from "@dexodus/bootstrap/src/common/price";

interface PriceFieldProps extends FieldComponentProps {
    currency: string;
}

const PriceField: FieldComponent<PriceFieldProps> = ({value, onChange, currency}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const correctCursorPosition = (target: HTMLInputElement) => {
        setTimeout(() => {
            if (inputRef.current?.selectionStart) {
                target.selectionStart = Math.min(inputRef.current.selectionStart, target.value.length - currency.length - 1);
            }

            if (inputRef.current?.selectionEnd) {
                target.selectionEnd = Math.min(inputRef.current.selectionEnd, target.value.length - currency.length - 1);
            }
        })
    }

    useEffect(() => {
        const onEvent = (event: Event) => correctCursorPosition(event.target as HTMLInputElement);

        if (inputRef.current) {
            inputRef.current.addEventListener("keydown", onEvent);
            inputRef.current.addEventListener("mousedown", onEvent);
            inputRef.current.addEventListener("mouseup", onEvent);
        }

        return () => {
            if (inputRef.current && "removeEventListener" in inputRef.current) {
                inputRef.current.removeEventListener("keydown", onEvent);
                inputRef.current.removeEventListener("mousedown", onEvent);
                inputRef.current.removeEventListener("mouseup", onEvent);
            }
        }
    }, [inputRef.current?.value]);

    return (
        <StringField inputRef={inputRef} value={convertNumberToPrice(value, currency)} onChange={(value) => {
            if (inputRef.current) {
                correctCursorPosition(inputRef.current as HTMLInputElement);
            }

            if (typeof value !== 'string') {
                return null;
            }

            const number = parseInt(value.replaceAll(' ', ''));

            onChange(number);
        }}/>
    );
};

export default PriceField;
