"use client";

import React, {useEffect, useRef, useState} from "react";
import styles from "./Modal.module.scss";
import classnames from "classnames";

export enum ModalSize {
    Standard = 'Standard',
    Large = 'Large',
    Small = 'Small',
}

interface ModalProps {
    content: React.ReactNode;
    header?: React.ReactNode;
    controls?: React.ReactNode;
    visible?: boolean;
    setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
    size?: ModalSize;
    onHide?: () => void;
}

const Modal: React.FC<ModalProps> = (
    {
        content,
        header,
        controls,
        visible = false,
        setVisible = () => {},
        size = ModalSize.Standard,
        onHide = () => {},
    }
) => {
    const [displayNone, setDisplayNone] = useState<boolean>(true);
    const [fadeHidden, setFadeHidden] = useState<boolean>(true);
    const fadeRef = useRef<HTMLDivElement>();

    useEffect(() => {
        if (visible) {
            setDisplayNone(false);
            setTimeout(() => setFadeHidden(false), 10);
        } else {
            setFadeHidden(true);
            setTimeout(() => setDisplayNone(true), 400);
        }
    }, [visible])

    useEffect(() => {
        if (displayNone) {
            onHide();
        }
    }, [displayNone]);

    const fadeClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === fadeRef.current) {
            setVisible(false);
        }
    }

    return (
        <div
            className={classnames(styles.fade, fadeHidden && styles.fade_hidden)}
            style={{display: displayNone ? 'none' : 'flex'}}
            ref={fadeRef as any}
            onClick={fadeClick}
        >
            <div className={classnames(styles.modal, styles[`modal_size${size}`], fadeHidden && styles.modal_hidden)}>
                {header && (
                    <div className={styles.modal__header}>
                        {header}
                    </div>
                )}
                <div className={styles.modal__content}>
                    {content}
                </div>
                {controls && (
                    <div className={styles.modal__controls}>
                        {controls}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
