"use client";

import React from "react";
import styles from "./ButtonsGroup.module.scss";
import classnames from "classnames";

interface ButtonsGroupProps {
    children: React.ReactNode[];
    className?: string;
}

const ButtonsGroup: React.FC<ButtonsGroupProps> = ({children, className}) => {
    return (
        <div className={classnames(styles.buttonsGroup, className)}>
            {children}
        </div>
    );
};

export default ButtonsGroup;
