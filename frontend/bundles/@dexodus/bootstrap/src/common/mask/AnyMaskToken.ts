import {MaskTokenCreateResult, MaskTokenInterface} from "./MaskTokenInterface";

const ANY_SYMBOL = '*';

export class AnyMaskToken implements MaskTokenInterface {
    static createFromMask(mask: string): MaskTokenCreateResult {
        if (mask[0] !== ANY_SYMBOL) {
            return null;
        }

        return {
            token: new AnyMaskToken(),
            mask: mask.substring(1),
        }
    }

    toMask(): string {
        return ANY_SYMBOL;
    }

    checkValue(value: string): string | false {
        return value.substring(1);
    }

    complete(): false | string {
        return false;
    }
}
