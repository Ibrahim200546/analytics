import React from "react";
import styles from "./Window.module.scss";
import classNames from "classnames";

type WindowProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

const Window: React.FC<WindowProps> = ({className, children, ...props}) => {
    return (
        <div className={classNames(className, styles.window)} {...props}>
            {children}
        </div>
    );
};

export default Window;
