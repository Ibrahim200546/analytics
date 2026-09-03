'use client';

import React from "react";
import styles from "./Button.module.scss";
import classnames from "classnames";
import {ButtonIconPosition, ButtonSizes, ButtonStyle} from "./index";
import tinycolor from "tinycolor2";
import {TailSpin} from "react-loader-spinner";

export interface ButtonProps {
    children?: React.ReactNode;
    style?: ButtonStyle | string;
    bordered?: boolean;
    rounded?: boolean;
    size?: ButtonSizes;
    icon?: React.ReactNode;
    iconPosition?: ButtonIconPosition;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => any;
    className?: string;
    customStyle?: string;
    isLoading?: boolean;
    type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = (
    {
        children,
        style = ButtonStyle.Default,
        bordered = false,
        rounded = false,
        size = ButtonSizes.Default,
        icon,
        iconPosition = ButtonIconPosition.Left,
        onClick = () => {},
        className,
        customStyle,
        isLoading = false,
        type = "button",
    },
) => {
    const customStyles: any = {};

    if (customStyle) {
        customStyles.backgroundColor = customStyle;

        if (tinycolor(customStyle).getBrightness() > 100) {
            customStyles.color = '#000000';
        } else {
            customStyles.color = '#FFFFFF';
        }
    }

    const buttonClassNames = [
        styles.button,
        !isLoading && styles.enabled,
        isLoading && styles.disabled,
        styles[`button_style${style}`],
        styles[`button_size${size}`],
        bordered && styles[`button_style${style}_bordered`],
        rounded && styles[`button_style${style}_rounded`],
        icon && styles[`button_size${size}_icon${iconPosition}`],
        className,
    ].filter((className): className is string => typeof className === "string");

    return (
        <button type={type} onClick={(event) => {
            if (isLoading) {
                return
            }

            return onClick(event);
        }} style={customStyles} className={classnames(buttonClassNames)}>
            {isLoading && (
                <TailSpin width={24} wrapperClass={styles.loader}/>
            )}
            <div className={classnames(isLoading && styles.loaderBackground, styles.contentContainer)}>
                {iconPosition === ButtonIconPosition.Left && <div className={styles.icon}>{icon}</div>}
                {children}
                {iconPosition === ButtonIconPosition.Right && <div className={styles.icon}>{icon}</div>}
            </div>
    </button>
    );
};

export default Button;
