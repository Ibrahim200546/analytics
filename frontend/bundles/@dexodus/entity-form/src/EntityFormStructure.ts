import {GeneralFieldEvent} from "@dexodus/react-form/src/fields/GeneralField";

export enum EntityFormFieldEventType {
    ON_CHANGE = 'onChange',
    ON_INIT = 'onInit',
}

export enum EntityFormEventType {
    ON_BEFORE_SEND = 'onBeforeSend',
    ON_AFTER_CREATE = 'onAfterCreate',
    ON_AFTER_EDIT = 'onAfterEdit',
}

export interface EntityFormFieldEvent {
    type: string;
    name: EntityFormFieldEventType;
    action: any;
}

export interface EntityFormValidator {
    type: string;
    errorMessage: string;
    rules: any;
}

export interface EntityFormField {
    path: string;
    component: string;
    componentArguments: {[componentOption: string]: any};
    title: string;
    priority: number;
    defaultValue: any;
    hidden: boolean;
    fields?: EntityFormField[];
    validators?: EntityFormValidator[];
    events?: GeneralFieldEvent[];
    sectionGroupKey: string;
}

export interface EntityFormEvent {
    type: string;
    name: EntityFormEventType;
    action: any;
}

export interface EntityFormStructure {
    name: string;
    entity: string;
    paths: {
        create?: string;
        edit?: string;
        view?: string;
        collection?: string;
    };
    fields: EntityFormField[];
    events: EntityFormEvent[];
    idColumn: string;
}

export default EntityFormStructure;
