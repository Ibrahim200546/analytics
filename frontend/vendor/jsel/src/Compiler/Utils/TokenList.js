"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenList = void 0;
class TokenList {
    constructor(tokens) {
        this.tokens = tokens;
    }
    removeExpectedTokenClasses(expectedTokenClasses) {
        const needRemoveTokensCount = this.isExpectedTokenClasses(expectedTokenClasses);
        if (needRemoveTokensCount !== false) {
            this.tokens = this.tokens.slice(needRemoveTokensCount);
            return true;
        }
        return false;
    }
    isExpectedTokenClasses(expectedTokenClasses) {
        if (this.tokens.length < expectedTokenClasses.length) {
            return false;
        }
        let offset = 0;
        for (let i = 0; i < expectedTokenClasses.length; i++) {
            const availableExpectedTokenClasses = (Array.isArray(expectedTokenClasses[i]) ? expectedTokenClasses[i] : [expectedTokenClasses[i]]);
            let needReturnFalse = true;
            for (let expectedTokenClass of availableExpectedTokenClasses) {
                let tokenStrings = null;
                if (expectedTokenClass === null) {
                    needReturnFalse = false;
                    break;
                }
                if ('token' in expectedTokenClass && 'strings' in expectedTokenClass) {
                    tokenStrings = expectedTokenClass.strings;
                    expectedTokenClass = expectedTokenClass.token;
                }
                if ('supports' in expectedTokenClass) {
                    // @ts-ignore
                    const result = expectedTokenClass.supports(this.tokens.slice(i + offset));
                    if (result === false) {
                        continue;
                    }
                    offset += this.tokens.length - result.length - i + offset - 1;
                    needReturnFalse = false;
                    break;
                }
                else {
                    const actualToken = this.tokens[i + offset];
                    if (i + offset >= this.tokens.length) {
                        continue;
                    }
                    if (!(actualToken instanceof expectedTokenClass)) {
                        // if (expectedTokenClass.className !== actualToken.constructor.className) {
                        continue;
                    }
                    if (tokenStrings && !tokenStrings.includes(actualToken.tokenString)) {
                        continue;
                    }
                    needReturnFalse = false;
                    break;
                }
            }
            if (needReturnFalse) {
                return false;
            }
        }
        return offset + expectedTokenClasses.length;
    }
    shiftToken(expectedTokenClass) {
        if (this.tokens.length === 0) {
            throw new Error('Can\'t get next token from empty tokens array');
        }
        const token = this.tokens.shift();
        if (expectedTokenClass && !(token instanceof expectedTokenClass)) {
            // if (expectedTokenClass && token.constructor.name !== expectedTokenClass.name) {
            throw new Error(`Unexpected token ${token.constructor.name}. Expected ${expectedTokenClass.name}`);
        }
        return token;
    }
    shiftNode(nodeClass) {
        const nodeClasses = Array.isArray(nodeClass) ? nodeClass : [nodeClass];
        const errors = [];
        for (const nodeClass of nodeClasses) {
            // @ts-ignore
            if (nodeClass.supports(this.tokens) === false) {
                errors.push(new Error(`Can't create node ${nodeClass.name}`));
                continue;
            }
            // @ts-ignore
            const result = nodeClass.create(this.tokens);
            this.tokens = result.tokens;
            return result.node;
        }
        throw errors[0];
    }
}
exports.TokenList = TokenList;
//# sourceMappingURL=TokenList.js.map