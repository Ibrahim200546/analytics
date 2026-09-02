"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnaryOperatorNode = exports.OPERATION = void 0;
const TokenList_1 = require("../Utils/TokenList");
const UnaryOperatorToken_1 = require("../Token/UnaryOperatorToken");
const ExpressionNode_1 = require("./ExpressionNode");
const VariableNode_1 = require("./VariableNode");
var OPERATION;
(function (OPERATION) {
    OPERATION[OPERATION["NOT"] = 0] = "NOT";
    OPERATION[OPERATION["PREFIX_INCREMENT"] = 1] = "PREFIX_INCREMENT";
    OPERATION[OPERATION["PREFIX_DECREMENT"] = 2] = "PREFIX_DECREMENT";
    OPERATION[OPERATION["POSTFIX_INCREMENT"] = 3] = "POSTFIX_INCREMENT";
    OPERATION[OPERATION["POSTFIX_DECREMENT"] = 4] = "POSTFIX_DECREMENT";
})(OPERATION = exports.OPERATION || (exports.OPERATION = {}));
class UnaryOperatorNode {
    constructor(operation, node) {
        this.operation = operation;
        this.node = node;
    }
    static supports(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        if (tokenList.removeExpectedTokenClasses([UnaryOperatorToken_1.UnaryOperatorToken])) {
            const tokensAfterExpression = ExpressionNode_1.ExpressionNode.supports(tokenList.tokens);
            if (tokensAfterExpression !== false) {
                return tokensAfterExpression;
            }
            else {
                return false;
            }
        }
        const tokensAfterVariable = VariableNode_1.VariableNode.supports(tokenList.tokens);
        if (tokensAfterVariable !== false) {
            const tokenListAfterVariable = new TokenList_1.TokenList(tokensAfterVariable);
            if (tokenListAfterVariable.removeExpectedTokenClasses([UnaryOperatorToken_1.UnaryOperatorToken])) {
                return tokenListAfterVariable.tokens;
            }
        }
        return false;
    }
    static create(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        if (tokenList.isExpectedTokenClasses([UnaryOperatorToken_1.UnaryOperatorToken])) {
            const unaryOperatorToken = tokenList.shiftToken(UnaryOperatorToken_1.UnaryOperatorToken);
            if (unaryOperatorToken.tokenString === '!') {
                const result = ExpressionNode_1.ExpressionNode.create(tokenList.tokens);
                return {
                    node: new UnaryOperatorNode(OPERATION.NOT, result.node),
                    tokens: result.tokens,
                };
            }
            if (unaryOperatorToken.tokenString === '++') {
                if (!VariableNode_1.VariableNode.supports(tokenList.tokens)) {
                    throw new Error('For prefix increment available only variable');
                }
                const result = VariableNode_1.VariableNode.create(tokenList.tokens);
                return {
                    node: new UnaryOperatorNode(OPERATION.PREFIX_INCREMENT, result.node),
                    tokens: result.tokens,
                };
            }
            if (unaryOperatorToken.tokenString === '--') {
                if (!VariableNode_1.VariableNode.supports(tokenList.tokens)) {
                    throw new Error('For prefix decrement available only variable');
                }
                const result = VariableNode_1.VariableNode.create(tokenList.tokens);
                return {
                    node: new UnaryOperatorNode(OPERATION.PREFIX_DECREMENT, result.node),
                    tokens: result.tokens,
                };
            }
            throw new Error(`Unknown unary operator: ${unaryOperatorToken.tokenString}`);
        }
        const result = VariableNode_1.VariableNode.create(tokens);
        const tokenListAfterVariableNode = new TokenList_1.TokenList(result.tokens);
        const unaryOperatorToken = tokenListAfterVariableNode.shiftToken();
        if (unaryOperatorToken.tokenString === '++') {
            return {
                node: new UnaryOperatorNode(OPERATION.POSTFIX_INCREMENT, result.node),
                tokens: result.tokens,
            };
        }
        if (unaryOperatorToken.tokenString === '--') {
            return {
                node: new UnaryOperatorNode(OPERATION.POSTFIX_DECREMENT, result.node),
                tokens: result.tokens,
            };
        }
        throw new Error('Unary operator "!" can\'t be right-hand');
    }
    run(scope, globalScope, eventDispatcher) {
        if (this.operation === OPERATION.PREFIX_INCREMENT) {
            const variableNode = this.node;
            const variableResult = variableNode.run(scope, globalScope, eventDispatcher) + 1;
            variableNode.set(scope, variableResult, globalScope, eventDispatcher);
            return variableResult;
        }
        if (this.operation === OPERATION.PREFIX_DECREMENT) {
            const variableNode = this.node;
            const variableResult = variableNode.run(scope, globalScope, eventDispatcher) - 1;
            variableNode.set(scope, variableResult, globalScope, eventDispatcher);
            return variableResult;
        }
        if (this.operation === OPERATION.POSTFIX_INCREMENT) {
            const variableNode = this.node;
            const variableResult = variableNode.run(scope, globalScope, eventDispatcher);
            variableNode.set(scope, variableResult + 1, globalScope, eventDispatcher);
            return variableResult;
        }
        if (this.operation === OPERATION.POSTFIX_DECREMENT) {
            const variableNode = this.node;
            const variableResult = variableNode.run(scope, globalScope, eventDispatcher);
            variableNode.set(scope, variableResult - 1, globalScope, eventDispatcher);
            return variableResult;
        }
        if (this.operation === OPERATION.NOT) {
            return !this.node.run(scope, globalScope, eventDispatcher);
        }
    }
}
exports.UnaryOperatorNode = UnaryOperatorNode;
//# sourceMappingURL=UnaryOperatorNode.js.map