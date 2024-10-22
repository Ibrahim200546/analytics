const axios = require('axios');
const https = require('https');

class Backend {
    constructor() {
        this.host = process.env.NEXT_PUBLIC_API_URL_FROM_SERVER;
    }

    init(services, backendOptions, i18nextOptions) {
        this.services = services;
        this.backendOptions = backendOptions;
        this.i18nextOptions = i18nextOptions;
    }

    async read(language, namespace, callback) {
        console.log('Loading translations for ' + language);
        const agent = new https.Agent({
            rejectUnauthorized: false,
        });
        const response = await axios.get(
            `${this.host}/translation-api/list/${language}`,
            {
                httpsAgent: agent,
            }
        );
        const translations = {};
        for (const trPair of response.data.translations) {
            translations[trPair.key] = trPair.value;
        }
        // console.log(language, translations);
        callback(null, translations);
    }

    async create(languages, namespace, key, fallbackValue, ...params) {
        try {
            const language = languages[0];
            const agent = new https.Agent({
                rejectUnauthorized: false,
            });
            console.log(
                'missing key detected',
                languages,
                namespace,
                key,
                fallbackValue,
                params
            );
            await axios.post(
                `${this.host}/translation-api/complete/${language}`,
                {
                    [key]: fallbackValue,
                },
                {
                    httpsAgent: agent,
                }
            );
        } catch (e) {
            console.log(e, 'error in save missing key');
        }
    }
}
class Frontend {
    async create(languages, namespace, key, fallbackValue, ...params) {
        try {
            const language = languages[0];
            console.log(
                'frontend missing key detected',
                languages,
                namespace,
                key,
                fallbackValue,
                params
            );
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL_FROM_SERVER}/translation-api/complete/${language}`,
                {
                    [key]: fallbackValue,
                }
            );
        } catch (e) {
            console.log(e, 'error in save missing key');
        }
    }
}

Backend.type = 'backend';
Frontend.type = 'backend';

const isBrowser = typeof window !== 'undefined';

module.exports = {
    i18n: {
        defaultLocale: 'ru',
        locales: ['ru', 'kz'],
    },
    ns: 'common',
    use: isBrowser ? [Frontend] : [Backend],
    serializeConfig: false,
    saveMissing: true,
    saveMissingTo: 'current',
};
