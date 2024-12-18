"use client";

import React, {CSSProperties} from "react";
import styles from "./ViewInput.module.scss";
import classnames from "classnames";

interface ViewInputProps {
    title: React.ReactNode;
    value: React.ReactNode;
    style?: CSSProperties;
    className?: string;
}

const ViewInput: React.FC<ViewInputProps> = ({title, value, style, className}) => {
    return (
        <div className={classnames(styles.viewInput, className)} style={style}>
            <span>{title}</span>
            <span>{value}</span>
        </div>
    );
};

export default ViewInput;
