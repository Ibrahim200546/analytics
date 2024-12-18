import {TranslationList} from "../api";
import {createInstance, i18n} from "i18next";
import { initReactI18next } from 'react-i18next/initReactI18next'
import Backend, {HttpBackendOptions} from "i18next-http-backend";
import {getApiDomain} from "@/bundles/@dexodus/api-fetch/src/apiFetch";

let i18nextInstance: i18n | undefined = undefined;

export const initI18n = async (): Promise<i18n> => {
    if (i18nextInstance) {
        return i18nextInstance;
    }

    i18nextInstance = createInstance();

    await i18nextInstance
        .use(initReactI18next)
        .use(Backend)
        .init<HttpBackendOptions>({
            backend: {
                loadPath: `${getApiDomain()}/translation-api/list/{{lng}}`,
                parse(data: string, languages?: string | string[], namespaces?: string | string[]): {
                    [p: string]: any
                } {
                    const translationList: TranslationList = JSON.parse(data);
                    return translationList.translations.reduce((acc, translation) => {
                        return {...acc, [translation.key]: translation.value}
                    }, {});
                }
            },
            lng: "ru",
            fallbackLng: "ru",
            interpolation: {
                escapeValue: false,
            },
        });

    return i18nextInstance
};
