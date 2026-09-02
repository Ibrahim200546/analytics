"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionNode = void 0;
const VariableNode_1 = require("./VariableNode");
const ConstantNode_1 = require("./ConstantNode");
const UnaryOperatorNode_1 = require("./UnaryOperatorNode");
const BinaryOperatorNode_1 = require("./BinaryOperatorNode");
const TokenList_1 = require("../Utils/TokenList");
const CallFunctionNode_1 = require("./CallFunctionNode");
const ReflexNode_1 = require("./ReflexNode");
class ExpressionNode {
    constructor(node) {
        this.node = node;
    }
    static supports(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        if (tokenList.removeExpectedTokenClasses([[BinaryOperatorNode_1.BinaryOperatorNode, UnaryOperatorNode_1.UnaryOperatorNode, CallFunctionNode_1.CallFunctionNode, VariableNode_1.VariableNode, ConstantNode_1.ConstantNode, ReflexNode_1.ReflexNode]])) {
            return tokenList.tokens;
        }
        return false;
    }
    static create(tokens) {
        if (BinaryOperatorNode_1.BinaryOperatorNode.supports(tokens) !== false) {
            const result = BinaryOperatorNode_1.BinaryOperatorNode.create(tokens);
            return {
                node: new ExpressionNode(result.node),
                tokens: result.tokens,
            };
        }
        if (UnaryOperatorNode_1.UnaryOperatorNode.supports(tokens) !== false) {
            const result = UnaryOperatorNode_1.UnaryOperatorNode.create(tokens);
            return {
                node: new ExpressionNode(result.node),
                tokens: result.tokens,
            };
        }
        if (CallFunctionNode_1.CallFunctionNode.supports(tokens) !== false) {
            const result = CallFunctionNode_1.CallFunctionNode.create(tokens);
            return {
                node: new ExpressionNode(result.node),
                tokens: result.tokens,
            };
        }
        if (VariableNode_1.VariableNode.supports(tokens) !== false) {
            const result = VariableNode_1.VariableNode.create(tokens);
            return {
                node: new ExpressionNode(result.node),
                tokens: result.tokens,
            };
        }
        if (ConstantNode_1.ConstantNode.supports(tokens) !== false) {
            const result = ConstantNode_1.ConstantNode.create(tokens);
            return {
                node: new ExpressionNode(result.node),
                tokens: result.tokens,
            };
        }
        if (ReflexNode_1.ReflexNode.supports(tokens) !== false) {
            const result = ReflexNode_1.ReflexNode.create(tokens);
            return {
                node: new ExpressionNode(result.node),
                tokens: result.tokens,
            };
        }
        throw Error('Tokens not supported');
    }
    run(scope, globalScope, eventDispatcher) {
        return this.node.run(scope, globalScope, eventDispatcher);
    }
}
exports.ExpressionNode = ExpressionNode;
//# sourceMappingURL=ExpressionNode.js.map