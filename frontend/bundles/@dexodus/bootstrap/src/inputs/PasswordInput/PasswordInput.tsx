"use client";

import React, {useState} from "react";
import styles from "./PasswordInput.module.scss";
import {Input, InputProps} from "../types";
import BasicInput from "../BasicInput";
import {FaEye, FaEyeSlash} from "react-icons/fa6";

interface PasswordInputProps extends InputProps {
}

const PasswordInput: Input<PasswordInputProps> = (props) => {
    const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);

    return (
        <BasicInput {...props} type={isVisiblePassword ? 'text' : 'password'}>
            {(icon, input) => (
                <>
                    {icon}
                    {input}
                    <div onClick={() => setIsVisiblePassword(isVisiblePassword => !isVisiblePassword)} className={styles.eye}>
                        {isVisiblePassword ? <FaEyeSlash/> : <FaEye/>}
                    </div>
                </>
            )}
        </BasicInput>
    );
};

export default PasswordInput;
