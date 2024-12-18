"use client";

import React, {useEffect, useMemo, useState} from "react";
import FieldComponent from "./FieldComponent";
import useFormContext from "../hooks/useFormContext";
import GeneralField, {GeneralFieldEventName, GeneralFieldProps} from "./GeneralField";
import useValidationErrors from "../hooks/useValidationErrors";
import ValidationErrors from "../ValidationErrors";
import {EventType} from "@dexodus/jsel/src/Event/Event";
import classnames from "classnames";
import formGroupStyles from '../FormGroup.module.scss';

interface FieldProps extends GeneralFieldProps {
    component: FieldComponent<any>;
    componentProps?: {[propertyName: string]: any}
}

const Field: GeneralField<FieldProps> = ({className, property, component, label, validators, componentProps, events, hidden}) => {
    const {jselRef, reRender, context: fieldPath, options} = useFormContext(property, '');
    const validationErrors = useValidationErrors(options, jselRef, fieldPath, validators);
    const value = jselRef.current?.exec(fieldPath);
    const Component = component;
    const [visible, setVisible] = useState<boolean>(true);
    const [disabled, setDisabled] = useState<boolean>(false);

    useEffect(() => {
        const onInitEvents = Array.isArray(events) ? events.filter(event => event.name === GeneralFieldEventName.ON_INIT): [];

        const visibleAssignEventListener = (assignEvent: any) => {
            if (`visible[${fieldPath}]` !== assignEvent.path) {
                return;
            }

            setVisible(assignEvent.value);
        }

        const disabledAssignEventListener = (assignEvent: any) => {
            if (`disabled[${fieldPath}]` !== assignEvent.path) {
                return;
            }

            setDisabled(assignEvent.value);
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
        jselRef.current?.addEventListener(EventType.ASSIGN, disabledAssignEventListener);

        if (hidden) {
            setVisible(false);
        }

        return () => {
            jselRef.current?.removeEventListener(EventType.ASSIGN, visibleAssignEventListener);
            jselRef.current?.removeEventListener(EventType.ASSIGN, disabledAssignEventListener);
        }
    }, []);

    const onChangeEvents = Array.isArray(events) ? events.filter(event => event.name === GeneralFieldEventName.ON_CHANGE): [];

    return useMemo(() => (
        <>
            {value !== undefined && visible && (
                <div className={classnames(formGroupStyles.formGroup, className?.formGroup)}>
                    <div className={classnames(formGroupStyles.title, className?.label)} style={{color: componentProps?.color ?? 'black'}}>{label ?? property}</div>
                    <Component
                        {...componentProps}
                        value={value}
                        onChange={(value: any) => {
                            if (disabled || !options.editable) {
                                return;
                            }
                            jselRef.current.assign(fieldPath, value)

                            for (const event of onChangeEvents) {
                                if (event.type === 'jsel') {
                                    jselRef.current.assign('currentValue', value);
                                    jselRef.current.assign('absolutePath', fieldPath);
                                    jselRef.current.exec(event.action);
                                }
                            }
                            reRender();
                        }}
                        className={className?.input}
                    />
                    <ValidationErrors
                        validationErrors={validationErrors}
                        className={{validationErrorsGroup: className?.validationErrorsGroup, validationError: className?.validationError}}
                    />
                </div>
            )}
        </>
    ), [JSON.stringify(value), validationErrors, visible, disabled]);
};

export default Field;
