"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallFunctionNode = void 0;
const TokenList_1 = require("../Utils/TokenList");
const NameToken_1 = require("../Token/NameToken");
const StartBracketToken_1 = require("../Token/StartBracketToken");
const CommaToken_1 = require("../Token/CommaToken");
const ExpressionNode_1 = require("./ExpressionNode");
const EndBracketToken_1 = require("../Token/EndBracketToken");
const VariableNode_1 = require("./VariableNode");
const callFunction_1 = require("../../StandartLibrary/callFunction");
const ConstantNode_1 = require("./ConstantNode");
const UnaryOperatorNode_1 = require("./UnaryOperatorNode");
const BinaryOperatorNode_1 = require("./BinaryOperatorNode");
const ReflexNode_1 = require("./ReflexNode");
class CallFunctionNode {
    constructor(functionName, argumentsNodes) {
        this.functionName = functionName;
        this.argumentsNodes = argumentsNodes;
    }
    static supports(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        if (!tokenList.removeExpectedTokenClasses([
            NameToken_1.NameToken,
            { token: StartBracketToken_1.StartBracketToken, strings: ['('] },
        ])) {
            return false;
        }
        tokenList.removeExpectedTokenClasses([ExpressionNode_1.ExpressionNode]);
        while (tokenList.removeExpectedTokenClasses([CommaToken_1.CommaToken, ExpressionNode_1.ExpressionNode])) { }
        if (!tokenList.removeExpectedTokenClasses([
            { token: EndBracketToken_1.EndBracketToken, strings: [')'] },
        ])) {
            return false;
        }
        return tokenList.tokens;
    }
    static create(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        const functionName = tokenList.shiftToken(NameToken_1.NameToken).tokenString;
        let argumentsNodes = [];
        tokenList.shiftToken(StartBracketToken_1.StartBracketToken);
        if (tokenList.isExpectedTokenClasses([
            [
                CallFunctionNode,
                BinaryOperatorNode_1.BinaryOperatorNode,
                VariableNode_1.VariableNode,
                ConstantNode_1.ConstantNode,
                UnaryOperatorNode_1.UnaryOperatorNode,
                ReflexNode_1.ReflexNode,
            ],
        ])) {
            argumentsNodes.push(tokenList.shiftNode(ExpressionNode_1.ExpressionNode));
            while (tokenList.isExpectedTokenClasses([CommaToken_1.CommaToken, ExpressionNode_1.ExpressionNode])) {
                tokenList.shiftToken(CommaToken_1.CommaToken);
                argumentsNodes.push(tokenList.shiftNode(ExpressionNode_1.ExpressionNode));
            }
        }
        tokenList.shiftToken(EndBracketToken_1.EndBracketToken);
        return {
            node: new CallFunctionNode(functionName, argumentsNodes),
            tokens: tokenList.tokens,
        };
    }
    run(scope, globalScope, eventDispatcher) {
        return (0, callFunction_1.callFunction)(scope, this.functionName, this.argumentsNodes.map((argumentNode) => argumentNode.run(scope, globalScope, eventDispatcher)));
    }
}
exports.CallFunctionNode = CallFunctionNode;
//# sourceMappingURL=CallFunctionNode.js.map