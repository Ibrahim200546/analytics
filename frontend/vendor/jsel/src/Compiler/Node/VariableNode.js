"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableNode = void 0;
const NameToken_1 = require("../Token/NameToken");
const TokenList_1 = require("../Utils/TokenList");
const PropertyToken_1 = require("../Token/PropertyToken");
const StartBracketToken_1 = require("../Token/StartBracketToken");
const EndBracketToken_1 = require("../Token/EndBracketToken");
const ExpressionNode_1 = require("./ExpressionNode");
const Event_1 = require("../../Event/Event");
class VariableNode {
    constructor(name, propertyNode = null, isArrayAccess = false, expressionNode = null) {
        this.name = name;
        this.propertyNode = propertyNode;
        this.isArrayAccess = isArrayAccess;
        this.expressionNode = expressionNode;
    }
    static supports(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        if (!tokenList.removeExpectedTokenClasses([NameToken_1.NameToken])) {
            return false;
        }
        let isRemovedTokens;
        do {
            isRemovedTokens = false;
            while (tokenList.removeExpectedTokenClasses([PropertyToken_1.PropertyToken, NameToken_1.NameToken])) {
                isRemovedTokens = true;
            }
            while (tokenList.removeExpectedTokenClasses([{ token: StartBracketToken_1.StartBracketToken, strings: ['['] }, ExpressionNode_1.ExpressionNode, { token: EndBracketToken_1.EndBracketToken, strings: [']'] }])) {
                isRemovedTokens = true;
            }
        } while (isRemovedTokens);
        return tokenList.tokens;
    }
    static create(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        let name;
        let expressionNode;
        let isArrayAccess = false;
        let propertyVariableNode = null;
        if (tokenList.isExpectedTokenClasses([{ token: StartBracketToken_1.StartBracketToken, strings: ['['] }, ExpressionNode_1.ExpressionNode, { token: EndBracketToken_1.EndBracketToken, strings: [']'] }])) {
            tokenList.shiftToken(StartBracketToken_1.StartBracketToken);
            const result = ExpressionNode_1.ExpressionNode.create(tokenList.tokens);
            tokenList.tokens = result.tokens;
            isArrayAccess = true;
            expressionNode = result.node;
            tokenList.shiftToken(EndBracketToken_1.EndBracketToken);
            if (tokenList.isExpectedTokenClasses([{ token: StartBracketToken_1.StartBracketToken, strings: ['['] }, ExpressionNode_1.ExpressionNode, { token: EndBracketToken_1.EndBracketToken, strings: [']'] }])) {
                const result = VariableNode.create(tokenList.tokens);
                tokenList.tokens = result.tokens;
                propertyVariableNode = result.node;
            }
        }
        else {
            const nameToken = tokenList.shiftToken(NameToken_1.NameToken);
            name = nameToken.tokenString;
        }
        if (tokenList.isExpectedTokenClasses([PropertyToken_1.PropertyToken, NameToken_1.NameToken])) {
            tokenList.shiftToken(PropertyToken_1.PropertyToken);
            const result = VariableNode.create(tokenList.tokens);
            tokenList.tokens = result.tokens;
            propertyVariableNode = result.node;
        }
        else if (tokenList.isExpectedTokenClasses([{ token: StartBracketToken_1.StartBracketToken, strings: ['['] }, ExpressionNode_1.ExpressionNode, { token: EndBracketToken_1.EndBracketToken, strings: [']'] }])) {
            const result = VariableNode.create(tokenList.tokens);
            tokenList.tokens = result.tokens;
            propertyVariableNode = result.node;
        }
        else if (tokenList.isExpectedTokenClasses([{ token: StartBracketToken_1.StartBracketToken, strings: ['['] }, VariableNode, { token: EndBracketToken_1.EndBracketToken, strings: [']'] }])) {
            const result = VariableNode.create(tokenList.tokens);
            tokenList.tokens = result.tokens;
            propertyVariableNode = result.node;
        }
        return {
            node: new VariableNode(name, propertyVariableNode, isArrayAccess, expressionNode),
            tokens: tokenList.tokens,
        };
    }
    run(scope, globalScope, eventDispatcher) {
        const name = this.expressionNode ? this.expressionNode.run(globalScope, globalScope, eventDispatcher) : this.name; // TODO : need use globalScope
        if (this.propertyNode) {
            if (this.isArrayAccess && name === '*') {
                return scope.map(scope => this.propertyNode.run(scope, globalScope, eventDispatcher));
            }
            return this.propertyNode.run(scope[name], globalScope, eventDispatcher);
        }
        if (this.isArrayAccess && name === '*') {
            return scope;
        }
        return scope[name];
    }
    set(scope, value, globalScope, eventDispatcher, path = '') {
        const name = this.expressionNode ? this.expressionNode.run(globalScope, globalScope, eventDispatcher) : this.name; // TODO : need use globalScope
        if (this.propertyNode) {
            if (this.isArrayAccess && name === '*') {
                scope = scope.map((scope, index) => this.propertyNode.set(scope, value, globalScope, eventDispatcher, `${path}[${index}]`));
            }
            else {
                const newPath = this.isArrayAccess ? `${path}[${name}]` : `${path}${path !== '' ? '.' : ''}${name}`;
                scope[name] = this.propertyNode.set(scope[name], value, globalScope, eventDispatcher, newPath);
            }
        }
        else {
            if (this.isArrayAccess && name === '*') {
                scope = scope.map(() => value);
                scope.forEach((value, index) => {
                    eventDispatcher.dispatch({ type: Event_1.EventType.ASSIGN, globalScope, value, path: `${path}[${index}]` });
                });
            }
            else {
                scope[name] = value;
                const newPath = this.isArrayAccess ? `${path}[${name}]` : `${path}${path !== '' ? '.' : ''}${name}`;
                eventDispatcher.dispatch({ type: Event_1.EventType.ASSIGN, globalScope, value, path: newPath });
            }
        }
        return scope;
    }
}
exports.VariableNode = VariableNode;
//# sourceMappingURL=VariableNode.js.map