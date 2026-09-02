"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstantNode = void 0;
const TokenList_1 = require("../Utils/TokenList");
const StringToken_1 = require("../Token/StringToken");
const BooleanToken_1 = require("../Token/BooleanToken");
const NullToken_1 = require("../Token/NullToken");
const NumberToken_1 = require("../Token/NumberToken");
const StartBracketToken_1 = require("../Token/StartBracketToken");
const EndBracketToken_1 = require("../Token/EndBracketToken");
const ColonToken_1 = require("../Token/ColonToken");
const VariableNode_1 = require("./VariableNode");
const ExpressionNode_1 = require("./ExpressionNode");
const CommaToken_1 = require("../Token/CommaToken");
const RightArrowToken_1 = require("../Token/RightArrowToken");
const GroupNode_1 = require("./GroupNode");
const NameToken_1 = require("../Token/NameToken");
const SemicolonToken_1 = require("../Token/SemicolonToken");
const ControlFlowBreaks_1 = require("../../Error/ControlFlowBreaks");
const ReturnToken_1 = require("../Token/ReturnToken");
const ContinueToken_1 = require("../Token/ContinueToken");
const BreakToken_1 = require("../Token/BreakToken");
class ConstantNode {
    constructor(value, type = 'constant') {
        this.value = value;
        this.type = type;
    }
    static supports(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        if (tokenList.removeExpectedTokenClasses([StringToken_1.StringToken])) {
            return tokenList.tokens;
        }
        if (tokenList.removeExpectedTokenClasses([NumberToken_1.NumberToken])) {
            return tokenList.tokens;
        }
        if (tokenList.removeExpectedTokenClasses([BooleanToken_1.BooleanToken])) {
            return tokenList.tokens;
        }
        if (tokenList.removeExpectedTokenClasses([NullToken_1.NullToken])) {
            return tokenList.tokens;
        }
        if (tokenList.removeExpectedTokenClasses([{ token: StartBracketToken_1.StartBracketToken, strings: ['{'] }])) {
            while (!tokenList.removeExpectedTokenClasses([{ token: EndBracketToken_1.EndBracketToken, strings: ['}'] }])) {
                while (tokenList.removeExpectedTokenClasses([SemicolonToken_1.SemicolonToken]))
                    ;
                if (!tokenList.removeExpectedTokenClasses([StringToken_1.StringToken])) {
                    return false;
                }
                if (!tokenList.removeExpectedTokenClasses([ColonToken_1.ColonToken])) {
                    return false;
                }
                if (!tokenList.removeExpectedTokenClasses([ExpressionNode_1.ExpressionNode])) {
                    return false;
                }
                while (tokenList.removeExpectedTokenClasses([SemicolonToken_1.SemicolonToken]))
                    ;
                if (!tokenList.isExpectedTokenClasses([{ token: EndBracketToken_1.EndBracketToken, strings: ['}'] }])) {
                    if (!tokenList.removeExpectedTokenClasses([CommaToken_1.CommaToken])) {
                        return false;
                    }
                }
            }
            return tokenList.tokens;
        }
        if (tokenList.removeExpectedTokenClasses([{ token: StartBracketToken_1.StartBracketToken, strings: ['['] }])) {
            while (tokenList.removeExpectedTokenClasses([SemicolonToken_1.SemicolonToken]))
                ;
            while (!tokenList.removeExpectedTokenClasses([{ token: EndBracketToken_1.EndBracketToken, strings: [']'] }])) {
                while (tokenList.removeExpectedTokenClasses([SemicolonToken_1.SemicolonToken]))
                    ;
                if (!tokenList.removeExpectedTokenClasses([ExpressionNode_1.ExpressionNode])) {
                    return false;
                }
                while (tokenList.removeExpectedTokenClasses([SemicolonToken_1.SemicolonToken]))
                    ;
                if (!tokenList.isExpectedTokenClasses([{ token: EndBracketToken_1.EndBracketToken, strings: [']'] }])) {
                    if (!tokenList.removeExpectedTokenClasses([CommaToken_1.CommaToken])) {
                        return false;
                    }
                }
            }
            return tokenList.tokens;
        }
        if (tokenList.removeExpectedTokenClasses([{ token: StartBracketToken_1.StartBracketToken, strings: ['('] }])) {
            while (!tokenList.removeExpectedTokenClasses([{ token: EndBracketToken_1.EndBracketToken, strings: [')'] }])) {
                if (!tokenList.removeExpectedTokenClasses([NameToken_1.NameToken])) {
                    return false;
                }
                if (!tokenList.isExpectedTokenClasses([{ token: EndBracketToken_1.EndBracketToken, strings: [')'] }])) {
                    if (!tokenList.removeExpectedTokenClasses([CommaToken_1.CommaToken])) {
                        return false;
                    }
                }
            }
            if (!tokenList.removeExpectedTokenClasses([RightArrowToken_1.RightArrowToken, GroupNode_1.GroupNode])) {
                return false;
            }
            return tokenList.tokens;
        }
        return false;
    }
    static create(tokens) {
        const tokenList = new TokenList_1.TokenList(tokens);
        if (tokenList.isExpectedTokenClasses([StringToken_1.StringToken])) {
            const stringToken = tokenList.shiftToken(StringToken_1.StringToken);
            return {
                node: new ConstantNode(stringToken.tokenString),
                tokens: tokenList.tokens,
            };
        }
        if (tokenList.isExpectedTokenClasses([NumberToken_1.NumberToken])) {
            const numberToken = tokenList.shiftToken(NumberToken_1.NumberToken);
            return {
                node: new ConstantNode(parseFloat(numberToken.tokenString)),
                tokens: tokenList.tokens,
            };
        }
        if (tokenList.isExpectedTokenClasses([BooleanToken_1.BooleanToken])) {
            const booleanToken = tokenList.shiftToken(BooleanToken_1.BooleanToken);
            return {
                node: new ConstantNode(booleanToken.tokenString === 'true'),
                tokens: tokenList.tokens,
            };
        }
        if (tokenList.isExpectedTokenClasses([NullToken_1.NullToken])) {
            tokenList.shiftToken(NullToken_1.NullToken);
            return {
                node: new ConstantNode(null),
                tokens: tokenList.tokens,
            };
        }
        if (tokenList.removeExpectedTokenClasses([{ token: StartBracketToken_1.StartBracketToken, strings: ['{'] }])) {
            while (tokenList.removeExpectedTokenClasses([SemicolonToken_1.SemicolonToken]))
                ;
            const fields = [];
            while (!tokenList.removeExpectedTokenClasses([{ token: EndBracketToken_1.EndBracketToken, strings: ['}'] }])) {
                while (tokenList.removeExpectedTokenClasses([SemicolonToken_1.SemicolonToken]))
                    ;
                const fieldNameNode = tokenList.shiftNode(ConstantNode);
                tokenList.shiftToken(ColonToken_1.ColonToken);
                const valueNode = tokenList.shiftNode(ExpressionNode_1.ExpressionNode);
                while (tokenList.removeExpectedTokenClasses([SemicolonToken_1.SemicolonToken]))
                    ;
                if (!tokenList.isExpectedTokenClasses([{ token: EndBracketToken_1.EndBracketToken, strings: ['}'] }])) {
                    tokenList.shiftToken(CommaToken_1.CommaToken);
                }
                fields.push({ name: fieldNameNode, value: valueNode });
            }
            return {
                node: new ConstantNode(fields, 'object'),
                tokens: tokenList.tokens,
            };
        }
        if (tokenList.removeExpectedTokenClasses([{ token: StartBracketToken_1.StartBracketToken, strings: ['['] }])) {
            while (tokenList.removeExpectedTokenClasses([SemicolonToken_1.SemicolonToken]))
                ;
            const fields = [];
            while (!tokenList.removeExpectedTokenClasses([{ token: EndBracketToken_1.EndBracketToken, strings: [']'] }])) {
                while (tokenList.removeExpectedTokenClasses([SemicolonToken_1.SemicolonToken]))
                    ;
                const valueNode = tokenList.shiftNode(ExpressionNode_1.ExpressionNode);
                while (tokenList.removeExpectedTokenClasses([SemicolonToken_1.SemicolonToken]))
                    ;
                if (!tokenList.isExpectedTokenClasses([{ token: EndBracketToken_1.EndBracketToken, strings: [']'] }])) {
                    tokenList.shiftToken(CommaToken_1.CommaToken);
                }
                fields.push({ value: valueNode });
            }
            return {
                node: new ConstantNode(fields, 'array'),
                tokens: tokenList.tokens,
            };
        }
        if (tokenList.removeExpectedTokenClasses([{ token: StartBracketToken_1.StartBracketToken, strings: ['('] }])) {
            const argumentVariables = [];
            while (!tokenList.removeExpectedTokenClasses([{ token: EndBracketToken_1.EndBracketToken, strings: [')'] }])) {
                const argumentVariable = tokenList.shiftNode(VariableNode_1.VariableNode);
                if (!tokenList.isExpectedTokenClasses([{ token: EndBracketToken_1.EndBracketToken, strings: [')'] }])) {
                    tokenList.shiftToken(CommaToken_1.CommaToken);
                }
                argumentVariables.push(argumentVariable);
            }
            tokenList.shiftToken(RightArrowToken_1.RightArrowToken);
            const functionGroup = tokenList.shiftNode(GroupNode_1.GroupNode);
            return {
                node: new ConstantNode({ arguments: argumentVariables, group: functionGroup }, 'function'),
                tokens: tokenList.tokens,
            };
        }
        throw new Error('Token not found');
    }
    run(scope, globalScope, eventDispatcher) {
        if (this.type === 'object') {
            const object = {};
            for (const field of this.value) {
                object[field.name.run(scope, globalScope, eventDispatcher)] = field.value.run(scope, globalScope, eventDispatcher);
            }
            return object;
        }
        else if (this.type === 'array') {
            const arr = [];
            let i = 0;
            for (const field of this.value) {
                arr[i] = field.value.run(scope, globalScope, eventDispatcher);
                i++;
            }
            return arr;
        }
        else if (this.type === 'function') {
            const value = this.value;
            return (...args) => {
                let i = 0;
                for (const argumentNode of value.arguments) {
                    value.group.assignInLocalScope(argumentNode.name, args[i]);
                    i++;
                }
                let result;
                try {
                    result = value.group.run(scope, globalScope, eventDispatcher);
                }
                catch (error) {
                    if (error instanceof ControlFlowBreaks_1.ControlFlowBreaks) {
                        if (error.controlFlowToken instanceof ReturnToken_1.ReturnToken) {
                            result = error.result;
                        }
                        else {
                            throw new Error(`Not expected "${error.controlFlowToken instanceof ContinueToken_1.ContinueToken ? 'continue' : ''}${error.controlFlowToken instanceof BreakToken_1.BreakToken ? 'break' : ''} control flow construction in root of function`);
                        }
                    }
                    else {
                        throw error;
                    }
                }
                finally {
                    for (const argumentNode of value.arguments) {
                        value.group.removeFromLocalScope(argumentNode.name);
                    }
                }
                return result;
            };
        }
        return this.value;
    }
}
exports.ConstantNode = ConstantNode;
//# sourceMappingURL=ConstantNode.js.map