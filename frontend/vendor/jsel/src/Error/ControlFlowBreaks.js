"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlFlowBreaks = void 0;
class ControlFlowBreaks extends Error {
    constructor(controlFlowToken, result = undefined) {
        super();
        this.controlFlowToken = controlFlowToken;
        this.result = result;
    }
}
exports.ControlFlowBreaks = ControlFlowBreaks;
//# sourceMappingURL=ControlFlowBreaks.js.map