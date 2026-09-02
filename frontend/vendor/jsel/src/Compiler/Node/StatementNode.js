"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatementNode = void 0;
const ExpressionNode_1 = require("./ExpressionNode");
const TokenList_1 = require("../Utils/TokenList");
const GroupNode_1 = require("./GroupNode");
const IfNode_1 = require("./IfNode");
const WhileNode_1 = require("./WhileNode");
const ForeachNode_1 = require("./ForeachNode");
const ControlFlowNode_1 = require("./ControlFlowNode");
class StatementNode {
    constructor(node) {
        this.node = node;
    }
    static supports(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        if (tokenList.removeExpectedTokenClasses([[GroupNode_1.GroupNode, ExpressionNode_1.ExpressionNode, IfNode_1.IfNode, WhileNode_1.WhileNode, ForeachNode_1.ForeachNode, ControlFlowNode_1.ControlFlowNode]])) {
            return tokenList.tokens;
        }
        return false;
    }
    static create(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        return {
            node: new StatementNode(tokenList.shiftNode([ExpressionNode_1.ExpressionNode, GroupNode_1.GroupNode, IfNode_1.IfNode, WhileNode_1.WhileNode, ForeachNode_1.ForeachNode, ControlFlowNode_1.ControlFlowNode])),
            tokens: tokenList.tokens,
        };
    }
    run(scope, globalScope, eventDispatcher) {
        return this.node.run(scope, globalScope, eventDispatcher);
    }
}
exports.StatementNode = StatementNode;
//# sourceMappingURL=StatementNode.js.map