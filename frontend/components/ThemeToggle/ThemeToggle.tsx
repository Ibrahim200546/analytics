"use client";

import {FiMoon, FiSun} from "react-icons/fi";
import {useTheme} from "@/components/ThemeProvider/ThemeProvider";
import styles from "./ThemeToggle.module.scss";

const ThemeToggle = () => {
    const {theme, toggleTheme} = useTheme();
    const label = theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему";

    return (
        <button
            type="button"
            className={styles.toggle}
            onClick={toggleTheme}
            aria-label={label}
            title={label}
        >
            {theme === "dark" ? <FiSun aria-hidden="true"/> : <FiMoon aria-hidden="true"/>}
        </button>
    );
};

export default ThemeToggle;
