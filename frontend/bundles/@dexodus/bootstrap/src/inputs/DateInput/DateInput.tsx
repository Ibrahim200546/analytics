"use client";

import React, {useRef, useState} from "react";
import styles from "./DateInput.module.scss";
import {Input, InputProps} from "../types";
import {DateValue} from "../../helpers/DateIntervalHelper";
import useOnClickInElements from "../../hooks/useOnClickInElements";
import useOnClickInDocument from "../../hooks/useOnClickInDocument";
import TextInput from "../TextInput";
import Popup from "../../UserInterface/Popup";
import {mapDateValueToString, mapStringToDateValue} from "../../common/date";
import DateHelper from "../../helpers/DateHelper/DateHelper";

interface DateInputProps extends InputProps {
    value: DateValue;
    setValue: React.Dispatch<React.SetStateAction<DateValue>>;
    containerRef?: React.RefObject<HTMLDivElement>;
    helperRef?: React.RefObject<HTMLDivElement>;
}

const DateInput: Input<DateInputProps> = (
    {
        value,
        setValue,
        containerRef: containerRefParam,
        helperRef: helperRefParam,
        ...otherProps
    },
) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const containerRef = containerRefParam ?? useRef<HTMLDivElement>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const helperRef = helperRefParam ?? useRef<HTMLDivElement>(null);
    const [isVisibleHelper, setIsVisibleHelper] = useState<boolean>(false);
    useOnClickInElements([containerRef, helperRef], () => {
        setIsVisibleHelper(true);
    });
    useOnClickInDocument([containerRef, helperRef], () => {
        setIsVisibleHelper(false);
    });

    console.log('birthday', typeof value, value);

    return (
        <div className={styles.dateInput}>
            <TextInput
                mask="##-##-####"
                containerRef={containerRef}
                value={mapDateValueToString(value)}
                setValue={value => {
                    if (typeof value === "function") {
                        setValue(oldValue => mapStringToDateValue(value(mapDateValueToString(oldValue))));
                    } else {
                        setValue(mapStringToDateValue(value));
                    }
                }}
                {...otherProps}
            />
            <Popup visible={isVisibleHelper} asCard={false}>
                <DateHelper helperRef={helperRef} value={value} setValue={setValue}/>
            </Popup>
        </div>
    );
};

export default DateInput;
