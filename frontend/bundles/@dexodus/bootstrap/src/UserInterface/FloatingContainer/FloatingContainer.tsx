import React from "react";
import classnames from "classnames";
import styles from "./FloatingContainer.module.scss"

interface FloatingContainerProps {
    children?: React.ReactNode;
}

const FloatingContainer: React.FC<FloatingContainerProps> = ({children}) => {
    return (
        <div className={classnames("floatingContainer" as any, styles.floatingContainer)}>
            {children}
        </div>
    );
};

export default FloatingContainer;
