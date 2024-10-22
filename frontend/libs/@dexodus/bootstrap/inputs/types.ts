import React, {RefObject} from "react";

export interface InputProps {
    value: any;
    setValue: React.Dispatch<React.SetStateAction<any>>;
    icon?: React.ReactNode;
    containerClassName?: string;
    inputClassName?: string;
    iconClassName?: string;
    placeholder?: string;
    containerRef?: RefObject<HTMLDivElement>;
    inputRef?: RefObject<HTMLInputElement>;
    iconRef?: RefObject<HTMLDivElement>;
}

export type Input<PropsT extends InputProps> = React.FC<PropsT>;
