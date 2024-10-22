import React from "react";
import styles from "./ValidationErrors.module.scss";
import classnames from "classnames";

interface ValidationErrorsProps {
    validationErrors: string[];
    className?: {
        validationErrorsGroup?: string;
        validationError?: string;
    }
}

const ValidationErrors: React.FC<ValidationErrorsProps> = ({validationErrors, className}) => {
    return (
        <div className={classnames(styles.validationErrors, className?.validationErrorsGroup)}>
            {validationErrors.map(error => <div key={error} className={classnames(styles.validationError, className?.validationError)}>{error}</div>)}
        </div>
    )
}

export default ValidationErrors;
