"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IfNode = void 0;
const TokenList_1 = require("../Utils/TokenList");
const IfToken_1 = require("../Token/IfToken");
const StartBracketToken_1 = require("../Token/StartBracketToken");
const EndBracketToken_1 = require("../Token/EndBracketToken");
const ExpressionNode_1 = require("./ExpressionNode");
const StatementNode_1 = require("./StatementNode");
const GroupNode_1 = require("./GroupNode");
const ElseIfToken_1 = require("../Token/ElseIfToken");
const ElseToken_1 = require("../Token/ElseToken");
const WhileNode_1 = require("./WhileNode");
const ForeachNode_1 = require("./ForeachNode");
class IfNode {
    constructor(ifExpressions, trueStatements, falseStatement) {
        this.ifExpressions = ifExpressions;
        this.trueStatements = trueStatements;
        this.falseStatement = falseStatement;
    }
    static supports(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        if (!tokenList.removeExpectedTokenClasses([
            IfToken_1.IfToken,
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
        if (!tokenList.removeExpectedTokenClasses([[GroupNode_1.GroupNode, ExpressionNode_1.ExpressionNode, IfNode, WhileNode_1.WhileNode, ForeachNode_1.ForeachNode]])) {
            return false;
        }
        while (tokenList.removeExpectedTokenClasses([ElseIfToken_1.ElseIfToken, { token: StartBracketToken_1.StartBracketToken, strings: ['('] }, ExpressionNode_1.ExpressionNode, { token: EndBracketToken_1.EndBracketToken, strings: [')'] }, [GroupNode_1.GroupNode, ExpressionNode_1.ExpressionNode, IfNode, WhileNode_1.WhileNode, ForeachNode_1.ForeachNode]]))
            ;
        tokenList.removeExpectedTokenClasses([ElseToken_1.ElseToken, [GroupNode_1.GroupNode, ExpressionNode_1.ExpressionNode, IfNode, WhileNode_1.WhileNode, ForeachNode_1.ForeachNode]]);
        return tokenList.tokens;
    }
    static create(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        tokenList.shiftToken(IfToken_1.IfToken);
        tokenList.shiftToken(StartBracketToken_1.StartBracketToken);
        const ifExpressions = [tokenList.shiftNode(ExpressionNode_1.ExpressionNode)];
        tokenList.shiftToken(EndBracketToken_1.EndBracketToken);
        const trueStatements = [tokenList.shiftNode(StatementNode_1.StatementNode)];
        let falseStatement = null;
        while (tokenList.isExpectedTokenClasses([ElseIfToken_1.ElseIfToken, { token: StartBracketToken_1.StartBracketToken, strings: ['('] }, ExpressionNode_1.ExpressionNode, { token: EndBracketToken_1.EndBracketToken, strings: [')'] }, StatementNode_1.StatementNode])) {
            tokenList.shiftToken(ElseIfToken_1.ElseIfToken);
            tokenList.shiftToken(StartBracketToken_1.StartBracketToken);
            ifExpressions.push(tokenList.shiftNode(ExpressionNode_1.ExpressionNode));
            tokenList.shiftToken(EndBracketToken_1.EndBracketToken);
            trueStatements.push(tokenList.shiftNode(StatementNode_1.StatementNode));
        }
        if (tokenList.isExpectedTokenClasses([ElseToken_1.ElseToken, StatementNode_1.StatementNode])) {
            tokenList.shiftToken(ElseToken_1.ElseToken);
            falseStatement = tokenList.shiftNode(StatementNode_1.StatementNode);
        }
        return {
            node: new IfNode(ifExpressions, trueStatements, falseStatement),
            tokens: tokenList.tokens,
        };
    }
    run(scope, globalScope, eventDispatcher) {
        for (let i = 0; i < this.ifExpressions.length; i++) {
            if (this.ifExpressions[i].run(scope, globalScope, eventDispatcher)) {
                return this.trueStatements[i].run(scope, globalScope, eventDispatcher);
            }
        }
        if (this.falseStatement !== null) {
            return this.falseStatement.run(scope, globalScope, eventDispatcher);
        }
        return undefined;
    }
}
exports.IfNode = IfNode;
//# sourceMappingURL=IfNode.js.map