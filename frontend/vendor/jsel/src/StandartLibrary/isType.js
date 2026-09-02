"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTypeFunctions = void 0;
exports.isTypeFunctions = {
    getType: (value) => {
        if (value === null) {
            return 'null';
        }
        if (Array.isArray(value)) {
            return 'array';
        }
        return typeof value;
    },
    isBoolean: (value) => {
        return typeof value === 'boolean';
    },
    isNull: (value) => {
        return value === null;
    },
    isArray: (value) => {
        return Array.isArray(value);
    },
    isObject: (value) => {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    },
    isNumber: (value) => {
        return typeof value === 'number';
    },
    isFunction: (value) => {
        return typeof value === 'function';
    },
    isString: (value) => {
        return typeof value === 'string';
    },
    isUndefined: (value) => {
        return value === undefined;
    },
};
//# sourceMappingURL=isType.js.map