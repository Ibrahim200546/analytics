"use client";

import React, {FocusEventHandler, MouseEventHandler} from "react";
import styles from "./NumberField.module.scss";
import FieldComponent, {FieldComponentProps} from "@dexodus/react-form/src/fields/FieldComponent";
import classnames from "classnames";

interface NumberFieldProps extends FieldComponentProps {
    value: any;
    onClick?: MouseEventHandler<HTMLInputElement>;
    onFocus?: FocusEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
}

const NumberField: FieldComponent<NumberFieldProps> = ({value, onChange, className, ...props}) => {
    return (
        <input
            className={classnames(styles.numberField, className)}
            type="number"
            value={value}
            placeholder="Введите значение..."
            onChange={event => onChange(parseInt(event.target.value ?? 0))}
            {...props}
        />
    )
}

export default NumberField;
