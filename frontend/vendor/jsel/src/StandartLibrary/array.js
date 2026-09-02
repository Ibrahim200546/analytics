"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayFunctions = void 0;
exports.arrayFunctions = {
    length: (value) => {
        if (Array.isArray(value)) {
            return value.length;
        }
        if (typeof value === 'object' && value !== null) {
            return Object.keys(value).length;
        }
        return null;
    }
};
//# sourceMappingURL=array.js.map