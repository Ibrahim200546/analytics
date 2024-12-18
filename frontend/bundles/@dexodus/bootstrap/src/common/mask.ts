import {CharMaskToken} from "./mask/CharMaskToken";
import {AnyMaskToken} from "./mask/AnyMaskToken";
import {LetterMaskToken} from "./mask/LetterMaskToken";
import {NumberMaskToken} from "./mask/NumberMaskToken";
import {MaskTokenInterface} from "./mask/MaskTokenInterface";
import {OneOfTextMaskToken} from "./mask/OneOfTextMaskToken";

const AVAILABLE_MASK_TOKENS = [
    AnyMaskToken,
    LetterMaskToken,
    NumberMaskToken,
    OneOfTextMaskToken,
    CharMaskToken,
];

export const createMaskTokens = (mask: string): MaskTokenInterface[] => {
    const maskTokens: MaskTokenInterface[] = [];

    while (mask.length > 0) {
        if (mask[0] === '\\') {
            const result = CharMaskToken.createFromMask(mask);

            if (result === null) {
                throw new Error('Something went wrong');
            }

            mask = result.mask;
            maskTokens.push(result.token);
            continue;
        }

        for (const AvailableMaskToken of AVAILABLE_MASK_TOKENS) {
            if ('createFromMask' in AvailableMaskToken) {
                const result = AvailableMaskToken.createFromMask(mask);

                if (result !== null) {
                    mask = result.mask;
                    maskTokens.push(result.token);
                    break;
                }
            }
        }
    }

    return maskTokens;
}

export const checkValueByMaskTokens = (newValue: string, maskTokens: MaskTokenInterface[]): boolean => {
    let processValue = newValue;
    let processMaskTokens = [...maskTokens];

    while (processMaskTokens.length && processValue.length) {
        const maskToken = processMaskTokens.shift() as MaskTokenInterface;
        const checkResult = maskToken.checkValue(processValue);

        if (checkResult === false) {
            return false;
        }

        if (checkResult === true) {
            return true;
        }

        processValue = checkResult;
    }

    return !processValue.length;
}

export const completeValueByMaskTokens = (value: string, maskTokens: MaskTokenInterface[], erase: boolean = false): string => {
    let processValue = value;
    let processMaskTokens = [...maskTokens];

    while (processMaskTokens.length && processValue.length) {
        const maskToken = processMaskTokens.shift() as MaskTokenInterface;
        const checkResult = maskToken.checkValue(processValue);

        if (checkResult === false) {
            return value;
        }

        if (checkResult === true) {
            return value;
        }

        processValue = checkResult;
    }

    if (erase) {
        const backProcessMaskTokens = [...maskTokens].reverse().slice(processMaskTokens.length);

        for (const processMaskToken of backProcessMaskTokens) {
            const complete = processMaskToken.complete();

            if (complete === false) {
                break;
            }

            value = value.substring(0, value.length - complete.length);
        }
    } else {
        for (const processMaskToken of processMaskTokens) {
            const complete = processMaskToken.complete();

            if (complete === false) {
                break;
            }

            value += complete;
        }
    }

    return value;
}

export const processValueByMaskTokens = (newValue: string, oldValue: string, maskTokens: MaskTokenInterface[]): string => {
    const erase = newValue.length < oldValue.length;

    if (!erase && !checkValueByMaskTokens(newValue, maskTokens)) {
        newValue = completeValueByMaskTokens(oldValue, maskTokens) + newValue.substring(oldValue.length);
    }

    if (!checkValueByMaskTokens(newValue, maskTokens)) {
        return oldValue;
    }

    return completeValueByMaskTokens(newValue, maskTokens, erase);
}

export const mergePhoneMasks = (masks: string[]): string => {
    let resultMask = masks[0];

    for (const mask of masks.slice(1)) {
        for (let i = 0; i < mask.length; i++) {
            if (resultMask.length - 1 < i) {
                resultMask += '*';
                continue;
            }

            if (resultMask[i] !== mask[i]) {
                resultMask = resultMask.substring(0, i) + '*' + resultMask.substring(i + 1);
            }
        }
    }

    return resultMask;
}
