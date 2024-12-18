"use client";

import React, {useRef, useState} from "react";
import styles from "./Calendar.module.scss";
import {CalendarEvent} from "./index";
import moment, {Moment} from "moment";
import classnames from "classnames";
import "moment/locale/ru";
import Button, {ButtonSizes, ButtonStyle} from "../Button";
import Popup from "reactjs-popup";
import {BallTriangle} from "react-loader-spinner";

interface CalendarProps {
    events: CalendarEvent[];
    defaultDisplayedMonth?: Date;
    typeStyles?: {
        [typeName: string]: ButtonStyle,
    };
    loading?: boolean;
    onChangeMonth?: (month: Date) => void
}

const generateCalendar = (monthDate: Moment) => {
    const firstDateInMonth = moment(new Date(monthDate.year(), monthDate.month(), 1));
    const dayOfWeek = firstDateInMonth.day();
    const startDate = firstDateInMonth.subtract(dayOfWeek - 1, 'days');
    const calendarDates = [];

    for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
        const rowDates = [];

        for (let day = 0; day < 7; day++) {
            const offset = rowIndex * 7 + day;
            rowDates.push(startDate.clone().add(offset, 'days'));
        }

        calendarDates.push(rowDates);
    }

    return calendarDates;
};

const getEventsInDate = (events: CalendarEvent[], date: Moment): CalendarEvent[] => {
    return events.filter(event => moment(event.date).format('YYYY MM DD') === date.format('YYYY MM DD'));
}

const capitalizeFirst = (text: string): string => {
    return text[0].toUpperCase() + text.slice(1);
}

const Calendar: React.FC<CalendarProps> = ({events, defaultDisplayedMonth = new Date(), typeStyles = {}, loading = false, onChangeMonth = () => {}}) => {
    moment().locale('ru')
    const [displayedMonth, setDisplayedMonth] = useState<Moment>(moment(defaultDisplayedMonth).date(1));
    const [calendarDates, setCalendarDates] = useState<Moment[][]>(generateCalendar(displayedMonth));
    const currentDate = moment(new Date());
    const calendarRef = useRef<HTMLTableElement>(null);

    const nextMonth = () => {
        setDisplayedMonth(displayedMonth => {
            const newDisplayedMonth = moment(displayedMonth).add(1, 'month');
            onChangeMonth(newDisplayedMonth.toDate());
            setCalendarDates(generateCalendar(newDisplayedMonth));

            return newDisplayedMonth;
        })
    }

    const prevMonth = () => {
        setDisplayedMonth(displayedMonth => {
            const newDisplayedMonth = moment(displayedMonth).subtract(1, 'month');
            onChangeMonth(newDisplayedMonth.toDate());
            setCalendarDates(generateCalendar(newDisplayedMonth));

            return newDisplayedMonth;
        })
    }

    return (
        <div className={styles.calendar}>
            <div className={styles.rowBeforeTable}>
                <Button bordered={true} style={ButtonStyle.Info} size={ButtonSizes.Small} onClick={prevMonth}>
                    {capitalizeFirst(moment(displayedMonth).clone().subtract(1, 'months').format('MMMM YYYY'))}
                </Button>
                <Button style={ButtonStyle.Default}>
                    {capitalizeFirst(moment(displayedMonth).format('MMMM YYYY'))}
                </Button>
                <Button bordered={true} style={ButtonStyle.Info} size={ButtonSizes.Small} onClick={nextMonth}>
                    {capitalizeFirst(moment(displayedMonth).clone().add(1, 'months').format('MMMM YYYY'))}
                </Button>
            </div>
            {loading && (
                <div style={{
                    width: `${calendarRef.current?.offsetWidth}px`,
                    height: `${calendarRef.current?.offsetHeight}px`,
                }} className={styles.loader}>
                    <BallTriangle height={32}/>
                </div>
            )}
            <table ref={calendarRef}>
                <thead>
                <tr>
                    <th>Пн</th>
                    <th>Вт</th>
                    <th>Ср</th>
                    <th>Чт</th>
                    <th>Пт</th>
                    <th>Сб</th>
                    <th>Вс</th>
                </tr>
                </thead>
                <tbody>
                {calendarDates.map(rowDates => (
                    <tr>
                        {rowDates.map(date => (
                            <td>
                                <div className={classnames(styles.dateContainer, date.month() !== displayedMonth.month() && styles.dateContainer_notInCurrentMonth, currentDate.format('YYYY MM DD') === date.format('YYYY MM DD') && styles.dateContainer_currentDate)}>
                                    <div className={styles.date}>
                                        {date.date()}
                                    </div>
                                    <div className={styles.events}>
                                        {getEventsInDate(events, date).map((event, index) => (
                                            <Popup
                                                position="right center"
                                                trigger={(
                                                    <div id={`event-${date.format('YYYY-MM-DD')}-${index}`}>
                                                        <Button size={ButtonSizes.ExtraSmall} customStyle={event.type} className={styles.event}>
                                                            <span className={styles.eventName}>{event.name}</span>
                                                        </Button>
                                                    </div>
                                                )}
                                            >
                                                <span>{event.name}</span>
                                            </Popup>
                                        ))}
                                    </div>
                                </div>
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Calendar;
