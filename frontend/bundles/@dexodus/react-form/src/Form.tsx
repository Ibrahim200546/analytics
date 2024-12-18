"use client";

import React, {createContext, useEffect, useRef, useState} from "react";
import styles from "./Form.module.scss";
import classNames from "classnames";
import {Jsel, JselContext} from "@dexodus/jsel";
import {EventType} from "@dexodus/jsel/src/Event/Event";
import useApiFetch from "@dexodus/api-fetch/src/hooks/useApiFetch";

export type FormData = { [property: string]: any | FormData };

export type CallbackIfSuccessfulValidation = () => void | Promise<void>;
export type ValidateCallback = (callbackIfSuccessful: CallbackIfSuccessfulValidation) => void;

interface FormProps {
    className?: string;
    children?: React.ReactNode | ((jselRef: React.MutableRefObject<Jsel>) => React.ReactNode);
    data: FormData;
    setData: React.Dispatch<React.SetStateAction<FormData>>;
    setValidateCb?: React.Dispatch<React.SetStateAction<ValidateCallback>>;
    onJselInit?: (jselRef: React.RefObject<Jsel>) => void;
    editable?: boolean;
}

export interface ErrorsMap {
    [property: string]: boolean | null,
}

export interface FormContextValueOptions {
    rootProperty: string;
    enableValidation: boolean;
    setErrorsMap: React.Dispatch<React.SetStateAction<ErrorsMap>>;
    editable: boolean;
}

export interface FormContextValue {
    jselRef: React.MutableRefObject<Jsel>;
    reRender: () => void;
    context: string;
    options: FormContextValueOptions;
}

export const FormContext = createContext<FormContextValue | undefined>(undefined);


const isObjectsEqual = (object1: Object, object2: Object) => {
    return JSON.stringify(object1) === JSON.stringify(object2);
};

const Form: React.FC<FormProps> = (
    {
        className,
        children,
        data,
        setData,
        setValidateCb = () => {},
        onJselInit = () => {},
        editable = true,
    },
) => {
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [errorsMap, setErrorsMap] = useState<ErrorsMap>({});
    const [_, setCounter] = useState<number>(0);
    const [callbackIfSuccessfulValidation, setCallbackIfSuccessfulValidation] = useState<() => void>(() => {});
    const prevDataRef = useRef<FormData>(data);
    const jselRef = useRef<Jsel>();
    const validate = (callbackIfSuccessful: () => void) => {
        setCallbackIfSuccessfulValidation(() => callbackIfSuccessful);
        setErrorsMap(errorsMap => Object.keys(errorsMap).reduce(
            (acc, property) => ({...acc, [property]: null}),
            errorsMap,
        ));
        setEnableValidation(true);
    };
    const apiFetch = useApiFetch();

    const reRender = () => {
        setCounter(counter => counter + 1);
    };

    useEffect(() => {
        if (enableValidation) {
            const isCorrect = Object.values(errorsMap).find(haveErrors => haveErrors === null || haveErrors === true) === undefined;

            if (isCorrect) {
                setEnableValidation(false);
                if (callbackIfSuccessfulValidation instanceof Promise) {
                    callbackIfSuccessfulValidation.then();
                } else {
                    callbackIfSuccessfulValidation();
                }
                setCallbackIfSuccessfulValidation(() => () => {});
            }
        }
    }, [errorsMap]);

    if (!jselRef.current) {
        jselRef.current = new Jsel(new JselContext({
            data: {...prevDataRef.current},
            apiUrl: process.env.NEXT_PUBLIC_API_URL,
            visible: {},
            disabled: {},
            fetchJson: async (url: string) => {
                const result = await apiFetch(url);
                return await result.json();
            },
        }));

        // @ts-ignore
        onJselInit(jselRef);
    }

    useEffect(() => {
        jselRef.current?.addEventListener(EventType.ASSIGN, event => {
            if (isObjectsEqual(prevDataRef.current, event.globalScope.data)) {
                return;
            }

            setData({...event.globalScope.data});
            prevDataRef.current = JSON.parse(JSON.stringify(event.globalScope.data));
            setEnableValidation(false);
            setCallbackIfSuccessfulValidation(() => () => {});
        });
        setValidateCb(() => validate);
    }, []);

    return (
        <div className={classNames(styles.form, className)}>
            <FormContext.Provider value={{
                jselRef: jselRef as React.MutableRefObject<Jsel>,
                reRender,
                context: "data",
                options: {
                    rootProperty: "data",
                    enableValidation,
                    setErrorsMap,
                    editable,
                },
            }}>
                {/* @ts-ignore */}
                {typeof children === 'function' ? children(jselRef) : children}
            </FormContext.Provider>
        </div>
    );
};

export default Form;
