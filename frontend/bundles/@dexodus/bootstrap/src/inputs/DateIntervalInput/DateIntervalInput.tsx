"use client";

import React, {useRef, useState} from "react";
import styles from "./DateIntervalInput.module.scss";
import DateIntervalHelper, {DateInterval} from "../../helpers/DateIntervalHelper/DateIntervalHelper";
import {InputProps} from "../types";
import TextInput from "../TextInput";
import {mapDateIntervalToString, mapStringToDateInterval} from "../../common/date";
import useOnClickInElements from "../../hooks/useOnClickInElements";
import Popup from "../../UserInterface/Popup";
import useOnClickInDocument from "../../hooks/useOnClickInDocument";
import {IoClose} from "react-icons/io5";

interface DateIntervalInputProps extends InputProps {
    value: DateInterval;
    setValue: React.Dispatch<React.SetStateAction<DateInterval>>;
    helperRef?: React.RefObject<HTMLDivElement>;
}

const DateIntervalInput: React.FC<DateIntervalInputProps> = (
    {
        value,
        setValue,
        containerRef: containerRefParam,
        helperRef: helperRefParam,
        ...otherProps
    },
) => {
    const containerRef = containerRefParam ?? useRef<HTMLDivElement>(null);
    const helperRef = helperRefParam ?? useRef<HTMLDivElement>(null);
    const [isVisibleHelper, setIsVisibleHelper] = useState<boolean>(false);
    useOnClickInElements([containerRef, helperRef], () => {
        setIsVisibleHelper(true);
    });
    useOnClickInDocument([containerRef, helperRef], () => {
        setIsVisibleHelper(false);
    });

    return (
        <div className={styles.dateIntervalInput}>
            <TextInput
                mask="##-##-#### — ##-##-####"
                containerRef={containerRef}
                value={mapDateIntervalToString(value)}
                setValue={value => {
                    if (typeof value === 'function') {
                        setValue(oldValue => mapStringToDateInterval(value(mapDateIntervalToString(oldValue))));
                    } else {
                        setValue(mapStringToDateInterval(value));
                    }
                }}
                {...otherProps}
            />
            {(value.start || value.end) && (
                <div className={styles.dateIntervalClear} onClick={() => {
                    setValue({start: null, end: null});
                }}>
                    <IoClose/>
                </div>
            )}
            <Popup visible={isVisibleHelper} asCard={false}>
                <p></p>
                <DateIntervalHelper helperRef={helperRef} value={value} setValue={setValue}/>
            </Popup>
        </div>
    );
};

export default DateIntervalInput;
