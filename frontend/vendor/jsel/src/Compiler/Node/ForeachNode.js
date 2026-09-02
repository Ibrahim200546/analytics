"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForeachNode = void 0;
const TokenList_1 = require("../Utils/TokenList");
const StartBracketToken_1 = require("../Token/StartBracketToken");
const EndBracketToken_1 = require("../Token/EndBracketToken");
const ExpressionNode_1 = require("./ExpressionNode");
const StatementNode_1 = require("./StatementNode");
const GroupNode_1 = require("./GroupNode");
const IfNode_1 = require("./IfNode");
const ForeachToken_1 = require("../Token/ForeachToken");
const VariableNode_1 = require("./VariableNode");
const RightArrowToken_1 = require("../Token/RightArrowToken");
const WhileNode_1 = require("./WhileNode");
const AsToken_1 = require("../Token/AsToken");
const ControlFlowBreaks_1 = require("../../Error/ControlFlowBreaks");
const BreakToken_1 = require("../Token/BreakToken");
const ContinueToken_1 = require("../Token/ContinueToken");
class ForeachNode {
    constructor(targetExpression, nameVariable, valueVariable, statement) {
        this.targetExpression = targetExpression;
        this.nameVariable = nameVariable;
        this.valueVariable = valueVariable;
        this.statement = statement;
    }
    static supports(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        if (!tokenList.removeExpectedTokenClasses([
            ForeachToken_1.ForeachToken,
            { token: StartBracketToken_1.StartBracketToken, strings: ['('] },
        ])) {
            return false;
        }
        if (!tokenList.removeExpectedTokenClasses([ExpressionNode_1.ExpressionNode])) {
            return false;
        }
        if (!tokenList.removeExpectedTokenClasses([AsToken_1.AsToken])) {
            return false;
        }
        if (!tokenList.removeExpectedTokenClasses([VariableNode_1.VariableNode])) {
            return false;
        }
        if (!tokenList.removeExpectedTokenClasses([RightArrowToken_1.RightArrowToken, VariableNode_1.VariableNode])) {
        }
        if (!tokenList.removeExpectedTokenClasses([
            { token: EndBracketToken_1.EndBracketToken, strings: [')'] },
        ])) {
            return false;
        }
        if (!tokenList.removeExpectedTokenClasses([[GroupNode_1.GroupNode, ExpressionNode_1.ExpressionNode, IfNode_1.IfNode, WhileNode_1.WhileNode, ForeachNode]])) {
            return false;
        }
        return tokenList.tokens;
    }
    static create(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        tokenList.shiftToken(ForeachToken_1.ForeachToken);
        tokenList.shiftToken(StartBracketToken_1.StartBracketToken);
        const targetExpression = tokenList.shiftNode(ExpressionNode_1.ExpressionNode);
        tokenList.shiftToken(AsToken_1.AsToken);
        let nameVariable = tokenList.shiftNode(VariableNode_1.VariableNode);
        let valueVariable;
        if (tokenList.isExpectedTokenClasses([RightArrowToken_1.RightArrowToken, VariableNode_1.VariableNode])) {
            tokenList.shiftToken(RightArrowToken_1.RightArrowToken);
            valueVariable = tokenList.shiftNode(VariableNode_1.VariableNode);
        }
        else {
            valueVariable = nameVariable;
            nameVariable = null;
        }
        tokenList.shiftToken(EndBracketToken_1.EndBracketToken);
        const statement = tokenList.shiftNode(StatementNode_1.StatementNode);
        return {
            node: new ForeachNode(targetExpression, nameVariable, valueVariable, statement),
            tokens: tokenList.tokens,
        };
    }
    run(scope, globalScope, eventDispatcher) {
        const targetValue = this.targetExpression.run(scope, globalScope, eventDispatcher);
        if (!Array.isArray(targetValue) && (typeof targetValue !== 'object' || targetValue === null) && typeof targetValue !== 'string') {
            throw new Error('Target value of foreach must be string, array or object');
        }
        for (const targetValueKey in targetValue) {
            try {
                if (this.nameVariable) {
                    this.nameVariable.set(scope, targetValueKey, globalScope, eventDispatcher);
                }
                this.valueVariable.set(scope, targetValue[targetValueKey], globalScope, eventDispatcher);
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
exports.ForeachNode = ForeachNode;
//# sourceMappingURL=ForeachNode.js.map