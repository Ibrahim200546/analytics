"use client";

import React from "react";
import styles from "./Required.module.scss";

interface RequiredProps {
}

const Required: React.FC<RequiredProps> = ({}) => {
    return (
        <span className={styles.required}>*</span>
    );
};

export default Required;
