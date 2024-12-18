import React from "react";
import ValidatorInterface from "../validators/ValidatorInterface";

export interface GeneralFieldClassName {
    formGroup?: string;
    label?: string;
    input?: string;
    validationErrorsGroup?: string;
    validationError?: string;
}

export enum GeneralFieldEventName {
    ON_INIT = 'onInit',
    ON_CHANGE = 'onChange',
}

export interface GeneralFieldEvent {
    name: GeneralFieldEventName;
    type: 'jsel';
    action: string;
}

export interface GeneralFieldProps {
    property: string;
    label?: React.ReactNode;
    validators?: Array<ValidatorInterface>;
    className?: GeneralFieldClassName;
    events?: GeneralFieldEvent[];
    hidden?: boolean;
}

type GeneralField<Props extends GeneralFieldProps> = React.FC<Props>;

export default GeneralField;
