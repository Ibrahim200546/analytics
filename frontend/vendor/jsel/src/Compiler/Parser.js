"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const RootNode_1 = require("./Node/RootNode");
class Parser {
    parse(tokens) {
        const result = RootNode_1.RootNode.create(tokens);
        return result.node;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map