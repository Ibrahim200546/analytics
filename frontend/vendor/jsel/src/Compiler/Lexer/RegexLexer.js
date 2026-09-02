"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegexLexer = void 0;
const LexerResult_1 = require("./LexerResult");
const NumberToken_1 = require("../Token/NumberToken");
const NameToken_1 = require("../Token/NameToken");
const RegexExpressions = [
    { tokenClass: NumberToken_1.NumberToken, regex: /^0*(\d+(\.\d+)?)/, group: 1 },
    { tokenClass: NameToken_1.NameToken, regex: /^[@A-Za-z]+[A-Za-z0-9-_]*/, group: 0 },
];
class RegexLexer {
    lexer(code) {
        for (const regexExpression of RegexExpressions) {
            const tokenClass = regexExpression.tokenClass;
            const tokenString = code.match(regexExpression.regex);
            if (tokenString) {
                return new LexerResult_1.LexerResult(new tokenClass(tokenString[regexExpression.group]), code.substring(tokenString[0].length));
            }
        }
        return new LexerResult_1.LexerResult(null, code);
    }
}
exports.RegexLexer = RegexLexer;
//# sourceMappingURL=RegexLexer.js.map