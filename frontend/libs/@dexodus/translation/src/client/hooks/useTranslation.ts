import {
    useTranslation as useParentTranslation,
} from "react-i18next";
import {TFunction} from "i18next";
import {completeTranslation} from "@/libs/@dexodus/translation/src/api";
import {initI18n} from "@/libs/@dexodus/translation/src/client/i18n";
import useApiFetch from "@/libs/@dexodus/api-fetch/src/hooks/useApiFetch";

const createdKeys: string[] = [];

export function useTranslation() {
    initI18n();

    const { t: parentT, i18n } = useParentTranslation();
    const apiFetch = useApiFetch();

    const tFunction: TFunction = ((...params: Parameters<TFunction>) => {
        const translation = parentT(...params);
        if (typeof window !== 'undefined') {
            const currentLang = i18n.language;
            const resourceBundle = i18n.getDataByLanguage(currentLang);
            const label = params[0] as string;

            if (resourceBundle?.common && !resourceBundle.common[label] && !createdKeys.includes(label + currentLang)) {
                createdKeys.push(label + currentLang);
                completeTranslation(currentLang, label, translation, apiFetch).then();
            }
        }
        return translation;
    }) as TFunction;

    return {t: tFunction, i18n};
};
