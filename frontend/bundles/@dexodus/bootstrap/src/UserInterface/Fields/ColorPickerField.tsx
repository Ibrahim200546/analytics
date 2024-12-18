"use client";

import React, {MouseEventHandler, useEffect, useRef, useState} from "react";
import styles from "./ColorPickerField.module.scss";
import FieldComponent, {FieldComponentProps} from "@dexodus/react-form/src/fields/FieldComponent";
import {ChromePicker} from "react-color";
import StringField from "../../UserInterface/Fields/StringField";

interface ColorPickerFieldProps extends FieldComponentProps {
}

const ColorPickerField: FieldComponent<ColorPickerFieldProps> = ({onChange, value}) => {
    const [color, setColor] = useState<string>('#FFFFFF')
    const [showPicker, setShowPicker] = useState<boolean>(false)
    const divRef = useRef<HTMLDivElement>();

    const changeColor = (color: any): void => {
        onChange(color.hex);
    }

    useEffect(() => {
        const click: MouseEventHandler = (event) => {
            let parent: Element | null = event.target as any;

            while (parent) {
                if (parent === divRef.current || parent === null) {
                    return;
                }

                parent = parent.parentElement;
            }

            setShowPicker(false);
        }

        document.addEventListener("click", click as any)

        return () => document.removeEventListener("click", click as any);
    }, []);

    return (
        <div ref={divRef as any} className={styles.colorPickerField} onFocus={() => setShowPicker(true)}>
            <StringField value={value} onChange={onChange}/>
            {showPicker && (
                <div className={styles.colorPickerField__pickerContainer}>
                    <ChromePicker onChangeComplete={changeColor} onChange={(color) => setColor(color.hex)} color={color}/>
                </div>
            )}
        </div>
    );
};

export default ColorPickerField;
