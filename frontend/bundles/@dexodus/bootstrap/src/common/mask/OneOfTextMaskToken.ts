import {MaskTokenCreateResult, MaskTokenInterface} from "./MaskTokenInterface";

const START_BRACKET_SYMBOL = '{';
const END_BRACKET_SYMBOL = '}';
const TEXT_SEPARATOR_SYMBOL = '|';

export class OneOfTextMaskToken implements MaskTokenInterface {
    constructor(
        private texts: string[],
    ) {
    }

    static createFromMask(mask: string): MaskTokenCreateResult {
        if (mask[0] !== START_BRACKET_SYMBOL) {
            return null;
        }

        const endBracketIndex = mask.indexOf(END_BRACKET_SYMBOL);

        if (endBracketIndex === -1) {
            throw new Error(`Expected closed bracket "${END_BRACKET_SYMBOL}" in mask`);
        }

        return {
            token: new OneOfTextMaskToken(mask.substring(1, endBracketIndex).split(TEXT_SEPARATOR_SYMBOL)),
            mask: mask.substring(endBracketIndex + 1),
        }
    }

    checkValue(value: string): string | true | false {
        for (const text of this.texts) {
            if (value.startsWith(text)) {
                return value.substring(text.length);
            }

            if (text.startsWith(value)) {
                return true;
            }
        }

        return false;
    }

    complete(): false | string {
        return this.texts.length === 1 ? this.texts[0] : false;
    }

    toMask(): string {
        return `${START_BRACKET_SYMBOL}${this.texts.join(TEXT_SEPARATOR_SYMBOL)}${END_BRACKET_SYMBOL}`;
    }
}
