import {MaskTokenCreateResult, MaskTokenInterface} from "@/libs/@dexodus/bootstrap/common/mask/MaskTokenInterface";

const NUMBER_SYMBOL = '#';

export class NumberMaskToken implements MaskTokenInterface {
    static createFromMask(mask: string): MaskTokenCreateResult {
        if (mask[0] !== NUMBER_SYMBOL) {
            return null;
        }

        return {
            token: new NumberMaskToken(),
            mask: mask.substring(1),
        }
    }

    toMask(): string {
        return NUMBER_SYMBOL;
    }

    checkValue(value: string): string | false {
        if (value[0] >= '0' && value[0] <= '9') {
            return value.substring(1);
        }

        return false;
    }

    complete(): false | string {
        return false;
    }
}
