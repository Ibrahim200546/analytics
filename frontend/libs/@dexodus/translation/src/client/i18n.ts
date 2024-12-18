import i18next from "i18next";
import Backend, {HttpBackendOptions} from "i18next-http-backend";
import {TranslationList} from "@/libs/@dexodus/translation/src/api";
import {initReactI18next} from "react-i18next";
import {getApiDomain} from "@/bundles/@dexodus/api-fetch/src/apiFetch";

let isInitialized = false;

export const initI18n = () => {
    if (isInitialized) {
        return;
    }

    i18next
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

    isInitialized = true;
};
