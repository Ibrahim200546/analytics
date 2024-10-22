'use client';

import React, {useEffect, useState} from "react";
import classNames from "classnames";
import styles from "./Card.module.scss"
import {BackgroundColor, Color, TextColor} from "../../common/colors";
import classnames from "classnames";
import PlusMinus from "../AnimatedIcons/PlusMinus";

export enum CardStyle {
    Default = 'Default',
    WithTopBorder = 'WithTopBorder',
    WithFulledHeader = 'WithFulledHeader',
}

interface CardProps {
    title?: React.ReactNode;
    titleActions?: React.ReactNode | ((defaultActions: React.ReactNode) => React.ReactNode);
    children?: React.ReactNode;
    cardStyle?: CardStyle;
    color?: Color;
    collapse?: boolean;
    withCollapseButton?: boolean;
    fullWidth?: boolean;
    anyWidth?: boolean;
    className?: string;
}

const Card: React.FC<CardProps> = (
    {
        title,
        titleActions = node => node,
        children,
        cardStyle = CardStyle.Default,
        color = Color.None,
        withCollapseButton = false,
        fullWidth = false,
        anyWidth = false,
        className,
    }
) => {
    const [contentCollapsed, setContentCollapsed] = useState<boolean>(true);

    const clickCollapseControl = () => {
        setContentCollapsed(contentCollapsed => !contentCollapsed);
    }

    return (
        <div className={classNames(
            styles.card,
            `_style${cardStyle}`,
            fullWidth && styles.fullWidth,
            anyWidth && styles.anyWidth,
            className,
        )}>
            <div className={styles.title} style={{
                background: BackgroundColor[color],
                color: TextColor[color],
            }}>
                <div>{title}</div>
                <div>
                    {typeof titleActions === 'function' ? titleActions(withCollapseButton && (
                        <PlusMinus showPlus={contentCollapsed} onClick={clickCollapseControl}/>
                    )) : titleActions}
                </div>
            </div>
            <div className={classNames(
                styles.content,
                !contentCollapsed && styles.content_closed,
            )}>{children}</div>
        </div>
    )
}

export default Card;
