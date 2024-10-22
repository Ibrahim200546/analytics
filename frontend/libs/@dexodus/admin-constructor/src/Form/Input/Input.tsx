import React from "react";
import styles from "./Input.module.scss"
import classNames from "classnames";

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const Input: React.FC<InputProps> = ({className, ...props}) => {
    return (
        <input className={classNames(styles.input, className)} {...props}/>
    )
}

export default Input;
