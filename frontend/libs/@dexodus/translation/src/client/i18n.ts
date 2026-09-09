import i18next from "i18next";
import Backend, {HttpBackendOptions} from "i18next-http-backend";
import {TranslationList} from "@/libs/@dexodus/translation/src/api";
import {initReactI18next} from "react-i18next";
import {getApiDomain} from "@/bundles/@dexodus/api-fetch/src/apiFetch";

const defaultTranslations: Record<string, string> = {
    "project.name": "ISMI",
    "logout": "Выйти",
    "navigation.organizations": "Организации",
    "navigation.organizations.list": "Список организаций",
    "navigation.organizations.create": "Создать организацию",
    "navigation.projects": "Проекты",
    "navigation.news": "Новости",
    "navigation.myOrganization": "Моя организация",
    "navigation.settings": "Настройки",
    "navigation.settings.telegram": "Телеграмм",
    "navigation.settings.telegram.accounts": "Аккаунты",
    "navigation.settings.telegram.accounts.list": "Список аккаунтов",
    "navigation.settings.telegram.accounts.create": "Добавить аккаунт",
    "navigation.settings.telegram.channels": "Телеграмм каналы",
    "navigation.settings.webResource": "Веб-ресурс",
    "navigation.settings.location": "Местоположения",
};

let isInitialized = false;

export const initI18n = () => {
    if (isInitialized) {
        return;
    }

    i18next
        .use(initReactI18next)
        .use(Backend)
        .init<HttpBackendOptions>({
            resources: {
                ru: {
                    common: defaultTranslations,
                },
            },
            backend: {
                loadPath: `${getApiDomain()}/translation-api/list/{{lng}}`,
                parse(data: string): {
                    [p: string]: any
                } {
                    try {
                        const translationList: TranslationList = JSON.parse(data);
                        if (translationList && Array.isArray(translationList.translations)) {
                            return translationList.translations.reduce((acc, translation) => {
                                return {...acc, [translation.key]: translation.value}
                            }, {...defaultTranslations});
                        }
                    } catch {
                        // ignore parse error and use default
                    }
                    return defaultTranslations;
                }
            },
            lng: "ru",
            fallbackLng: "ru",
            defaultNS: "common",
            interpolation: {
                escapeValue: false,
            },
        });

    isInitialized = true;
};
