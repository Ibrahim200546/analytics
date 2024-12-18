import * as dotenv from "dotenv";

const env = dotenv.config({path: '.env.local'}).parsed;
const BACKEND_DOMAIN_FROM_CLIENT_FROM_PROCESS_ENV = process.env.NEXT_PUBLIC_API_URL;
const BACKEND_DOMAIN_FROM_SERVER_FROM_PROCESS_ENV = process.env.NEXT_PUBLIC_API_URL_FROM_SERVER;
const BACKEND_DOMAIN_FROM_CLIENT = BACKEND_DOMAIN_FROM_CLIENT_FROM_PROCESS_ENV ?? env.NEXT_PUBLIC_API_URL;
const BACKEND_DOMAIN_FROM_SERVER = BACKEND_DOMAIN_FROM_SERVER_FROM_PROCESS_ENV ?? env.NEXT_PUBLIC_API_URL_FROM_SERVER;

export type ApiFetchFunction = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export const getApiDomain = (): string => {
    const domain = typeof window === 'undefined' ? BACKEND_DOMAIN_FROM_SERVER : BACKEND_DOMAIN_FROM_CLIENT;

    return domain.endsWith('/') ? domain.slice(0, -1) : domain;
}

const ensureApiDomainInUrl = (url: string): string => {
    url = url.startsWith('/') ? url.slice(1) : url;
    const domain = getApiDomain();

    try {
        const parsedUrl = new URL(url, domain);
        parsedUrl.hostname = new URL(domain).hostname;

        return parsedUrl.href;
    } catch (e) {
        return `${domain}/${url}`;
    }
};

const apiFetch = (input: RequestInfo, init?: RequestInit, authorization?: string): Promise<Response> => {
    if (typeof input === "string") {
        input = ensureApiDomainInUrl(input);
    }

    if (!init) {
        init = {};
    }

    if (authorization) {
        init.headers = {
            ...(init.headers ?? {}),
            Authorization: authorization,
        };
    }

    return fetch(input, init);
};

export default apiFetch;
