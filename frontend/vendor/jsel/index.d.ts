export interface JselEvent {
    path?: string;
    value?: any;
    globalScope: Record<string, any>;
}

export class JselContext {
    scope: Record<string, any>;

    constructor(scope?: Record<string, any>);
}

export class Jsel {
    constructor(context: JselContext);
    exec(code: string): any;
    assign(propertyPath: string, value: any): void;
    addEventListener(type: EventType, listener: (event: JselEvent) => void): void;
    removeEventListener(type: EventType, listener: (event: JselEvent) => void): void;
}

export enum EventType {
    ASSIGN = 0,
}

export function addFunction(name: string, callback: (...args: any[]) => any): void;
