"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlFlowNode = void 0;
const TokenList_1 = require("../Utils/TokenList");
const ReturnToken_1 = require("../Token/ReturnToken");
const BreakToken_1 = require("../Token/BreakToken");
const ContinueToken_1 = require("../Token/ContinueToken");
const ControlFlowBreaks_1 = require("../../Error/ControlFlowBreaks");
const ExpressionNode_1 = require("./ExpressionNode");
class ControlFlowNode {
    constructor(token, expressionNode) {
        this.token = token;
        this.expressionNode = expressionNode;
    }
    static supports(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        if (tokenList.removeExpectedTokenClasses([ReturnToken_1.ReturnToken, ExpressionNode_1.ExpressionNode])) {
        }
        else if (!tokenList.removeExpectedTokenClasses([[ReturnToken_1.ReturnToken, BreakToken_1.BreakToken, ContinueToken_1.ContinueToken]])) {
            return false;
        }
        return tokenList.tokens;
    }
    static create(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        const controlFlowToken = tokenList.shiftToken();
        let expressionNode = undefined;
        if (controlFlowToken instanceof ReturnToken_1.ReturnToken && tokenList.isExpectedTokenClasses([ExpressionNode_1.ExpressionNode])) {
            expressionNode = tokenList.shiftNode([ExpressionNode_1.ExpressionNode]);
        }
        return {
            node: new ControlFlowNode(controlFlowToken, expressionNode),
            tokens: tokenList.tokens,
        };
    }
    run(scope, globalScope, eventDispatcher) {
        throw new ControlFlowBreaks_1.ControlFlowBreaks(this.token, this.expressionNode?.run(scope, globalScope, eventDispatcher));
    }
}
exports.ControlFlowNode = ControlFlowNode;
//# sourceMappingURL=ControlFlowNode.js.map