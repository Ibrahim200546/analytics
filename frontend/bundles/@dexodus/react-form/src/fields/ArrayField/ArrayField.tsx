"use client";

import React, {useEffect, useMemo, useState} from "react";
import {FormContext} from "../../Form";
import styles from "./ArrayField.module.scss"
import useFormContext from "../../hooks/useFormContext";
import ObjectField from "../ObjectField";
import GeneralField, {GeneralFieldClassName, GeneralFieldEventName, GeneralFieldProps} from "../GeneralField";
import classNames from "classnames";
import ValidationErrors from "../../ValidationErrors";
import useValidationErrors from "../../hooks/useValidationErrors";
import {EventType} from "@dexodus/jsel";

interface ArrayFieldClassName extends GeneralFieldClassName {
    addChildButton?: string;
    removeChildButton?: string;
}

interface ArrayFieldProps extends GeneralFieldProps {
    children?: React.ReactNode;
    className?: ArrayFieldClassName;
}

const ArrayField: GeneralField<ArrayFieldProps> = ({className, property, children, label, validators, events, hidden}) => {
    const {jselRef, reRender, context: fieldPath, options} = useFormContext(property, []);
    const validationErrors = useValidationErrors(options, jselRef, fieldPath, validators);
    const [visible, setVisible] = useState<boolean>(true);
    const value = jselRef.current?.exec(fieldPath);

    const addChild = () => {
        jselRef.current?.assign(`${fieldPath}[${value.length}]`, {})
        reRender();
    }

    const removeChild = (index: number) => {
        const arrayValue = jselRef.current?.exec(fieldPath) as Array<Object>;
        arrayValue.splice(index, 1);
        jselRef.current?.assign(`${fieldPath}`, arrayValue);
        reRender();
    }

    useEffect(() => {
        const onChangeEvents = Array.isArray(events) ? events.filter(event => event.name === GeneralFieldEventName.ON_CHANGE): [];
        const onInitEvents = Array.isArray(events) ? events.filter(event => event.name === GeneralFieldEventName.ON_INIT): [];

        const visibleAssignEventListener = (assignEvent: any) => {
            if (`visible[${fieldPath}]` !== assignEvent.path) {
                return;
            }

            setVisible(assignEvent.value);
        }

        const assignEventListener = (assignEvent: any) => {
            if (fieldPath !== assignEvent.path) {
                return;
            }

            for (const event of onChangeEvents) {
                if (event.type === 'jsel') {
                    jselRef.current.assign('currentValue', assignEvent.value);
                    jselRef.current.assign('absolutePath', fieldPath);
                    jselRef.current.exec(event.action);
                }
            }
        }

        if (onChangeEvents.length > 0 && jselRef.current) {
            jselRef.current.removeEventListener(EventType.ASSIGN, assignEventListener);
            jselRef.current.addEventListener(EventType.ASSIGN, assignEventListener);
        }

        if (onInitEvents.length > 0 && jselRef.current) {
            for (const event of onInitEvents) {
                if (event.type === 'jsel') {
                    jselRef.current.assign('absolutePath', fieldPath);
                    jselRef.current.exec(event.action);
                }
            }
        }

        jselRef.current?.addEventListener(EventType.ASSIGN, visibleAssignEventListener);

        if (hidden) {
            setVisible(false);
        }

        return () => {
            jselRef.current.removeEventListener(EventType.ASSIGN, assignEventListener);
            jselRef.current?.removeEventListener(EventType.ASSIGN, visibleAssignEventListener);
        }
    }, []);

    return useMemo(() => (
        <>
            {Array.isArray(value) && visible && (
                <div className={classNames(styles.arrayField, className?.formGroup)}>
                    <div className={className?.label}>
                        {label ?? property}
                        <button className={className?.addChildButton} onClick={() => addChild()}>+</button>
                    </div>
                    <div className={classNames(styles.arrayField__children, className?.input)}>
                        <FormContext.Provider value={{jselRef, reRender, context: fieldPath, options}}>
                            {value.map((_, index) => (
                                <div key={index}>
                                    <button className={className?.removeChildButton} onClick={() => removeChild(index)}>
                                        -
                                    </button>
                                    <ObjectField property={`[${index}]`}>
                                        {children}
                                    </ObjectField>
                                </div>
                            ))}
                        </FormContext.Provider>
                    </div>
                    <ValidationErrors
                        validationErrors={validationErrors}
                        className={{validationErrorsGroup: className?.validationErrorsGroup, validationError: className?.validationError}}
                    />
                </div>
            )}
        </>
    ), [JSON.stringify(value), validationErrors, visible]);
}

export default ArrayField;
