import React, {FormEventHandler, useState} from "react";
import styles from "./Checkbox.module.scss"
import { v4 } from "uuid";
import classnames from "classnames";

export enum CheckboxStyle {
    Default = "Default",
    Primary = "Primary",
    Success = "Success",
    Info = "Info",
    Warning = "Warning",
    Danger = "Danger",
    Violet = "Violet",
    Pink = "Pink",
    Inverse = "Inverse",
}

interface CheckboxProps {
    label?: React.ReactNode;
    onChange?: (value: boolean) => void;
    value?: boolean;
    checkboxStyle?: CheckboxStyle;
    rounded?: boolean;
    disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = (
    {
        label,
        value,
        onChange,
        checkboxStyle = CheckboxStyle.Default,
        rounded = false,
        disabled = false,
    }
) => {
    const [id, setId] = useState(v4())

    return (
        <div className={styles.checkbox}>
            <input disabled={disabled} id={id} className={styles.checkbox__mark} type="checkbox" onChange={event => onChange && onChange(event.target.checked)}/>
            <label htmlFor={id} className={classnames(
                styles.checkbox__label,
                value && styles.checkbox__label_checked,
                value && styles[`checkbox__label_checked_style${checkboxStyle}`],
                rounded && styles[`checkbox__label_rounded`],
                disabled && styles[`checkbox__label_disabled`],
                value && disabled && styles[`checkbox__label_checked_style${checkboxStyle}_disabled`],
            )}>{label}</label>
        </div>
    )
}

export default Checkbox;
