import { initI18n } from '../i18n';
import { TFunction } from 'i18next';
import { completeTranslation } from '../../api';
import getApiFetch from "@/libs/@dexodus/api-fetch/src/server/getApiFetch";

const createdKeys: string[] = [];

export async function useTranslation() {
    const i18nextInstance = await initI18n();
    const apiFetch = await getApiFetch();

    const t: TFunction = ((...params) => {
        const translation = i18nextInstance.t(...params) as string;
        const currentLang = i18nextInstance.language;
        const resourceBundle = i18nextInstance.getDataByLanguage(currentLang);
        const label = params[0] as string;

        if (resourceBundle?.common && !resourceBundle.common[label] && !createdKeys.includes(label + currentLang)) {
            createdKeys.push(label + currentLang);
            completeTranslation(currentLang, label, translation, apiFetch).catch((err) =>
                console.error('Error completing translation:', err)
            );
        }
        return translation;
    }) as TFunction;

    return {t, i18n: i18nextInstance};
}
