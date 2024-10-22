"use client";

import React, {useRef, useState} from "react";
import styles from "./DateInput.module.scss";
import {Input, InputProps} from "@/libs/@dexodus/bootstrap/inputs/types";
import {mapStringToTimeValue, mapTimeValueToString, TimeValue} from "@/libs/@dexodus/bootstrap/common/time";
import {DateValue} from "@/libs/@dexodus/bootstrap/helpers/DateIntervalHelper/DateIntervalHelper";
import useOnClickInElements from "@/libs/@dexodus/bootstrap/hooks/useOnClickInElements";
import useOnClickInDocument from "@/libs/@dexodus/bootstrap/hooks/useOnClickInDocument";
import TextInput from "@/libs/@dexodus/bootstrap/inputs/TextInput";
import Popup from "@/libs/@dexodus/bootstrap/UserInterface/Popup";
import TimeHelper from "@/libs/@dexodus/bootstrap/helpers/TimeHelper";
import {mapDateValueToString, mapStringToDateValue} from "@/libs/@dexodus/bootstrap/common/date";
import DateHelper from "@/libs/@dexodus/bootstrap/helpers/DateHelper/DateHelper";

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
