'use client'

import React, {useEffect, useState} from "react";
import {useTranslation} from "./hooks/useTranslation";
import useApiFetch from "@/bundles/@dexodus/api-fetch/src/hooks/useApiFetch";

interface TextTranslationProps {
    ns?: string;
    label: string;
    params?: any;
    defaultValue?: string;
}

const TextTranslation = (
    {
        label,
        params,
        ns = "common",
        defaultValue,
    }: TextTranslationProps,
) => {
    const {t} = useTranslation();
    const [editable, setEditable] = useState<boolean>(false);
    const [editableValue, setEditableValue] = useState(`${t(label, defaultValue as string, params)}`);
    const [changed, setChanged] = useState<boolean>(false);
    const apiFetch = useApiFetch();

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.altKey && event.ctrlKey) {
                setEditable(editable => !editable);
            }
        };

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    useEffect(() => {
        if (!editable && changed) {
            setChanged(false);

            (async () => {
                await apiFetch(`/translation-api/complete/ru`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({[label]: editableValue}),
                });
            })();
        }
    }, [editable]);

    if (editable) {
        return <input
            type={"text"}
            value={editableValue}
            onChange={event => {
                setEditableValue(event.target.value);
                setChanged(true);
            }}
            onClick={event => {
                event.stopPropagation();
                event.preventDefault();
            }}
        />;
    }

    return <>{editableValue}</>;
};

export default TextTranslation;
