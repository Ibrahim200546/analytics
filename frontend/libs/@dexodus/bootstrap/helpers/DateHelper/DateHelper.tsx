"use client";

import React from "react";
import styles from "./DateHelper.module.scss";
import {InputProps} from "@/libs/@dexodus/bootstrap/inputs/types";
import DateIntervalHelper, {
    DateInterval,
    DateValue,
} from "@/libs/@dexodus/bootstrap/helpers/DateIntervalHelper/DateIntervalHelper";

interface DateHelperProps {
    value: DateValue,
    setValue: React.Dispatch<React.SetStateAction<DateValue>>,
    helperRef?: React.RefObject<HTMLDivElement>;
}

const DateHelper: React.FC<DateHelperProps> = (
    {
        value,
        setValue,
        helperRef,
    },
) => {
    const generateInterval = (dateValue: DateValue): DateInterval => ({start: dateValue, end: dateValue});

    return (
        <DateIntervalHelper helperRef={helperRef} value={generateInterval(value)} setValue={(intervalStateAction) => {
            const interval = typeof intervalStateAction === "function" ? intervalStateAction(generateInterval(value)) : intervalStateAction;
            const newValue = interval.start || interval.end;
            setValue(newValue);
        }}/>
    );
};

export default DateHelper;
