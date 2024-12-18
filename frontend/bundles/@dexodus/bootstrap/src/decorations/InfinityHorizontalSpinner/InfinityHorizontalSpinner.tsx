"use client";

import React from "react";
import styles from "./InfinityHorizontalSpinner.module.scss";

interface InfinityHorizontalSpinnerProps {
    contents: React.ReactNode[];
}

const InfinityHorizontalSpinner: React.FC<InfinityHorizontalSpinnerProps> = ({contents}) => {
    return (
        <div
            className={styles.infinityHorizontalSpinner}
            onMouseDown={event => {
                event.preventDefault();
            }}>
            <div className={styles.contentWrapper}>
                {contents.map((content, index) => (
                    <div className={styles.item} key={index}>{content}</div>
                ))}
                {contents.map((content, index) => (
                    <div className={styles.item} key={index + contents.length}>{content}</div>
                ))}
            </div>
        </div>
    );
};

export default InfinityHorizontalSpinner;
