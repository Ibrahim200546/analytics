"use client";

import React, {useState} from "react";
import styles from "./AnalyticsCard.module.scss";
import classnames from "classnames";
import Card from "../../UserInterface/Card";
import {SlSizeFullscreen} from "react-icons/sl";
import useModal from "@/libs/@dexodus/bootstrap/UserInterface/Modal/useModal";
import {ModalSize} from "@/libs/@dexodus/bootstrap/UserInterface/Modal/Modal";
import Button from "@/libs/@dexodus/bootstrap/UserInterface/Button";

interface AnalyticsCardProps {
    charts: React.ReactNode[];
    icons?: React.ReactNode[];
    className?: string;
    title: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({charts, icons, className, title}) => {
    const [selectedChart, setSelectedChart] = useState<number>(0);
    const innerComponent = (
        <div className={classnames(styles.analyticsCard, className)}>
            {charts[selectedChart]}
            <div className={styles.analyticsCard__switcher}>
                {icons?.map((icon, iconIndex) => (
                    <div
                        key={iconIndex}
                        className={classnames(styles.analyticsCard__switcher__item, selectedChart === iconIndex && styles.analyticsCard__switcher__item_active)}
                        onClick={() => setSelectedChart(iconIndex)}
                    >
                        {icon}
                    </div>
                ))}
            </div>
        </div>
    );
    const {modal, show} = useModal(
        <div>{innerComponent}</div>,
        title,
        ({close}) => <Button onClick={close}>Закрыть</Button>,
        ModalSize.Large,
    );

    return (
        <>
            <Card title={title} anyWidth={true} titleActions={(
                <div className={styles.analyticsCardTitleActions} onClick={() => show()}>
                    <SlSizeFullscreen/>
                </div>
            )}>
                {innerComponent}
            </Card>
            {modal}
        </>
    );
};

export default AnalyticsCard;
