import React from "react";
import styles from "./Content.module.scss";
import classNames from "classnames";

interface ContentProps {
    children: React.ReactNode;
    className?: string;
}

const Content: React.FC<ContentProps> = ({className, children}) => {
    return (
        <div className={classNames(styles.content, className)}>
            {children}
        </div>
    );
};

export default Content;
