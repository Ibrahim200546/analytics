'use client'

import React from "react";
import styles from "./Popup.module.scss"
import classnames from "classnames";

interface PopupProps {
    children?: React.ReactNode;
    visible?: boolean;
    asCard?: boolean;
}

const Popup: React.FC<PopupProps> = (
    {
        children,
        visible = false,
        asCard = true,
    }
) => {
    return (
        <div className={classnames(
            styles.popup,
            asCard && styles.asCard,
            !visible && styles.popup_hidden,
        )}>
            {children}
        </div>
    )
};

export default Popup;
