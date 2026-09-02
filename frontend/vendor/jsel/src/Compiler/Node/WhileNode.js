"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhileNode = void 0;
const TokenList_1 = require("../Utils/TokenList");
const StartBracketToken_1 = require("../Token/StartBracketToken");
const EndBracketToken_1 = require("../Token/EndBracketToken");
const ExpressionNode_1 = require("./ExpressionNode");
const StatementNode_1 = require("./StatementNode");
const GroupNode_1 = require("./GroupNode");
const WhileToken_1 = require("../Token/WhileToken");
const IfNode_1 = require("./IfNode");
const ForeachNode_1 = require("./ForeachNode");
const ControlFlowBreaks_1 = require("../../Error/ControlFlowBreaks");
const BreakToken_1 = require("../Token/BreakToken");
const ContinueToken_1 = require("../Token/ContinueToken");
class WhileNode {
    constructor(expression, statement) {
        this.expression = expression;
        this.statement = statement;
    }
    static supports(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        if (!tokenList.removeExpectedTokenClasses([
            WhileToken_1.WhileToken,
            { token: StartBracketToken_1.StartBracketToken, strings: ['('] },
        ])) {
            return false;
        }
        if (!tokenList.removeExpectedTokenClasses([ExpressionNode_1.ExpressionNode])) {
            return false;
        }
        if (!tokenList.removeExpectedTokenClasses([
            { token: EndBracketToken_1.EndBracketToken, strings: [')'] },
        ])) {
            return false;
        }
        if (!tokenList.removeExpectedTokenClasses([[GroupNode_1.GroupNode, ExpressionNode_1.ExpressionNode, IfNode_1.IfNode, WhileNode, ForeachNode_1.ForeachNode]])) {
            return false;
        }
        return tokenList.tokens;
    }
    static create(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        tokenList.shiftToken(WhileToken_1.WhileToken);
        tokenList.shiftToken(StartBracketToken_1.StartBracketToken);
        const expression = tokenList.shiftNode(ExpressionNode_1.ExpressionNode);
        tokenList.shiftToken(EndBracketToken_1.EndBracketToken);
        const statement = tokenList.shiftNode(StatementNode_1.StatementNode);
        return {
            node: new WhileNode(expression, statement),
            tokens: tokenList.tokens,
        };
    }
    run(scope, globalScope, eventDispatcher) {
        while (this.expression.run(scope, globalScope, eventDispatcher)) {
            try {
                this.statement.run(scope, globalScope, eventDispatcher);
            }
            catch (error) {
                if (error instanceof ControlFlowBreaks_1.ControlFlowBreaks) {
                    if (error.controlFlowToken instanceof BreakToken_1.BreakToken) {
                        break;
                    }
                    if (error.controlFlowToken instanceof ContinueToken_1.ContinueToken) {
                        continue;
                    }
                }
                throw error;
            }
        }
        return undefined;
    }
}
exports.WhileNode = WhileNode;
//# sourceMappingURL=WhileNode.js.map