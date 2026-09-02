"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFunction = exports.callFunction = void 0;
const regex_1 = require("./regex");
const path_1 = require("./path");
const isType_1 = require("./isType");
const string_1 = require("./string");
const date_1 = require("./date");
const iin_1 = require("./iin");
const array_1 = require("./array");
const functionsStack = {
    log: (message) => {
        console.log(message);
    },
    jsonParse: (text) => {
        return JSON.parse(text);
    },
    parseInt: (numeric) => {
        return parseInt(numeric);
    },
    confirm: (question) => {
        return confirm(question);
    },
    ...regex_1.regexFunctions,
    ...path_1.pathFunctions,
    ...isType_1.isTypeFunctions,
    ...string_1.string,
    ...date_1.dateFunctions,
    ...iin_1.iinFunctions,
    ...array_1.arrayFunctions,
};
const callFunction = (scope, functionName, argumentsValues) => {
    if (functionName in scope && typeof scope[functionName] === 'function') {
        return scope[functionName](...argumentsValues);
    }
    if (functionName in functionsStack) {
        return functionsStack[functionName](...argumentsValues);
    }
    throw new Error(`Unexpected call function "${functionName}"`);
};
exports.callFunction = callFunction;
const addFunction = (functionName, fn) => {
    functionsStack[functionName] = fn;
};
exports.addFunction = addFunction;
//# sourceMappingURL=callFunction.js.map