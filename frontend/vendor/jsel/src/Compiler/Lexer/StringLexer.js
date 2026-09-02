"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringLexer = void 0;
const LexerResult_1 = require("./LexerResult");
const StringToken_1 = require("../Token/StringToken");
const STRING_CHARACTERS = ['"', '\''];
const ESCAPE_CHARACTER = '\\';
class StringLexer {
    lexer(code) {
        let stringCharacter = this.getStringCharacter(code);
        if (!stringCharacter) {
            return new LexerResult_1.LexerResult(null, code);
        }
        let i = 1;
        let string = '';
        while (i < code.length) {
            if (code[i] === ESCAPE_CHARACTER) {
                string += code[i + 1];
                i += 2;
                continue;
            }
            if (code[i] === stringCharacter) {
                return new LexerResult_1.LexerResult(new StringToken_1.StringToken(string), code.substring(i + 1));
            }
            string += code[i];
            i++;
        }
        throw new Error(`Expected line-closing character: ${stringCharacter}`);
    }
    getStringCharacter(code) {
        for (const stringCharacter of STRING_CHARACTERS) {
            if (code.startsWith(stringCharacter)) {
                return stringCharacter;
            }
        }
        return null;
    }
}
exports.StringLexer = StringLexer;
//# sourceMappingURL=StringLexer.js.map