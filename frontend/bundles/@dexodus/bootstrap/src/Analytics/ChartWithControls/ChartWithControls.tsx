"use client";

import React, {useEffect, useState} from "react";
import styles from "./ChartWithControls.module.scss";
import ButtonsGroup from "../../UserInterface/ButtonsGroup";
import Button, {ButtonStyle} from "../../UserInterface/Button";
import {VscChevronLeft, VscChevronRight} from "react-icons/vsc";
import moment from "moment/moment";

export enum HistoryIntervalType {
    ONE_HOUR,
    ONE_DAY,
    ONE_WEEK,
    ONE_MONTH,
}

const getPeriodStart = (date: string, historyIntervalType: HistoryIntervalType): string => {
    const momentDate = moment(date);
    switch (historyIntervalType) {
        case HistoryIntervalType.ONE_HOUR:
            return momentDate.startOf('day').format('YYYY-MM-DD HH:00:00');
        case HistoryIntervalType.ONE_DAY:
            return momentDate.startOf('isoWeek').format('YYYY-MM-DD 00:00:00');
        case HistoryIntervalType.ONE_WEEK:
            return momentDate.startOf('quarter').format('YYYY-MM-DD 00:00:00');
        case HistoryIntervalType.ONE_MONTH:
            return momentDate.startOf('year').format('YYYY-MM-DD 00:00:00');
        default:
            return momentDate.format('YYYY-MM-DD HH:mm:ss');
    }
};

const getPeriodEnd = (date: string, historyIntervalType: HistoryIntervalType): string => {
    const momentDate = moment(date);
    switch (historyIntervalType) {
        case HistoryIntervalType.ONE_HOUR:
            return momentDate.endOf('day').format('YYYY-MM-DD HH:59:59');
        case HistoryIntervalType.ONE_DAY:
            return momentDate.endOf('isoWeek').format('YYYY-MM-DD 23:59:59');
        case HistoryIntervalType.ONE_WEEK:
            return momentDate.endOf('quarter').format('YYYY-MM-DD 23:59:59');
        case HistoryIntervalType.ONE_MONTH:
            return momentDate.endOf('year').format('YYYY-MM-DD 23:59:59');
        default:
            return momentDate.format('YYYY-MM-DD HH:mm:ss');
    }
};

const getIntervalStart = (date: string, historyIntervalType: HistoryIntervalType): string => {
    const momentDate = moment(date);
    switch (historyIntervalType) {
        case HistoryIntervalType.ONE_HOUR:
            return momentDate.startOf('hour').format('YYYY-MM-DD HH:00:00');
        case HistoryIntervalType.ONE_DAY:
            return momentDate.startOf('day').format('YYYY-MM-DD 00:00:00');
        case HistoryIntervalType.ONE_WEEK:
            return momentDate.startOf('isoWeek').format('YYYY-MM-DD 00:00:00');
        case HistoryIntervalType.ONE_MONTH:
            return momentDate.startOf('month').format('YYYY-MM-DD 00:00:00');
        default:
            return momentDate.format('YYYY-MM-DD HH:mm:ss');
    }
};

export type HistoryType = {[date: string]: number} | {[date: string]: {[datasetName: string]: number}};

const combineHistoryByIntervalType = (
    history: HistoryType,
    historyIntervalType: HistoryIntervalType,
    period: string,
): HistoryType => {
    const combinedHistory: HistoryType = {};
    const periodParts = period.split(' - ');
    const startHistoryDate = new Date(periodParts[0]);
    const endHistoryDate = new Date(periodParts[1]);

    Object.keys(history).filter(dateString => {
        const date = new Date(dateString);

        return startHistoryDate <= date && date <= endHistoryDate;
    }).forEach(date => {
        const intervalStart = getIntervalStart(date, historyIntervalType);

        combinedHistory[intervalStart] = history[date];
    });

    return combinedHistory;
};

interface ChartWithControlsProps {
    history: HistoryType;
    children: (history: HistoryType) => React.ReactNode;
}

const ChartWithControls: React.FC<ChartWithControlsProps> = ({history, children}) => {
    const [historyIntervalType, setHistoryIntervalType] = useState<HistoryIntervalType>(HistoryIntervalType.ONE_DAY);
    const [period, setPeriod] = useState<string>('');

    const combinedHistory = combineHistoryByIntervalType(history, historyIntervalType, period);

    useEffect(() => {
        setPeriod(`${getPeriodStart(moment().format(), historyIntervalType)} - ${getPeriodEnd(moment().format(), historyIntervalType)}`)
    }, [historyIntervalType]);

    const newStartPeriodPrev = getPeriodStart(moment(period.split(' - ')[0]).subtract(1, 'hour').format(), historyIntervalType);
    const newEndPeriodPrev = getPeriodEnd(moment(period.split(' - ')[0]).subtract(1, 'hour').format(), historyIntervalType);
    const newStartPeriodNext = getPeriodStart(moment(period.split(' - ')[1]).add(1, 'hour').format(), historyIntervalType);
    const newEndPeriodNext = getPeriodEnd(moment(period.split(' - ')[1]).add(1, 'hour').format(), historyIntervalType);

    return (
        <div className={styles.chartWithControls}>
            <ButtonsGroup>
                <Button style={new Date(newEndPeriodPrev) >= new Date(Object.keys(history)[0]) ? ButtonStyle.Info : ButtonStyle.Default} onClick={() => {
                    if (new Date(newEndPeriodPrev) >= new Date(Object.keys(history)[0])) {
                        setPeriod(`${newStartPeriodPrev} - ${newEndPeriodPrev}`)
                    }
                }}>
                    <VscChevronLeft/>
                </Button>
                <Button>
                    {period}
                </Button>
                <Button style={new Date(newStartPeriodNext) <= new Date() ? ButtonStyle.Info : ButtonStyle.Default} onClick={() => {
                    if (new Date(newStartPeriodNext) <= new Date()) {
                        setPeriod(`${newStartPeriodNext} - ${newEndPeriodNext}`)
                    }
                }}>
                    <VscChevronRight/>
                </Button>
            </ButtonsGroup>
            {children(combinedHistory)}
            <ButtonsGroup>
                <Button style={historyIntervalType === HistoryIntervalType.ONE_HOUR ? ButtonStyle.Primary : ButtonStyle.Default} onClick={() => setHistoryIntervalType(HistoryIntervalType.ONE_HOUR)}>Час</Button>
                <Button style={historyIntervalType === HistoryIntervalType.ONE_DAY ? ButtonStyle.Primary : ButtonStyle.Default} onClick={() => setHistoryIntervalType(HistoryIntervalType.ONE_DAY)}>День</Button>
                <Button style={historyIntervalType === HistoryIntervalType.ONE_WEEK ? ButtonStyle.Primary : ButtonStyle.Default} onClick={() => setHistoryIntervalType(HistoryIntervalType.ONE_WEEK)}>Неделя</Button>
                <Button style={historyIntervalType === HistoryIntervalType.ONE_MONTH ? ButtonStyle.Primary : ButtonStyle.Default} onClick={() => setHistoryIntervalType(HistoryIntervalType.ONE_MONTH)}>Месяц</Button>
            </ButtonsGroup>
        </div>
    );
};

export default ChartWithControls;
