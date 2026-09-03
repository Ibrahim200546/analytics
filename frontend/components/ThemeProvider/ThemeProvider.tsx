"use client";

import React, {createContext, useContext, useEffect, useMemo, useState} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const storageKey = "ismi-theme";

const readTheme = (): Theme => {
    const currentTheme = document.documentElement.dataset.theme;

    if (currentTheme === "dark" || currentTheme === "light") {
        return currentTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const ThemeProvider: React.FC<React.PropsWithChildren> = ({children}) => {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        setTheme(readTheme());
    }, []);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        window.localStorage.setItem(storageKey, theme);
    }, [theme]);

    const value = useMemo(() => ({
        theme,
        toggleTheme: () => setTheme(currentTheme => currentTheme === "light" ? "dark" : "light"),
    }), [theme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }

    return context;
};

export default ThemeProvider;
