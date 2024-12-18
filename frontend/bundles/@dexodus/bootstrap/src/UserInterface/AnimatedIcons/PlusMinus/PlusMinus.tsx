"use client";

import React from "react";
import styles from "./PlusMinus.module.scss";
import classnames from "classnames";

interface PlusMinusProps {
    color?: string;
    showPlus: boolean;
    onClick?: () => void;
    className?: string;
}

const PlusMinus: React.FC<PlusMinusProps> = ({color = '#000000', showPlus, onClick = () => {}, className}) => {
    return (
        <div
            className={classnames(styles.plusMinus, className)}
            onClick={onClick}
        >
            <div className={styles.plusMinus__part1} style={{background: color}}/>
            <div className={classnames(styles.plusMinus__part2, showPlus && styles.plusMinus__part2_closed)} style={{background: color}}/>
        </div>
    );
};

export default PlusMinus;
