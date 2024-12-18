"use client";

import React, {useEffect, useRef, useState} from "react";
import styles from "./DateIntervalHelper.module.scss";
import moment from "moment";
import classnames from "classnames";
import {VscChevronLeft, VscChevronRight} from "react-icons/vsc";
import {
    addIntervalToDate,
    compareDates,
    generateDaysNames,
    generateMonthTable, mapDateIntervalToString, mapStringToDateInterval,
    MonthTable,
} from "../../common/date";
import {useVerticalCarousel} from "../../hooks/useVerticalCarousel";

export type DateValue = Date | string | null;
export type DateInterval = {start: DateValue, end: DateValue};

interface DateIntervalHelperProps {
    value: DateInterval;
    setValue: React.Dispatch<React.SetStateAction<DateInterval>>;
    helperRef?: React.RefObject<HTMLDivElement>;
}

const DateIntervalHelper: React.FC<DateIntervalHelperProps> = (
    {
        value: interval,
        setValue: setInterval,
        helperRef,
    },
) => {
    const [isOffsetMode, setIsOffsetMode] = useState<boolean>(false);
    const [offsetStayDate, setOffsetStayDate] = useState<null | Date>(null);
    const [monthTable, setMonthTable] = useState<MonthTable>([]);
    const daysNamesRef = useRef<string[]>([]);

    const startDate = typeof interval.start === 'string' ? new Date(interval.start) : interval.start;
    const endDate = typeof interval.end === 'string' ? new Date(interval.end) : interval.end;

    const [dateInQuestion, setDateInQuestion] = useState<Date>(startDate ?? new Date());

    const [hoverDate, setHoverDate] = useState<Date | null>(null);

    useEffect(() => {
        daysNamesRef.current = generateDaysNames();
    }, []);

    useEffect(() => {
        const monthTable = generateMonthTable(dateInQuestion);
        setMonthTable(monthTable);
        setCurrentElementInMonthTableCarousel(renderMonthTable(monthTable));
        setCurrentElementInMonthNameCarousel(renderMonthName(dateInQuestion));
        setCurrentElementInYearCarousel(renderYear(dateInQuestion));
    }, [dateInQuestion]);

    const onDateClick = (date: Date): void => {
        if (isScrollingMonthTableCarousel) {
            return;
        }

        if (startDate && endDate) {
            setInterval({start: date, end: null});
            return;
        }

        if (!startDate) {
            setInterval({start: date, end: endDate});
            return;
        }

        setInterval({start: startDate, end: date});
    }

    const onHoverDate = (date: Date | null): void => {
        if (isScrollingMonthTableCarousel) {
            return;
        }

        if (!isOffsetMode) {
            setHoverDate(date);
        }

        if (date === null || (!startDate && !endDate) || (startDate && endDate)) {
            if (isOffsetMode) {
                const stayDateString = mapDateIntervalToString({start: offsetStayDate, end: date});
                setInterval(mapStringToDateInterval(stayDateString));
            }

            return;
        }

        const firstDate = (startDate || endDate) as Date;
        const compareResult = compareDates(firstDate, date);

        if (startDate && !endDate && compareResult === 1) {
            setInterval({start: null, end: startDate});
        }

        if (!startDate && endDate && compareResult === -1) {
            setInterval({start: endDate, end: null});
        }
    }

    useEffect(() => {
        if (!isScrollingMonthTableCarousel && parseInt(monthTableCarouselRef.current?.style.maxHeight ?? '0') > 0) {
            setCurrentElementInMonthTableCarousel(renderMonthTable(monthTable));
        }
    }, [interval, hoverDate, isOffsetMode]);

    const renderMonthTable = (monthTable: MonthTable): React.ReactNode => {
        return (
            <>
                {monthTable.map(week => {
                    let start = startDate;
                    let end = endDate;
                    const isGhost = hoverDate && ((start && !end) || (!start && end));

                    if (startDate && !endDate && hoverDate) {
                        end = hoverDate
                    }

                    if (!startDate && endDate && hoverDate) {
                        start = hoverDate
                    }

                    if (startDate && !endDate && !hoverDate) {
                        end = startDate;
                    }

                    if (!startDate && endDate && !hoverDate) {
                        start = endDate;
                    }

                    return (
                        <div key={week[0].toString()} className={classnames(styles.week, 'week')}>
                            {week.map(date => {
                                const placementRelativelyStart = start && compareDates(date, start);
                                const placementRelativelyEnd = end && compareDates(date, end);
                                const showAsGhost = (isGhost && (!startDate || placementRelativelyStart !== 0) && (!endDate || placementRelativelyEnd !== 0)) && (placementRelativelyStart !== -1 && placementRelativelyEnd !== 1) && !isOffsetMode;
                                const isCanDraggable = !showAsGhost && startDate && endDate && (placementRelativelyStart === 0 || placementRelativelyEnd === 0);

                                return (
                                    <div
                                        key={date.toString()}
                                        className={classnames(
                                            styles.date, 'date',
                                            ...(isCanDraggable && isOffsetMode ? [styles.isDraggable, 'is-draggable'] : []),
                                            ...(isCanDraggable && !isOffsetMode ? [styles.isCanDraggable, 'is-can-draggable'] : []),
                                            ...(date.getMonth() === dateInQuestion.getMonth() ? [styles.currentMonth, 'currentMonth'] : []),
                                            ...((placementRelativelyStart === 1 && placementRelativelyEnd === -1) ? [styles.betweenStartAndEnd, 'between-start-and-end'] : []),
                                            ...(placementRelativelyStart === 0 ? [styles.start, 'start'] : []),
                                            ...(placementRelativelyEnd === 0 ? [styles.end, 'end'] : []),
                                            ...(showAsGhost ? [styles.ghost, 'ghost'] : []),
                                            ...((startDate && placementRelativelyStart === 0) || (endDate && placementRelativelyEnd === 0) || ((startDate && endDate) && (placementRelativelyStart === 1 && placementRelativelyEnd === -1)) ? [styles.active, 'active'] : []),
                                        )}
                                        onClick={() => onDateClick(date)}
                                        onMouseEnter={() => onHoverDate(date)}
                                        onTouchMove={event => {
                                            if (!monthTableCarouselRef.current) {
                                                return;
                                            }

                                            const touch = event.touches[0];
                                            const rect = monthTableCarouselRef.current.getBoundingClientRect();

                                            const relativeX = touch.clientX - rect.left;
                                            const relativeY = touch.clientY - rect.top;

                                            const cellWidth = rect.width / 7;
                                            const cellHeight = rect.height / monthTable.length;
                                            const col = Math.floor(relativeX / cellWidth);
                                            const row = Math.floor(relativeY / cellHeight);
                                            const date = monthTable[row][col];

                                            onHoverDate(date);
                                        }}
                                        onMouseDown={() => {
                                            if (!isCanDraggable) {
                                                return;
                                            }

                                            setIsOffsetMode(true);
                                            setOffsetStayDate(placementRelativelyStart === 0 ? endDate : startDate);
                                        }}
                                        onTouchStart={() => {
                                            if (!isCanDraggable) {
                                                return;
                                            }

                                            setIsOffsetMode(true);
                                            setOffsetStayDate(placementRelativelyStart === 0 ? endDate : startDate);
                                        }}
                                    >
                                        {date.getDate()}
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </>
        )
    }

    const {
        carousel: monthTableCarousel,
        setCurrentElement: setCurrentElementInMonthTableCarousel,
        scrollDown: scrollDownMonthTableCarousel,
        scrollUp: scrollUpMonthTableCarousel,
        isScrolling: isScrollingMonthTableCarousel,
        carouselRef: monthTableCarouselRef,
    } = useVerticalCarousel(500);

    const renderMonthName = (dateInQuestion: Date) => {
        const monthString = moment(dateInQuestion).format('MMMM');
        const monthFormatted = `${monthString[0].toUpperCase()}${monthString.substring(1)}`;

        return <div>{monthFormatted}</div>;
    }

    const renderYear = (dateInQuestion: Date) => {
        const monthString = moment(dateInQuestion).format('YYYY');

        return <div>{monthString}</div>;
    }

    const {
        carousel: monthNameCarousel,
        setCurrentElement: setCurrentElementInMonthNameCarousel,
        scrollDown: scrollDownMonthNameCarousel,
        scrollUp: scrollUpMonthNameCarousel,
    } = useVerticalCarousel(500);

    const {
        carousel: yearCarousel,
        setCurrentElement: setCurrentElementInYearCarousel,
        scrollDown: scrollDownYearCarousel,
        scrollUp: scrollUpYearCarousel,
    } = useVerticalCarousel(500);

    return (
        <div
            className={classnames(styles.dateIntervalHelper, 'date-interval-helper')}
            ref={helperRef}
            onMouseLeave={() => setIsOffsetMode(false)}
            onMouseUp={() => setIsOffsetMode(false)}
        >
            <div className={classnames(styles.firstRow, 'first-row')}>
                <div className={classnames(styles.monthName, 'month-name')}>{monthNameCarousel}</div>
                <div className={classnames(styles.yearName, 'year-name')}>{yearCarousel}</div>
                <div className={classnames(styles.dateControls, 'date-controls')}>
                    <div className={classnames(styles.dateControl, 'date-control')} onClick={(event) => {
                        const nextDateInQuestion = addIntervalToDate(dateInQuestion, '-1 ' + (event.ctrlKey ? 'year' : 'month'));
                        const monthTable = generateMonthTable(nextDateInQuestion);

                        scrollUpMonthTableCarousel(renderMonthTable(monthTable), () => {
                            setDateInQuestion(nextDateInQuestion);
                        });

                        if (nextDateInQuestion.getMonth() !== dateInQuestion.getMonth()) {
                            scrollUpMonthNameCarousel(renderMonthName(nextDateInQuestion))
                        }
                        if (nextDateInQuestion.getFullYear() !== dateInQuestion.getFullYear()) {
                            scrollUpYearCarousel(renderYear(nextDateInQuestion));
                        }
                    }}>
                        <VscChevronLeft/>
                    </div>
                    <div className={classnames(styles.dateControl, 'date-control')} onClick={(event) => {
                        const nextDateInQuestion = addIntervalToDate(dateInQuestion, '1 ' + (event.ctrlKey ? 'year' : 'month'));
                        const monthTable = generateMonthTable(nextDateInQuestion);

                        scrollDownMonthTableCarousel(renderMonthTable(monthTable), () => {
                            setDateInQuestion(nextDateInQuestion);
                        });

                        if (nextDateInQuestion.getMonth() !== dateInQuestion.getMonth()) {
                            scrollDownMonthNameCarousel(renderMonthName(nextDateInQuestion));
                        }
                        if (nextDateInQuestion.getFullYear() !== dateInQuestion.getFullYear()) {
                            scrollDownYearCarousel(renderYear(nextDateInQuestion));
                        }
                    }}>
                        <VscChevronRight/>
                    </div>
                </div>
            </div>
            <div
                className={classnames(
                    styles.monthTable, 'month-table',
                    ...(isOffsetMode ? [styles.isDraggable, 'is-draggable'] : []),
                )}
                onMouseLeave={() => onHoverDate(null)}
            >
                <div className={classnames(styles.daysNames, 'days-names')}>
                    {daysNamesRef.current.map(dayName => (
                        <div key={dayName} className={classnames(styles.dayName, 'day-name')}>
                            {dayName}
                        </div>
                    ))}
                </div>
                {monthTableCarousel}
            </div>
        </div>
    );
};

export default DateIntervalHelper;
