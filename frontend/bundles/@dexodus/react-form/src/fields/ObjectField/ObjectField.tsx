"use client";

import React, {useEffect, useMemo, useState} from "react";
import {FormContext} from "../../Form";
import styles from "./ObjectField.module.scss"
import useFormContext from "../../hooks/useFormContext";
import GeneralField, {GeneralFieldEventName, GeneralFieldProps} from "../GeneralField";
import useValidationErrors from "../../hooks/useValidationErrors";
import ValidationErrors from "../../ValidationErrors";
import classNames from "classnames";
import {EventType} from "@dexodus/jsel";

interface ObjectFieldProps extends GeneralFieldProps {
    children?: React.ReactNode;
}

const ObjectField: GeneralField<ObjectFieldProps> = ({className, property, children, label, validators, events, hidden}) => {
    const {jselRef, reRender, context: fieldPath, options} = useFormContext(property, {});
    const validationErrors = useValidationErrors(options, jselRef, fieldPath, validators);
    const [visible, setVisible] = useState<boolean>(true);
    const value = jselRef.current?.exec(fieldPath);

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
            {value !== undefined && visible && (
                <div className={classNames(styles.objectField, className?.formGroup)}>
                    <div className={className?.label}>{label ?? property}</div>
                    <div className={classNames(styles.objectField__children, className?.input)}>
                        <FormContext.Provider value={{jselRef, reRender, context: fieldPath, options}}>
                            {children}
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

export default ObjectField;
