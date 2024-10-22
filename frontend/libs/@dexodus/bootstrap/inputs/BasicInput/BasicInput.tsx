"use client";

import React, {HTMLInputTypeAttribute, LegacyRef, RefObject, useEffect, useRef} from "react";
import styles from "./BasicInput.module.scss";
import {InputProps} from "@/libs/@dexodus/bootstrap/inputs/types";
import classnames from "classnames";

interface BasicInputProps extends InputProps {
    placeholder?: string;
    type: HTMLInputTypeAttribute;
    children?: (icon: React.ReactNode, input: React.ReactNode) => React.ReactNode;
}

const BasicInput: React.FC<BasicInputProps> = (
    {
        value,
        setValue,
        icon,
        type,
        containerClassName,
        iconClassName,
        inputClassName,
        containerRef,
        inputRef,
        iconRef,
        children = (icon, input) => <>{icon}{input}</>,
        placeholder,
    }
) => {
    const basicContainerRef: React.RefObject<HTMLDivElement> = containerRef ?? useRef<HTMLDivElement>(null);
    const basicInputRef: React.RefObject<HTMLInputElement> = inputRef ?? useRef<HTMLInputElement>(null);

    const clickInContainer = () => {
        basicInputRef?.current?.focus();
    }

    useEffect(() => {
        basicContainerRef.current?.addEventListener('click', clickInContainer);

        return () => {
            basicContainerRef.current?.removeEventListener('click', clickInContainer);
        }
    }, [basicContainerRef.current, basicInputRef?.current]);

    return (
        <div
            className={classnames(styles.inputContainer, containerClassName, 'input-container')}
            ref={basicContainerRef}
        >
            {children(
                <div
                    className={classnames(styles.icon, !icon && styles.emptyIcon, iconClassName, 'icon')}
                    ref={iconRef}
                >
                    {icon}
                </div>,
                <input
                    className={classnames(styles.input, inputClassName, 'input')}
                    value={value ?? ''}
                    onChange={event => setValue(event.target.value)}
                    type={type}
                    ref={basicInputRef}
                    placeholder={placeholder}
                />
            )}
        </div>
    );
};

export default BasicInput;
