"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
const StringLexer_1 = require("./Lexer/StringLexer");
const StartWithLexer_1 = require("./Lexer/StartWithLexer");
const RegexLexer_1 = require("./Lexer/RegexLexer");
const WordLexer_1 = require("./Lexer/WordLexer");
class Lexer {
    constructor() {
        this.tokenLexers = [new WordLexer_1.WordLexer(), new RegexLexer_1.RegexLexer(), new StartWithLexer_1.StartWithLexer(), new StringLexer_1.StringLexer()];
    }
    analyse(code) {
        const tokens = [];
        while (code.length) {
            let foundedLexer = false;
            code = code.replace(/^ +/, '');
            if (!code.length) {
                break;
            }
            for (const tokenLexer of this.tokenLexers) {
                const lexerResult = tokenLexer.lexer(code);
                if (lexerResult.token) {
                    tokens.push(lexerResult.token);
                    code = lexerResult.remainingCode;
                    foundedLexer = true;
                    break;
                }
            }
            if (!foundedLexer) {
                throw new Error(`Not founded lexer for code "${code}"`);
            }
        }
        return tokens;
    }
}
exports.Lexer = Lexer;
//# sourceMappingURL=Lexer.js.map