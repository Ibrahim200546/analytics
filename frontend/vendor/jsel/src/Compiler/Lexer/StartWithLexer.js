"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartWithLexer = void 0;
const LexerResult_1 = require("./LexerResult");
const BinaryOperatorToken_1 = require("../Token/BinaryOperatorToken");
const StartBracketToken_1 = require("../Token/StartBracketToken");
const EndBracketToken_1 = require("../Token/EndBracketToken");
const PropertyToken_1 = require("../Token/PropertyToken");
const SemicolonToken_1 = require("../Token/SemicolonToken");
const UnaryOperatorToken_1 = require("../Token/UnaryOperatorToken");
const CommaToken_1 = require("../Token/CommaToken");
const ColonToken_1 = require("../Token/ColonToken");
const RightArrowToken_1 = require("../Token/RightArrowToken");
const ReflexToken_1 = require("../Token/ReflexToken");
const STRING_EXPRESSIONS = [
    { tokenClass: RightArrowToken_1.RightArrowToken, startWith: ['=>'] },
    { tokenClass: BinaryOperatorToken_1.BinaryOperatorToken, startWith: ['&&', '||'] },
    { tokenClass: BinaryOperatorToken_1.BinaryOperatorToken, startWith: ['==', '!=', '>=', '<=', '>', '<'] },
    { tokenClass: BinaryOperatorToken_1.BinaryOperatorToken, startWith: ['#==', '#!=', '#>=', '#<=', '#>', '#<'] },
    { tokenClass: BinaryOperatorToken_1.BinaryOperatorToken, startWith: ['=', '+=', '-=', '*=', '/='] },
    { tokenClass: UnaryOperatorToken_1.UnaryOperatorToken, startWith: ['!', '++', '--'] },
    { tokenClass: BinaryOperatorToken_1.BinaryOperatorToken, startWith: ['**', '+', '-', '*', '/', '%'] },
    { tokenClass: StartBracketToken_1.StartBracketToken, startWith: ['[', '(', '{'] },
    { tokenClass: EndBracketToken_1.EndBracketToken, startWith: [']', ')', '}'] },
    { tokenClass: PropertyToken_1.PropertyToken, startWith: ['.'] },
    { tokenClass: CommaToken_1.CommaToken, startWith: [','] },
    { tokenClass: SemicolonToken_1.SemicolonToken, startWith: [';', '\n'] },
    { tokenClass: ColonToken_1.ColonToken, startWith: [':'] },
    { tokenClass: ReflexToken_1.ReflexToken, startWith: ['$'] },
];
class StartWithLexer {
    lexer(code) {
        for (const stringExpression of STRING_EXPRESSIONS) {
            const tokenClass = stringExpression.tokenClass;
            for (const string of stringExpression.startWith) {
                if (!code.startsWith(string)) {
                    continue;
                }
                return new LexerResult_1.LexerResult(new tokenClass(string), code.substring(string.length));
            }
        }
        return new LexerResult_1.LexerResult(null, code);
    }
}
exports.StartWithLexer = StartWithLexer;
//# sourceMappingURL=StartWithLexer.js.map