import React from "react";
import {useTranslation} from "./hooks/useTranslation";

interface TextTranslationProps {
    ns?: string;
    label: string;
    params?: any;
    defaultValue?: string;
}

const TextTranslation = async (
    {
        label,
        params,
        ns = "common",
        defaultValue,
    }: TextTranslationProps,
) => {
    const {t} = await useTranslation();
    const translation = t(label, defaultValue as string, params);

    return <>{typeof translation === "string" ? translation : defaultValue ?? label}</>;
};

export default TextTranslation;
