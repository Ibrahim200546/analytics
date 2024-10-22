import React, {RefObject} from "react";
import classnames from "classnames";
import styles from "./Popup.module.scss"

interface PopupProps {
    className?: string;
    hidden: boolean;
    children: React.ReactNode;
    ref?: RefObject<HTMLDivElement>
}

const Popup: React.FC<PopupProps> = ({className = '', hidden, children, ref}) => {
    return (
        <div ref={ref} className={classnames(styles.popup, className, hidden ? styles.hidden : '')}>
            {children}
        </div>
    )
}

export default Popup;
