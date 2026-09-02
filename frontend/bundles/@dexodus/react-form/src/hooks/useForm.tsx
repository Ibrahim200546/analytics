import React, {useRef, useState} from "react";
import Form, {FormData, ValidateCallback} from "../Form";
import {Jsel} from "@dexodus/jsel";

interface UseFormReturn<T extends FormData = FormData> {
    component: React.ReactNode,
    data: T,
    jselRef: React.RefObject<Jsel>,
    validate: ValidateCallback,
}

type UseFormChildren = React.ReactNode | ((jselRef: React.RefObject<Jsel>, validate: ValidateCallback) => React.ReactNode);

type UseFormFunction = <T extends FormData = FormData>(
    children: UseFormChildren,
    defaultFormData?: T,
    onJselInit?: (jselRef: React.RefObject<Jsel>) => void,
    editable?: boolean
) => UseFormReturn<T>;

const useForm = <T extends FormData = FormData>(
    children: UseFormChildren,
    defaultFormData?: T,
    onJselInit: (jselRef: React.RefObject<Jsel>) => void = () => {},
    editable = true,
): UseFormReturn<T> => {
    const initialFormData = (defaultFormData ?? {}) as FormData;
    const [data, setData] = useState<FormData>(initialFormData);
    const formJselRef = useRef<Jsel>(null);
    const [validateCb, setValidateCb] = useState<ValidateCallback>(() => {});

    const FormComponent = (
        <Form data={data} setData={setData} setValidateCb={setValidateCb} onJselInit={onJselInit} editable={editable}>
            {(jselRef) => {
                // @ts-ignore
                formJselRef.current = jselRef.current;

                if (typeof children === 'function') {
                    return children(jselRef, validateCb);
                }

                return children;
            }}
        </Form>
    )

    return {
        component: FormComponent,
        data: data as T,
        jselRef: formJselRef,
        validate: validateCb,
    }
}

export default useForm;
