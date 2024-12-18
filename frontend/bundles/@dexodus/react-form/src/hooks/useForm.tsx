import React, {useRef, useState} from "react";
import Form, {FormData, ValidateCallback} from "../Form";
import {Jsel} from "@dexodus/jsel";

interface UseFormReturn {
    component: React.ReactNode,
    data: FormData,
    jselRef: React.RefObject<Jsel>,
    validate: ValidateCallback,
}

type UseFormChildren = React.ReactNode | ((jselRef: React.RefObject<Jsel>) => React.ReactNode);

const useForm = (children: UseFormChildren, defaultFormData: FormData = {}, onJselInit: (jselRef: React.RefObject<Jsel>) => void = () => {}, editable: boolean = true): UseFormReturn => {
    const [data, setData] = useState<FormData>(defaultFormData);
    const formJselRef = useRef<Jsel>(null);
    const [validateCb, setValidateCb] = useState<ValidateCallback>(() => {});

    const FormComponent = (
        <Form data={data} setData={setData} setValidateCb={setValidateCb} onJselInit={onJselInit} editable={editable}>
            {(jselRef) => {
                // @ts-ignore
                formJselRef.current = jselRef.current;

                if (typeof children === 'function') {
                    return children(jselRef);
                }

                return children;
            }}
        </Form>
    )

    return {
        component: FormComponent,
        data: data,
        jselRef: formJselRef,
        validate: validateCb,
    }
}

export default useForm;
