"use client";

import React, {CSSProperties, useState} from "react";
import styles from "./Stages.module.scss";
import classnames from "classnames";

export type Stage = string;
interface StagesProps {
    stages: Stage[];
    currentStageIndex: number;
    onClick?: (stageIndex: number) => void;
    className?: string;
    style?: CSSProperties;
}

const Stages: React.FC<StagesProps> = ({stages, currentStageIndex, onClick = () => {}, className, style}) => {
    return (
        <div className={classnames(styles.stages, className)} style={style}>
            {stages.map((stage, index) => (
                <div
                    key={index}
                    className={classnames(
                        styles.stageWrapper,
                        currentStageIndex === index && styles.current,
                        currentStageIndex > index && styles.previous,
                    )}>
                    <div className={styles.stage} onClick={() => onClick(index)}>
                        <div className={styles.circle}>{index + 1}</div>
                        <span className={styles.text}>{stage}</span>
                    </div>
                    {index + 1 < stages.length && <div className={styles.line}/>}
                </div>
            ))}
        </div>
    );
};

export default Stages;
