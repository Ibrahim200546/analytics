"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootNode = void 0;
const StatementNode_1 = require("./StatementNode");
const TokenList_1 = require("../Utils/TokenList");
const SemicolonToken_1 = require("../Token/SemicolonToken");
const ControlFlowBreaks_1 = require("../../Error/ControlFlowBreaks");
const ReturnToken_1 = require("../Token/ReturnToken");
const ContinueToken_1 = require("../Token/ContinueToken");
const BreakToken_1 = require("../Token/BreakToken");
class RootNode {
    constructor(statementNodes) {
        this.statementNodes = statementNodes;
    }
    static createFromTokens(tokens) {
        return new RootNode([]);
    }
    run(scope, globalScope, eventDispatcher) {
        let result;
        try {
            for (const statementNode of this.statementNodes) {
                result = statementNode.run(scope, globalScope, eventDispatcher);
            }
        }
        catch (error) {
            if (error instanceof ControlFlowBreaks_1.ControlFlowBreaks) {
                if (error.controlFlowToken instanceof ReturnToken_1.ReturnToken) {
                    return error.result;
                }
                throw new Error(`Not expected "${error.controlFlowToken instanceof ContinueToken_1.ContinueToken ? 'continue' : ''}${error.controlFlowToken instanceof BreakToken_1.BreakToken ? 'break' : ''} control flow construction in root`);
            }
            throw error;
        }
        return result;
    }
    static supports(tokens) {
        return [];
    }
    static create(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        const statements = [];
        while (tokenList.tokens.length > 0) {
            while (tokenList.removeExpectedTokenClasses([SemicolonToken_1.SemicolonToken]))
                ;
            if (tokenList.tokens.length === 0) {
                break;
            }
            const statementNode = tokenList.shiftNode(StatementNode_1.StatementNode);
            statements.push(statementNode);
        }
        return {
            node: new RootNode(statements),
            tokens: [],
        };
    }
}
exports.RootNode = RootNode;
//# sourceMappingURL=RootNode.js.map