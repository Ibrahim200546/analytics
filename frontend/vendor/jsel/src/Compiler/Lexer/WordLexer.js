"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordLexer = void 0;
const LexerResult_1 = require("./LexerResult");
const BooleanToken_1 = require("../Token/BooleanToken");
const NullToken_1 = require("../Token/NullToken");
const IfToken_1 = require("../Token/IfToken");
const ElseToken_1 = require("../Token/ElseToken");
const ElseIfToken_1 = require("../Token/ElseIfToken");
const WhileToken_1 = require("../Token/WhileToken");
const ForeachToken_1 = require("../Token/ForeachToken");
const AsToken_1 = require("../Token/AsToken");
const ReturnToken_1 = require("../Token/ReturnToken");
const BreakToken_1 = require("../Token/BreakToken");
const ContinueToken_1 = require("../Token/ContinueToken");
const WORD_EXPRESSIONS = [
    { tokenClass: BooleanToken_1.BooleanToken, words: ['true', 'false'] },
    { tokenClass: NullToken_1.NullToken, words: ['null'] },
    { tokenClass: IfToken_1.IfToken, words: ['if'] },
    { tokenClass: ElseIfToken_1.ElseIfToken, words: ['elseif'] },
    { tokenClass: ElseToken_1.ElseToken, words: ['else'] },
    { tokenClass: WhileToken_1.WhileToken, words: ['while'] },
    { tokenClass: ForeachToken_1.ForeachToken, words: ['foreach'] },
    { tokenClass: AsToken_1.AsToken, words: ['as'] },
    { tokenClass: ReturnToken_1.ReturnToken, words: ['return'] },
    { tokenClass: BreakToken_1.BreakToken, words: ['break'] },
    { tokenClass: ContinueToken_1.ContinueToken, words: ['continue'] },
];
class WordLexer {
    lexer(code) {
        for (const wordExpression of WORD_EXPRESSIONS) {
            const tokenClass = wordExpression.tokenClass;
            for (const word of wordExpression.words) {
                if (!code.startsWith(word) || code[word.length]?.match(/[A-Za-z]/)) {
                    continue;
                }
                return new LexerResult_1.LexerResult(new tokenClass(word), code.substring(word.length));
            }
        }
        return new LexerResult_1.LexerResult(null, code);
    }
}
exports.WordLexer = WordLexer;
//# sourceMappingURL=WordLexer.js.map