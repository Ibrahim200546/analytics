"use client";

import React from "react";
import styles from "./DateTimePickerField.module.scss";
import stringFieldStyles from "../StringField/StringField.module.scss";
import FieldComponent, {FieldComponentProps} from "@dexodus/react-form/src/fields/FieldComponent";
import DateTimePicker from "react-datetime-picker";
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import './global.scss';

interface DateTimePickerFieldProps extends FieldComponentProps {
}

const DateTimePickerField: FieldComponent<DateTimePickerFieldProps> = ({value, onChange, className}) => {
    return (
        <div className={styles.dateTimePickerField}>
            <DateTimePicker locale="ru-RU" className={stringFieldStyles.stringField} onChange={onChange} value={value} format="y-MM-dd H:mm" />
        </div>
    );
};

export default DateTimePickerField;
