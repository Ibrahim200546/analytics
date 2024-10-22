import {MaskTokenCreateResult, MaskTokenInterface} from "@/libs/@dexodus/bootstrap/common/mask/MaskTokenInterface";
import {undefined} from "zod";

export class CharMaskToken implements MaskTokenInterface {
    constructor(
        private char: string,
    ) {
    }

    static createFromMask(mask: string): MaskTokenCreateResult {
        return {
            token: new CharMaskToken(mask[0]),
            mask: mask.substring(1),
        }
    }

    toMask(): string {
        return this.char;
    }

    checkValue(value: string): string | false {
        if (this.char === value[0]) {
            return value.substring(1);
        }

        return false;
    }

    complete(): false | string {
        return this.char;
    }
}
