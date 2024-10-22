"use client";

import React, {useEffect, useRef, useState} from "react";
import styles from "./TimeHelper.module.scss";
import {normalizeAngle, shortestAngle} from "@/libs/@dexodus/bootstrap/common/angle";
import classnames from "classnames";
import {mapStringToTimeValue, TimeValue} from "@/libs/@dexodus/bootstrap/common/time";

type TimeType = 'hours' | 'minutes' | 'seconds';

type TimeElement = {value: number; visible: boolean};

const generateElementsForType = (type: TimeType): TimeElement[] => {
    let start = 0;
    let end = 0;
    let offset = 1;
    let visibleOffset = 1;

    switch (type) {
        case "hours":
            start = 0;
            end = 23;
            offset = 1;
            visibleOffset = 1;
            break;
        case "minutes":
            start = 0;
            end = 59;
            offset = 1;
            visibleOffset = 5;
            break;
        case "seconds":
            start = 0;
            end = 59;
            offset = 1;
            visibleOffset = 5;
            break;
    }

    const result = [];

    for (let i = start; i <= end; i += offset) {
        result.push({value: i, visible: i % visibleOffset === 0} as TimeElement);
    }

    return result;
}

interface TimeHelperProps {
    value: TimeValue;
    setValue: React.Dispatch<React.SetStateAction<TimeValue>>;
    helperRef?: React.RefObject<HTMLDivElement>;
}

const TimeHelper: React.FC<TimeHelperProps> = (
    {
        value: timeValue,
        setValue: setTimeValue,
        helperRef,
    }
) => {
    const [timeTypeSelected, setTimeTypeSelected] = useState<TimeType>('hours')
    const [timeElements, setTimeElements] = useState<TimeElement[]>([]);
    const [hoveredElement, setHoveredElement] = useState<null | number>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const numbersRef = useRef<HTMLDivElement>(null);
    const pointerRef = useRef<HTMLDivElement>(null);
    const circleWidth = useRef<number>(0)
    const currentPointerAngle = useRef<number>(0);

    useEffect(() => {
        setTimeElements(generateElementsForType(timeTypeSelected));
        circleWidth.current = numbersRef.current?.clientWidth ?? 0;
    }, [timeTypeSelected]);

    const rotatePointer = (to: number): void => {
        if (!pointerRef.current) {
            return;
        }

        const from = currentPointerAngle.current;
        let angle = from + shortestAngle(from, to);

        pointerRef.current.style.transform = `rotateZ(${angle}deg)`;
        currentPointerAngle.current = angle;
    }

    useEffect(() => {
        if (!pointerRef.current) {
            return;
        }

        const element = timeValue[timeTypeSelected] ?? hoveredElement;

        if (element === null) {
            pointerRef.current.style.width = `0px`;

            return;
        }

        if (isDragging) {
            setTimeValue(timeValue => ({...timeValue, [timeTypeSelected]: hoveredElement}));
        }

        const pointerWidth = circleWidth.current / 2 - 32 + 4;

        const offsetDegree = 360 / timeElements.length
        const hoveredElementIndex = timeElements.findIndex(timeElement => timeElement.value === element);
        const hoveredElementDegree = hoveredElementIndex * offsetDegree - 90;

        if (pointerRef.current.clientWidth === 0) {
            pointerRef.current.style.transition = 'unset';
            rotatePointer(hoveredElementDegree);
            setTimeout(() => {
                if (!pointerRef.current) {
                    return;
                }

                pointerRef.current.style.transition = '0.3s';
                pointerRef.current.style.width = `${pointerWidth}px`;
            });
        } else {
            rotatePointer(hoveredElementDegree);
            pointerRef.current.style.width = `${pointerWidth}px`;
        }
    }, [hoveredElement, timeValue[timeTypeSelected]]);

    useEffect(() => {
        if (!timeElements.length || !numbersRef.current) {
            return;
        }

        const halfWidth = circleWidth.current / 2;
        const elementWidth = 32;
        const elementHalfWidth = elementWidth / 2;
        const distanceFromCenter = 0.9;

        let degree = -90;
        const offsetDegree = 360 / timeElements.length

        for (let i = 0; i < timeElements.length; i++) {
            const rad = degree * Math.PI / 180;
            const element = numbersRef.current.children[i] as HTMLDivElement;

            element.style.top = `${Math.sin(rad) * halfWidth * distanceFromCenter + halfWidth - elementHalfWidth}px`;
            element.style.left = `${Math.cos(rad) * halfWidth * distanceFromCenter + halfWidth - elementHalfWidth}px`;

            degree += offsetDegree;
        }
    }, [timeElements]);

    const getTimeElementByCoordinates = (x: number, y: number): number | null => {
        if (!numbersRef.current) {
            return null;
        }

        const rect = numbersRef.current.getBoundingClientRect();

        const relativeElementX = x - rect.left;
        const relativeElementY = y - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const relX = relativeElementX - centerX;
        const relY = relativeElementY - centerY;

        const angleRadians = Math.atan2(relY, relX);
        const angleDegrees = normalizeAngle(angleRadians * (180 / Math.PI) + 90);

        const numElements = timeElements.length;
        const angleBetweenElements = 360 / numElements;

        const closestIndex = Math.round(angleDegrees / angleBetweenElements) % numElements;

        return timeElements[closestIndex].value;
    }

    const onHover = (x: number, y: number): void => {
        setHoveredElement(getTimeElementByCoordinates(x, y));
    }

    const onClick = (x: number, y: number): void => {
        const timeElement = getTimeElementByCoordinates(x, y);

        setTimeValue(timeValue => (
            {...timeValue, [timeTypeSelected]: timeElement}
        ));
    }

    return (
        <div className={styles.timeHelper} ref={helperRef}>
            <div className={styles.timeRow}>
                <div onClick={() => setTimeTypeSelected('hours')} className={classnames(
                    styles.timeElement,
                    ...(timeTypeSelected === 'hours' ? [styles.active, 'active'] : []),
                )}>
                    {timeValue.hours !== null ? `${timeValue.hours}`.padStart(2, '0') : '--'}
                </div>
                <div className={styles.spacer}>
                    :
                </div>
                <div onClick={() => setTimeTypeSelected('minutes')} className={classnames(
                    styles.timeElement,
                    ...(timeTypeSelected === 'minutes' ? [styles.active, 'active'] : []),
                )}>
                    {timeValue.minutes !== null ? `${timeValue.minutes}`.padStart(2, '0') : '--'}
                </div>
                <div className={styles.spacer}>
                    :
                </div>
                <div onClick={() => setTimeTypeSelected('seconds')} className={classnames(
                    styles.timeElement,
                    ...(timeTypeSelected === 'seconds' ? [styles.active, 'active'] : []),
                )}>
                    {timeValue.seconds !== null ? `${timeValue.seconds}`.padStart(2, '0') : '--'}
                </div>
            </div>
            <div
                className={styles.numbers}
                ref={numbersRef}
                onTouchMove={event => {
                    event.preventDefault();
                    event.stopPropagation();
                    const touch = event.touches[0];

                    onHover(touch.clientX, touch.clientY);
                }}
                onTouchStart={event => {
                    const touch = event.touches[0];
                    onClick(touch.clientX, touch.clientY);
                    setIsDragging(true);
                }}
                onTouchEnd={() => {
                    setIsDragging(false);
                    setTimeTypeSelected(timeTypeSelected === 'hours' ? 'minutes' : 'seconds')
                    setHoveredElement(null);
                }}
                onMouseDown={event => {
                    setIsDragging(true);
                    onClick(event.clientX, event.clientY);
                }}
                onMouseMove={event => onHover(event.clientX, event.clientY)}
                onMouseLeave={() => {
                    setHoveredElement(null);
                    setIsDragging(false);
                }}
                onMouseUp={() => {
                    setIsDragging(false);
                    setTimeTypeSelected(timeTypeSelected === 'hours' ? 'minutes' : 'seconds')
                }}
            >
                {timeElements.map(timeElement => (
                    <div
                        key={timeElement.value}
                        className={classnames(
                            styles.number, 'number',
                            ...(hoveredElement === timeElement.value ? [styles.hover, 'hover'] : []),
                            ...(timeValue[timeTypeSelected] === timeElement.value ? [styles.active, 'active'] : []),
                            ...(!timeElement.visible ? [styles.hidden, 'hidden'] : []),
                        )}
                        style={{top: `${circleWidth.current / 2}px`, left: `${circleWidth.current / 2}px`}}
                    >
                        {timeElement.visible ? timeElement.value : '•'}
                    </div>
                ))}
                <div className={styles.pointer} ref={pointerRef}/>
                <div className={styles.pointerCenter}/>
            </div>
        </div>
    );
};

export default TimeHelper;
