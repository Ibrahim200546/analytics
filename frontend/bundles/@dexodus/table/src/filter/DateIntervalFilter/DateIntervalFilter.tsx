import React, {useState} from "react";
import FilterComponentInterface from "../FilterComponentInterface";
import DateIntervalInput from "@dexodus/bootstrap/src/inputs/DateIntervalInput";
import {mapDateValueToDate} from "@dexodus/bootstrap/src/common/date";
import {DateInterval} from "@dexodus/bootstrap/src/helpers/DateIntervalHelper/DateIntervalHelper";
import styles from "./DateIntervalFilter.module.scss";

const DateIntervalFilter: FilterComponentInterface = ({filter, applyFilter}) => {
    const defaultValue: DateInterval = filter.data?.length ? {start: filter.data[0] ? mapDateValueToDate(filter.data[0]) : null, end: filter.data[1].length ? mapDateValueToDate(filter.data[1]) : null} : {
        start: null,
        end: null,
    };
    const [value, setValue] = useState(defaultValue);

    return (
        <DateIntervalInput containerClassName={styles.dateIntervalFilter} value={value} setValue={setStateAction => {
            const newValue = typeof setStateAction === "function" ? setStateAction(value) : setStateAction;
            setValue(newValue);
            const start = mapDateValueToDate(newValue.start);
            const end = mapDateValueToDate(newValue.end);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            applyFilter(start ? `${start.getFullYear()}-${(start.getMonth() + 1).toString().padStart(2, "0")}-${start.getDate().toString().padStart(2, "0")} 00:00:00` : "", end ? `${end.getFullYear()}-${(end.getMonth() + 1).toString().padStart(2, "0")}-${end.getDate().toString().padStart(2, "0")} 23:59:59` : "");
        }}/>
    );
};

export default DateIntervalFilter;
