"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflexNode = void 0;
const TokenList_1 = require("../Utils/TokenList");
const VariableNode_1 = require("./VariableNode");
const ReflexToken_1 = require("../Token/ReflexToken");
const Lexer_1 = require("../Lexer");
class ReflexNode {
    constructor(variableNode) {
        this.variableNode = variableNode;
    }
    static supports(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        if (!tokenList.removeExpectedTokenClasses([ReflexToken_1.ReflexToken, VariableNode_1.VariableNode])) {
            return false;
        }
        return tokenList.tokens;
    }
    static create(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        tokenList.shiftToken(ReflexToken_1.ReflexToken);
        const variableNode = tokenList.shiftNode(VariableNode_1.VariableNode);
        return {
            node: new ReflexNode(variableNode),
            tokens: tokenList.tokens,
        };
    }
    set(scope, value, globalScope, eventDispatcher) {
        return this.getVariableNode(scope, globalScope, eventDispatcher).set(scope, value, globalScope, eventDispatcher);
    }
    run(scope, globalScope, eventDispatcher) {
        return this.getVariableNode(scope, globalScope, eventDispatcher).run(scope, globalScope, eventDispatcher);
    }
    getVariableNode(scope, globalScope, eventDispatcher) {
        const value = this.variableNode.run(scope, globalScope, eventDispatcher);
        if (typeof value !== 'string') {
            throw new Error('For reflex operation expected variable of string type');
        }
        const lexer = new Lexer_1.Lexer();
        const tokens = lexer.analyse(value);
        const result = VariableNode_1.VariableNode.supports(tokens);
        if (result === false || result.length !== 0) {
            throw new Error('Expected variable expression in reflex');
        }
        return VariableNode_1.VariableNode.create(tokens).node;
    }
}
exports.ReflexNode = ReflexNode;
//# sourceMappingURL=ReflexNode.js.map