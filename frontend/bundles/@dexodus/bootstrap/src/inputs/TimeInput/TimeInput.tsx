"use client";

import React, {useRef, useState} from "react";
import styles from "./TimeInput.module.scss";
import TextInput from "../TextInput";
import {Input, InputProps} from "../types";
import {mapStringToTimeValue, mapTimeValueToString, TimeValue} from "../../common/time";
import Popup from "../../UserInterface/Popup";
import useOnClickInElements from "../../hooks/useOnClickInElements";
import useOnClickInDocument from "../../hooks/useOnClickInDocument";
import TimeHelper from "../../helpers/TimeHelper";

interface TimeInputProps extends InputProps {
    value: TimeValue;
    setValue: React.Dispatch<React.SetStateAction<TimeValue>>;
    containerRef?: React.RefObject<HTMLDivElement>;
    helperRef?: React.RefObject<HTMLDivElement>;
}

const TimeInput: Input<TimeInputProps> = (
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
        <div className={styles.timeInput}>
            <TextInput
                mask="##:##:##"
                containerRef={containerRef}
                value={mapTimeValueToString(value)}
                setValue={value => {
                    if (typeof value === "function") {
                        setValue(oldValue => mapStringToTimeValue(value(mapTimeValueToString(oldValue))));
                    } else {
                        setValue(mapStringToTimeValue(value));
                    }
                }}
                {...otherProps}
            />
            <Popup visible={isVisibleHelper} asCard={false}>
                <p></p>
                <TimeHelper helperRef={helperRef} value={value} setValue={setValue}/>
            </Popup>
        </div>
    );
};

export default TimeInput;
