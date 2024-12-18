/**
 * Sets a cookie with the specified name, value, and options.
 * @param name - The name of the cookie.
 * @param value - The value of the cookie.
 * @param options - Additional options for the cookie (e.g., max-age, path, secure).
 */
export function setCookie(
    name: string,
    value: string,
    options: {
        path?: string;
        domain?: string;
        maxAge?: number;
        expires?: Date;
        secure?: boolean;
        httpOnly?: boolean; // For server-side use only.
        sameSite?: "Strict" | "Lax" | "None";
    } = {}
): void {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.maxAge !== undefined) {
        cookieString += `; max-age=${options.maxAge}`;
    }

    if (options.expires !== undefined) {
        cookieString += `; expires=${options.expires.toUTCString()}`;
    }

    if (options.path !== undefined) {
        cookieString += `; path=${options.path}`;
    }

    if (options.domain !== undefined) {
        cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
        cookieString += `; secure`;
    }

    if (options.sameSite) {
        cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
}

/**
 * Gets the value of a cookie by its name.
 * @param name - The name of the cookie to retrieve.
 * @returns The value of the cookie, or null if not found.
 */
export function getCookie(name: string): string | null {
    const cookies = document.cookie.split('; ');

    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');

        if (decodeURIComponent(cookieName) === name) {
            return decodeURIComponent(cookieValue);
        }
    }

    return null;
}

/**
 * Deletes a cookie by its name.
 * @param name - The name of the cookie to delete.
 * @param options - Additional options for the cookie (e.g., path, domain).
 */
export function deleteCookie(
    name: string,
    options: {
        path?: string;
        domain?: string;
    } = {}
): void {
    setCookie(name, '', {
        ...options,
        maxAge: -1
    });
}
