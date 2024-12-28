"use client";

import React, {useEffect, useRef, useState} from "react";
import styles from "./HelpInformation.module.scss";
import {HiOutlineInformationCircle} from "react-icons/hi";
import {
    autoUpdate,
    flip, FloatingPortal,
    offset,
    shift,
    useDismiss,
    useFloating,
    useFocus,
    useHover, useInteractions,
    useRole, useTransitionStyles,
} from "@floating-ui/react";

interface HelpInformationProps {
    children: string;
}

const HelpInformation: React.FC<HelpInformationProps> = ({children}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement | null>(null);
    const rootBoundary = useRef<HTMLDivElement | null>(null);
    const {refs, floatingStyles, context} = useFloating({
        placement: 'top',
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [offset(10), flip(), shift({rootBoundary: rootBoundary.current ?? 'document'})],
        whileElementsMounted: autoUpdate,
    } as any);

    const hover = useHover(context, {move: false});
    const focus = useFocus(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, {
        role: 'label',
    });

    const {getReferenceProps, getFloatingProps} = useInteractions([
        hover,
        focus,
        dismiss,
        role,
    ]);

    useEffect(() => {
        if (ref.current instanceof HTMLDivElement) {
            rootBoundary.current = ref.current.closest('.floatingContainer');
        }
    }, [ref.current])

    return (
        <div className={styles.helpInformation} ref={ref}>
            <span ref={refs.setReference as any} {...getReferenceProps()}>
                <HiOutlineInformationCircle/>
            </span>
                {isOpen && (
                    <div
                        className={styles.tooltip}
                        ref={refs.setFloating as any}
                        style={floatingStyles}
                        {...getFloatingProps()}
                    >
                        {children}
                    </div>
                )}
        </div>
    );
};

export default HelpInformation;
