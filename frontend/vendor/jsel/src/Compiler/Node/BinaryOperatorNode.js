"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryOperatorNode = exports.BinaryOperationPriorityEnum = exports.BinaryOperationEnum = void 0;
const TokenList_1 = require("../Utils/TokenList");
const ExpressionNode_1 = require("./ExpressionNode");
const BinaryOperatorToken_1 = require("../Token/BinaryOperatorToken");
const VariableNode_1 = require("./VariableNode");
const ConstantNode_1 = require("./ConstantNode");
const UnaryOperatorNode_1 = require("./UnaryOperatorNode");
const ReflexNode_1 = require("./ReflexNode");
const CallFunctionNode_1 = require("./CallFunctionNode");
var BinaryOperationEnum;
(function (BinaryOperationEnum) {
    BinaryOperationEnum["SUM"] = "+";
    BinaryOperationEnum["SUBTRACTION"] = "-";
    BinaryOperationEnum["MULTIPLICATION"] = "*";
    BinaryOperationEnum["DIVISION"] = "/";
    BinaryOperationEnum["REMAINDER"] = "%";
    BinaryOperationEnum["EXPONENTIAL"] = "**";
    BinaryOperationEnum["ASSIGN"] = "=";
    BinaryOperationEnum["ASSIGN_SUM"] = "+=";
    BinaryOperationEnum["ASSIGN_SUBTRACTION"] = "-=";
    BinaryOperationEnum["ASSIGN_MULTIPLICATION"] = "*=";
    BinaryOperationEnum["ASSIGN_DIVISION"] = "/=";
    BinaryOperationEnum["EQUAL"] = "==";
    BinaryOperationEnum["NOT_EQUAL"] = "!=";
    BinaryOperationEnum["GREATER"] = ">";
    BinaryOperationEnum["GREATER_OR_EQUAL"] = ">=";
    BinaryOperationEnum["LESS"] = "<";
    BinaryOperationEnum["LESS_OR_EQUAL"] = "<=";
    BinaryOperationEnum["AND"] = "&&";
    BinaryOperationEnum["OR"] = "||";
    BinaryOperationEnum["ARRAY_EQUAL"] = "#==";
    BinaryOperationEnum["ARRAY_NOT_EQUAL"] = "#!=";
    BinaryOperationEnum["ARRAY_GREATER"] = "#>";
    BinaryOperationEnum["ARRAY_GREATER_OR_EQUAL"] = "#>=";
    BinaryOperationEnum["ARRAY_LESS"] = "#<";
    BinaryOperationEnum["ARRAY_LESS_OR_EQUAL"] = "#<=";
})(BinaryOperationEnum = exports.BinaryOperationEnum || (exports.BinaryOperationEnum = {}));
const runFunctionForArray = (array, fn) => {
    for (const valueKey in array) {
        const value = array[valueKey];
        if (Array.isArray(value)) {
            const result = runFunctionForArray(value, fn);
            if (result !== true) {
                return [parseInt(valueKey), ...result];
            }
        }
        const result = fn(value);
        if (result !== true) {
            return [parseInt(valueKey)];
        }
    }
    return true;
};
var BinaryOperationPriorityEnum;
(function (BinaryOperationPriorityEnum) {
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["EXPONENTIAL"] = 0] = "EXPONENTIAL";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["MULTIPLICATION"] = 1] = "MULTIPLICATION";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["DIVISION"] = 1] = "DIVISION";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["REMAINDER"] = 1] = "REMAINDER";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["SUM"] = 2] = "SUM";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["SUBTRACTION"] = 2] = "SUBTRACTION";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["EQUAL"] = 3] = "EQUAL";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["NOT_EQUAL"] = 3] = "NOT_EQUAL";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["GREATER"] = 3] = "GREATER";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["GREATER_OR_EQUAL"] = 3] = "GREATER_OR_EQUAL";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["LESS"] = 3] = "LESS";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["LESS_OR_EQUAL"] = 3] = "LESS_OR_EQUAL";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["ARRAY_EQUAL"] = 3] = "ARRAY_EQUAL";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["ARRAY_NOT_EQUAL"] = 3] = "ARRAY_NOT_EQUAL";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["ARRAY_GREATER"] = 3] = "ARRAY_GREATER";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["ARRAY_GREATER_OR_EQUAL"] = 3] = "ARRAY_GREATER_OR_EQUAL";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["ARRAY_LESS"] = 3] = "ARRAY_LESS";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["ARRAY_LESS_OR_EQUAL"] = 3] = "ARRAY_LESS_OR_EQUAL";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["AND"] = 4] = "AND";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["OR"] = 4] = "OR";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["ASSIGN"] = 5] = "ASSIGN";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["ASSIGN_SUM"] = 5] = "ASSIGN_SUM";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["ASSIGN_SUBTRACTION"] = 5] = "ASSIGN_SUBTRACTION";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["ASSIGN_MULTIPLICATION"] = 5] = "ASSIGN_MULTIPLICATION";
    BinaryOperationPriorityEnum[BinaryOperationPriorityEnum["ASSIGN_DIVISION"] = 5] = "ASSIGN_DIVISION";
})(BinaryOperationPriorityEnum = exports.BinaryOperationPriorityEnum || (exports.BinaryOperationPriorityEnum = {}));
class BinaryOperatorNode {
    constructor(operation, leftNode, rightNode) {
        this.operation = operation;
        this.leftNode = leftNode;
        this.rightNode = rightNode;
    }
    static supports(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        if (!tokenList.removeExpectedTokenClasses([[CallFunctionNode_1.CallFunctionNode, VariableNode_1.VariableNode, ConstantNode_1.ConstantNode, UnaryOperatorNode_1.UnaryOperatorNode, ReflexNode_1.ReflexNode]])) {
            return false;
        }
        if (!tokenList.removeExpectedTokenClasses([BinaryOperatorToken_1.BinaryOperatorToken])) {
            return false;
        }
        if (!tokenList.removeExpectedTokenClasses([ExpressionNode_1.ExpressionNode])) {
            return false;
        }
        return tokenList.tokens;
    }
    static create(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        const leftNode = tokenList.shiftNode([CallFunctionNode_1.CallFunctionNode, VariableNode_1.VariableNode, ConstantNode_1.ConstantNode, UnaryOperatorNode_1.UnaryOperatorNode, ReflexNode_1.ReflexNode]);
        const binaryOperatorToken = tokenList.shiftToken(BinaryOperatorToken_1.BinaryOperatorToken);
        const rightNode = tokenList.shiftNode(ExpressionNode_1.ExpressionNode).node;
        const operatorNodes = [];
        const currentNode = BinaryOperatorNode.makeNode(BinaryOperatorNode.getOperation(binaryOperatorToken), leftNode, rightNode);
        if (currentNode.rightNode instanceof BinaryOperatorNode) {
            let tmpNode = currentNode.rightNode;
            while (tmpNode instanceof BinaryOperatorNode) {
                tmpNode = tmpNode.leftNode;
            }
            operatorNodes.push(BinaryOperatorNode.makeNode(currentNode.operation, currentNode.leftNode, tmpNode));
            operatorNodes.push(currentNode.rightNode);
        }
        else {
            operatorNodes.push(BinaryOperatorNode.makeNode(currentNode.operation, currentNode.leftNode, currentNode.rightNode));
        }
        // sort by priority and make one node
        let resultNode = operatorNodes[0];
        if (operatorNodes.length > 1) {
            const firstNode = operatorNodes[0];
            const secondNode = operatorNodes[1];
            if (BinaryOperatorNode.getPriority(firstNode.operation) >= BinaryOperatorNode.getPriority(secondNode.operation)) {
                let node = firstNode;
                while (node.rightNode instanceof BinaryOperatorNode) {
                    node = node.rightNode;
                }
                node.rightNode = secondNode;
                return {
                    node: firstNode,
                    tokens: tokenList.tokens,
                };
            }
            else {
                let node = secondNode;
                while (node.leftNode instanceof BinaryOperatorNode) {
                    node = node.leftNode;
                }
                node.leftNode = firstNode;
                return {
                    node: secondNode,
                    tokens: tokenList.tokens,
                };
            }
        }
        return {
            node: resultNode,
            tokens: tokenList.tokens,
        };
    }
    run(scope, globalScope, eventDispatcher) {
        const leftValue = this.leftNode.run(scope, globalScope, eventDispatcher);
        const rightValue = this.rightNode.run(scope, globalScope, eventDispatcher);
        if (this.operation === BinaryOperationEnum.SUM) {
            return leftValue + rightValue;
        }
        if (this.operation === BinaryOperationEnum.SUBTRACTION) {
            return leftValue - rightValue;
        }
        if (this.operation === BinaryOperationEnum.MULTIPLICATION) {
            return leftValue * rightValue;
        }
        if (this.operation === BinaryOperationEnum.DIVISION) {
            return leftValue / rightValue;
        }
        if (this.operation === BinaryOperationEnum.REMAINDER) {
            return leftValue % rightValue;
        }
        if (this.operation === BinaryOperationEnum.EXPONENTIAL) {
            return leftValue ** rightValue;
        }
        if (this.operation === BinaryOperationEnum.EQUAL || (this.operation === BinaryOperationEnum.ARRAY_EQUAL && !Array.isArray(leftValue))) {
            return leftValue == rightValue;
        }
        if (this.operation === BinaryOperationEnum.NOT_EQUAL || (this.operation === BinaryOperationEnum.ARRAY_NOT_EQUAL && !Array.isArray(leftValue))) {
            return leftValue != rightValue;
        }
        if (this.operation === BinaryOperationEnum.GREATER || (this.operation === BinaryOperationEnum.ARRAY_GREATER && !Array.isArray(leftValue))) {
            return leftValue > rightValue;
        }
        if (this.operation === BinaryOperationEnum.GREATER_OR_EQUAL || (this.operation === BinaryOperationEnum.ARRAY_GREATER_OR_EQUAL && !Array.isArray(leftValue))) {
            return leftValue >= rightValue;
        }
        if (this.operation === BinaryOperationEnum.LESS || (this.operation === BinaryOperationEnum.ARRAY_LESS && !Array.isArray(leftValue))) {
            return leftValue < rightValue;
        }
        if (this.operation === BinaryOperationEnum.LESS_OR_EQUAL || (this.operation === BinaryOperationEnum.ARRAY_LESS_OR_EQUAL && !Array.isArray(leftValue))) {
            return leftValue <= rightValue;
        }
        if (this.operation === BinaryOperationEnum.ARRAY_EQUAL) {
            return runFunctionForArray(leftValue, value => value == rightValue);
        }
        if (this.operation === BinaryOperationEnum.ARRAY_NOT_EQUAL) {
            return runFunctionForArray(leftValue, value => value != rightValue);
        }
        if (this.operation === BinaryOperationEnum.ARRAY_GREATER) {
            return runFunctionForArray(leftValue, value => value > rightValue);
        }
        if (this.operation === BinaryOperationEnum.ARRAY_GREATER_OR_EQUAL) {
            return runFunctionForArray(leftValue, value => value >= rightValue);
        }
        if (this.operation === BinaryOperationEnum.ARRAY_LESS) {
            return runFunctionForArray(leftValue, value => value < rightValue);
        }
        if (this.operation === BinaryOperationEnum.ARRAY_LESS_OR_EQUAL) {
            return runFunctionForArray(leftValue, value => value <= rightValue);
        }
        if (this.operation === BinaryOperationEnum.AND) {
            return leftValue && rightValue;
        }
        if (this.operation === BinaryOperationEnum.OR) {
            return leftValue || rightValue;
        }
        if (this.operation === BinaryOperationEnum.ASSIGN) {
            const variableNode = this.leftNode;
            variableNode.set(scope, this.rightNode.run(scope, globalScope, eventDispatcher), globalScope, eventDispatcher);
            return variableNode.run(scope, globalScope, eventDispatcher);
        }
        if (this.operation === BinaryOperationEnum.ASSIGN_SUM) {
            const variableNode = this.leftNode;
            variableNode.set(scope, variableNode.run(scope, globalScope, eventDispatcher) + this.rightNode.run(scope, globalScope, eventDispatcher), globalScope, eventDispatcher);
            return variableNode.run(scope, globalScope, eventDispatcher);
        }
        if (this.operation === BinaryOperationEnum.ASSIGN_SUBTRACTION) {
            const variableNode = this.leftNode;
            variableNode.set(scope, variableNode.run(scope, globalScope, eventDispatcher) - this.rightNode.run(scope, globalScope, eventDispatcher), globalScope, eventDispatcher);
            return variableNode.run(scope, globalScope, eventDispatcher);
        }
        if (this.operation === BinaryOperationEnum.ASSIGN_MULTIPLICATION) {
            const variableNode = this.leftNode;
            variableNode.set(scope, variableNode.run(scope, globalScope, eventDispatcher) * this.rightNode.run(scope, globalScope, eventDispatcher), globalScope, eventDispatcher);
            return variableNode.run(scope, globalScope, eventDispatcher);
        }
        if (this.operation === BinaryOperationEnum.ASSIGN_DIVISION) {
            const variableNode = this.leftNode;
            variableNode.set(scope, variableNode.run(scope, globalScope, eventDispatcher) / this.rightNode.run(scope, globalScope, eventDispatcher), globalScope, eventDispatcher);
            return variableNode.run(scope, globalScope, eventDispatcher);
        }
    }
    static makeNode(operation, leftNode, rightNode) {
        if (operation.startsWith('ASSIGN') && !(leftNode instanceof VariableNode_1.VariableNode)) {
            throw new Error(`Can't use assign method with non variable left operand`);
        }
        return new BinaryOperatorNode(operation, leftNode, rightNode);
    }
    static getOperation(binaryOperatorToken) {
        for (const binaryOperationEnumElement of Object.entries(BinaryOperationEnum)) {
            if (binaryOperatorToken.tokenString === binaryOperationEnumElement[1]) {
                return BinaryOperationEnum[binaryOperationEnumElement[0]];
            }
        }
        throw new Error(`Undefined binary operation "${binaryOperatorToken.tokenString}"`);
    }
    static getPriority(binaryOperation) {
        for (const binaryOperationEnumElement of Object.entries(BinaryOperationEnum)) {
            if (binaryOperation === binaryOperationEnumElement[1]) {
                return BinaryOperationPriorityEnum[binaryOperationEnumElement[0]];
            }
        }
        throw new Error(`Undefined binary operation "${binaryOperation}"`);
    }
}
exports.BinaryOperatorNode = BinaryOperatorNode;
//# sourceMappingURL=BinaryOperatorNode.js.map