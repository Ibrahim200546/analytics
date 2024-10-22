export type MaskTokenCreateResult = null | {
    token: MaskTokenInterface,
    mask: string,
};

export interface MaskTokenInterface {
    toMask(): string;
    checkValue(value: string): string | true | false;
    complete(): false | string;
}
