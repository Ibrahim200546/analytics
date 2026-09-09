import * as dotenv from "dotenv";

const env = dotenv.config({path: '.env.local'}).parsed || {};
const BACKEND_DOMAIN_FROM_CLIENT_FROM_PROCESS_ENV = process.env.NEXT_PUBLIC_API_URL;
const BACKEND_DOMAIN_FROM_SERVER_FROM_PROCESS_ENV = process.env.NEXT_PUBLIC_API_URL_FROM_SERVER;
const BACKEND_DOMAIN_FROM_CLIENT = BACKEND_DOMAIN_FROM_CLIENT_FROM_PROCESS_ENV ?? env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
const BACKEND_DOMAIN_FROM_SERVER = BACKEND_DOMAIN_FROM_SERVER_FROM_PROCESS_ENV ?? env.NEXT_PUBLIC_API_URL_FROM_SERVER ?? BACKEND_DOMAIN_FROM_CLIENT;

export type ApiFetchFunction = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export const getApiDomain = (): string => {
    if (typeof window !== 'undefined') {
        if (BACKEND_DOMAIN_FROM_CLIENT_FROM_PROCESS_ENV) {
            return BACKEND_DOMAIN_FROM_CLIENT_FROM_PROCESS_ENV.endsWith('/')
                ? BACKEND_DOMAIN_FROM_CLIENT_FROM_PROCESS_ENV.slice(0, -1)
                : BACKEND_DOMAIN_FROM_CLIENT_FROM_PROCESS_ENV;
        }
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            return window.location.origin;
        }
    }

    if (BACKEND_DOMAIN_FROM_SERVER_FROM_PROCESS_ENV) {
        return BACKEND_DOMAIN_FROM_SERVER_FROM_PROCESS_ENV.endsWith('/')
            ? BACKEND_DOMAIN_FROM_SERVER_FROM_PROCESS_ENV.slice(0, -1)
            : BACKEND_DOMAIN_FROM_SERVER_FROM_PROCESS_ENV;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    if (process.env.AUTH_URL) {
        return process.env.AUTH_URL.endsWith('/') ? process.env.AUTH_URL.slice(0, -1) : process.env.AUTH_URL;
    }

    if (process.env.NODE_ENV === 'production') {
        return 'https://ismi-analytics.vercel.app';
    }

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

const apiFetch = async (input: RequestInfo, init?: RequestInit, authorization?: string): Promise<Response> => {
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

    try {
        return await fetch(input, init);
    } catch (e: any) {
        const targetUrl = typeof input === "string" ? input : (input as Request)?.url || "unknown";
        console.warn(`[apiFetch] Network error for ${targetUrl}:`, e?.message || e);
        return new Response(JSON.stringify({ error: "Backend unavailable", message: e?.message || String(e) }), {
            status: 503,
            statusText: "Service Unavailable",
            headers: { "Content-Type": "application/json" },
        });
    }
};

export default apiFetch;
