import {ApiFetchFunction} from "@/libs/@dexodus/api-fetch/src/apiFetch";

export interface TranslationList {
    locale: string;
    translations: { key: string; value: string }[];
}

export interface LocaleList {
    locales: string[];
}

const fetchJson = async (url: string, apiFetch: ApiFetchFunction): Promise<any> => {
    console.log('fetch json from translation/api.ts');
    const response = await apiFetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return response.json();
};

export const loadTranslations = async (language: string, apiFetch: ApiFetchFunction): Promise<TranslationList> => {
    return fetchJson(`/translation-api/list/${language}`, apiFetch);
};

export const loadLanguages = async (apiFetch: ApiFetchFunction): Promise<string[]> => {
    const localeList: LocaleList = await fetchJson(`/translation-api/locales`, apiFetch);
    return localeList.locales;
};

export const loadResources = async (apiFetch: ApiFetchFunction): Promise<any> => {
    const languages = await loadLanguages(apiFetch);
    const resources = await Promise.all(
        languages.map(async (language) => {
            const translationList = await loadTranslations(language, apiFetch);
            return {
                [language]: {
                    common: translationList.translations.reduce((acc, translation) => {
                        acc[translation.key] = translation.value;
                        return acc;
                    }, {} as any),
                },
            };
        })
    );
    return resources.reduce((acc, resource) => ({ ...acc, ...resource }), {});
};

export const completeTranslation = async (language: string, key: string, title: string, apiFetch: ApiFetchFunction): Promise<void> => {
    const response = await apiFetch(`/translation-api/complete/${language}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: title }),
    });
    if (!response.ok) {
        throw new Error(`Failed to complete translation for ${language}: ${response.statusText}`);
    }
};
