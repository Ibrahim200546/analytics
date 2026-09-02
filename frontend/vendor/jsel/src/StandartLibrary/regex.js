"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regexFunctions = void 0;
exports.regexFunctions = {
    regexTest: (pattern, value) => {
        if (typeof value !== 'string') {
            return false;
        }
        return value.match(pattern) !== null;
    },
};
//# sourceMappingURL=regex.js.map