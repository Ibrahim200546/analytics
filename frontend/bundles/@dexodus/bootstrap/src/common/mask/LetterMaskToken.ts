import {MaskTokenCreateResult, MaskTokenInterface} from "./MaskTokenInterface";

const LETTER_SYMBOL = '$';
const LETTER_PATTERN = /^[A-Za-zА-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүҺһІі]$/;

export class LetterMaskToken implements MaskTokenInterface {
    static createFromMask(mask: string): MaskTokenCreateResult {
        if (mask[0] !== LETTER_SYMBOL) {
            return null;
        }

        return {
            token: new LetterMaskToken(),
            mask: mask.substring(1),
        }
    }

    toMask(): string {
        return LETTER_SYMBOL;
    }

    checkValue(value: string): string | false {
        if (LETTER_PATTERN.test(value[0])) {
            return value.substring(1);
        }

        return false;
    }

    complete(): false | string {
        return false;
    }
}
