import moment from "moment";
import {arrayChunks} from "@/libs/@dexodus/bootstrap/common/array";
import {DateInterval, DateValue} from "@/libs/@dexodus/bootstrap/helpers/DateIntervalHelper/DateIntervalHelper";

export const getCountDatesInMonth = (date: Date) => {
    const lastDayInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return lastDayInMonth.getDate();
};

export const getFirstDateInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getFirstDayInMonth = (date: Date) => {
    let expectedDate = getFirstDateInMonth(date);

    while (expectedDate.getDay() !== 1) {
        expectedDate.setDate(expectedDate.getDate() + 1);
    }

    return expectedDate;
};

export type Week = Date[];
export type MonthTable = Week[];

export const generateMonthTable = (date: Date): MonthTable => {
    const firstDayInMonth = getFirstDayInMonth(date);
    const startDate = new Date(date.getFullYear(), date.getMonth(), firstDayInMonth.getDate() - 7);
    let offset = 0;
    const table = [];
    let row = [];

    while (table.length < 6) {
        const computedDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate() + offset,
        );
        offset++;
        row.push(computedDate);

        if (row.length === 7) {
            table.push(row);
            row = [];
        }
    }

    return table.filter(week => {
        return week.reduce((acc, day) => acc || day.getMonth() === date.getMonth(), false)
    })
};

export const generateDaysNames = (): string[] => {
    const firstDay = getFirstDayInMonth(new Date());
    const names = [];

    while (names.length < 7) {
        const computedDate: Date = new Date(
            firstDay.getFullYear(),
            firstDay.getMonth(),
            firstDay.getDate() + names.length,
        );
        names.push(moment(computedDate).format('dd'));
    }

    return names;
}

export const compareDates = (date1: Date, date2: Date): -1 | 0 | 1 => {
    if (date1.getFullYear() > date2.getFullYear()) {
        return 1;
    } else if (date1.getFullYear() < date2.getFullYear()) {
        return -1;
    }

    if (date1.getMonth() > date2.getMonth()) {
        return 1;
    } else if (date1.getMonth() < date2.getMonth()) {
        return -1;
    }

    if (date1.getDate() > date2.getDate()) {
        return 1;
    } else if (date1.getDate() < date2.getDate()) {
        return -1;
    }

    return 0;
}

enum IntervalVariable {
    YEAR = 'year|years',
    MONTH = 'month|months',
    DATE = 'date|dates|day|days',
    HOUR = 'hour|hours',
    MINUTE = 'minute|minutes',
    SECOND = 'second|seconds',
}

interface Interval {
    type: IntervalVariable;
    value: number;
}

const extractIntervals = (interval: string): Interval[] => {
    const chunks = arrayChunks(interval.split(' '), 2);
    const intervals: Interval[] = [];

    for (const chunk of chunks) {
        if (chunk.length !== 2) {
            throw new Error(`Bad interval "${interval}"`);
        }

        const value = parseInt(chunk[0]);
        const intervalVariable = chunk[1].toLowerCase();

        let type: IntervalVariable | undefined = undefined;

        for (const key in IntervalVariable) {
            const regex = new RegExp(IntervalVariable[key as keyof typeof IntervalVariable], 'i');
            if (regex.test(intervalVariable)) {
                type = IntervalVariable[key as keyof typeof IntervalVariable];
                break;
            }
        }

        if (!type) {
            throw new Error(`Invalid interval variable "${intervalVariable}" in interval "${interval}"`);
        }

        intervals.push({ type, value });
    }

    return intervals;
}

export const addIntervalToDate = (date: Date, stringInterval: string): Date => {
    const intervals = extractIntervals(stringInterval);
    let computedDate = new Date(date); // Клонирование даты

    for (const interval of intervals) {
        switch (interval.type) {
            case IntervalVariable.YEAR:
                computedDate.setFullYear(computedDate.getFullYear() + interval.value);
                break;
            case IntervalVariable.MONTH:
                computedDate.setMonth(computedDate.getMonth() + interval.value);
                break;
            case IntervalVariable.DATE:
                computedDate.setDate(computedDate.getDate() + interval.value);
                break;
            case IntervalVariable.HOUR:
                computedDate.setHours(computedDate.getHours() + interval.value);
                break;
            case IntervalVariable.MINUTE:
                computedDate.setMinutes(computedDate.getMinutes() + interval.value);
                break;
            case IntervalVariable.SECOND:
                computedDate.setSeconds(computedDate.getSeconds() + interval.value);
                break;
            default:
                throw new Error(`Unknown interval type "${interval.type}"`);
        }
    }

    return computedDate;
}

export const mapDateValueToDate = (dateValue: DateValue): Date | null => {
    return typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
}

export const mapDateValueToString = (dateValue: DateValue): string => {
    const date = mapDateValueToDate(dateValue);

    if (date === null) {
        return '';
    }

    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
}

export const mapDateIntervalToString = (dateInterval: DateInterval): string => {
    return `${mapDateValueToString(dateInterval.start)} — ${mapDateValueToString(dateInterval.end)}`;
}

export const mapStringToDateValue = (string: string): DateValue => {
    if (!string) {
        return null;
    }
    const [day, month, year] = string.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date string: ${string}`);
    }
    return date;
}

export const mapStringToDateInterval = (string: string): DateInterval => {
    const [startStr, endStr] = string.split(' — ');

    const firstDateValue = startStr ? mapStringToDateValue(startStr) : null;
    const secondDateValue = endStr ? mapStringToDateValue(endStr) : null;

    const firstDate = mapDateValueToDate(firstDateValue);
    const secondDate = mapDateValueToDate(secondDateValue);

    if (firstDate && secondDate && compareDates(firstDate, secondDate) === 1) {
        return {
            start: secondDateValue,
            end: firstDateValue,
        };
    }

    return {
        start: firstDateValue,
        end: secondDateValue,
    };
}
