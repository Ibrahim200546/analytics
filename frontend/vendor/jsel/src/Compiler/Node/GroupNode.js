"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupNode = void 0;
const ExpressionNode_1 = require("./ExpressionNode");
const TokenList_1 = require("../Utils/TokenList");
const StartBracketToken_1 = require("../Token/StartBracketToken");
const EndBracketToken_1 = require("../Token/EndBracketToken");
const StatementNode_1 = require("./StatementNode");
const SemicolonToken_1 = require("../Token/SemicolonToken");
const IfNode_1 = require("./IfNode");
const WhileNode_1 = require("./WhileNode");
const ForeachNode_1 = require("./ForeachNode");
const ControlFlowNode_1 = require("./ControlFlowNode");
class GroupNode {
    constructor(statements, localScopeVariables = []) {
        this.statements = statements;
        this.localScopeVariables = localScopeVariables;
    }
    static supports(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        while (tokenList.removeExpectedTokenClasses([SemicolonToken_1.SemicolonToken]))
            ;
        if (!tokenList.removeExpectedTokenClasses([
            { token: StartBracketToken_1.StartBracketToken, strings: ['{'] },
        ])) {
            return false;
        }
        while (tokenList.removeExpectedTokenClasses([SemicolonToken_1.SemicolonToken]))
            ;
        while (!tokenList.removeExpectedTokenClasses([{ token: EndBracketToken_1.EndBracketToken, strings: ['}'] }])) {
            while (tokenList.removeExpectedTokenClasses([SemicolonToken_1.SemicolonToken]))
                ;
            tokenList.removeExpectedTokenClasses([[GroupNode, ExpressionNode_1.ExpressionNode, IfNode_1.IfNode, WhileNode_1.WhileNode, ForeachNode_1.ForeachNode, ControlFlowNode_1.ControlFlowNode]]);
        }
        return tokenList.tokens;
    }
    static create(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        const statements = [];
        while (tokenList.removeExpectedTokenClasses([SemicolonToken_1.SemicolonToken]))
            ;
        tokenList.shiftToken(StartBracketToken_1.StartBracketToken);
        while (tokenList.removeExpectedTokenClasses([SemicolonToken_1.SemicolonToken]))
            ;
        while (!tokenList.isExpectedTokenClasses([{ token: EndBracketToken_1.EndBracketToken, strings: ['}'] }])) {
            let needSkipIteration = false;
            while (tokenList.removeExpectedTokenClasses([SemicolonToken_1.SemicolonToken])) {
                needSkipIteration = true;
            }
            if (needSkipIteration) {
                continue;
            }
            statements.push(tokenList.shiftNode(StatementNode_1.StatementNode));
        }
        tokenList.shiftToken(EndBracketToken_1.EndBracketToken);
        while (tokenList.removeExpectedTokenClasses([SemicolonToken_1.SemicolonToken]))
            ;
        return {
            node: new GroupNode(statements),
            tokens: tokenList.tokens,
        };
    }
    run(scope, globalScope, eventDispatcher) {
        const savedScope = { ...scope };
        const localScopeVariableNames = [];
        for (const localScopeVariableName in this.localScopeVariables) {
            scope[localScopeVariableName] = this.localScopeVariables[localScopeVariableName];
            localScopeVariableNames.push(localScopeVariableName);
        }
        let result = undefined;
        for (const statement of this.statements) {
            result = statement.run(scope, scope, eventDispatcher);
        }
        for (const savedScopeKey in savedScope) {
            if (localScopeVariableNames.includes(savedScopeKey)) {
                scope[savedScopeKey] = savedScope[savedScopeKey];
            }
        }
        for (const scopeKey in scope) {
            if (!Object.keys(savedScope).includes(scopeKey)) {
                delete scope[scopeKey];
            }
        }
        return result;
    }
    assignInLocalScope(variableName, value) {
        this.localScopeVariables[variableName] = value;
    }
    removeFromLocalScope(variableName) {
        delete this.localScopeVariables[variableName];
    }
}
exports.GroupNode = GroupNode;
//# sourceMappingURL=GroupNode.js.map