"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jsel = void 0;
const Lexer_1 = require("./Compiler/Lexer");
const Parser_1 = require("./Compiler/Parser");
const EventDispatcher_1 = require("./Event/EventDispatcher");
const callFunction_1 = require("./StandartLibrary/callFunction");
const escapeJsonForJsel = (json) => {
    return json
        .replaceAll('\\', '\\\\')
        .replaceAll("'", "\\'")
        .replaceAll('"', '\\"');
};
class Jsel {
    constructor(context) {
        this.context = context;
        this.lexer = new Lexer_1.Lexer();
        this.parser = new Parser_1.Parser();
        this.eventDispatcher = new EventDispatcher_1.default();
    }
    exec(code) {
        try {
            const tokens = this.lexer.analyse(code);
            const rootNode = this.parser.parse(tokens);
            return rootNode.run(this.context.scope, this.context.scope, this.eventDispatcher);
        }
        catch (error) {
            throw new Error(`${error}. Execution code: ${code}`);
        }
    }
    assign(propertyPath, value) {
        if (typeof value === 'function') {
            (0, callFunction_1.addFunction)(propertyPath, value);
        }
        else {
            this.exec(`${propertyPath} = jsonParse("${escapeJsonForJsel(JSON.stringify(value))}")`);
        }
    }
    addEventListener(type, eventListener) {
        // @ts-ignore
        this.eventDispatcher.addEventListener(type, eventListener);
    }
    removeEventListener(type, eventListener) {
        // @ts-ignore
        this.eventDispatcher.removeEventListener(type, eventListener);
    }
}
exports.Jsel = Jsel;
//# sourceMappingURL=Jsel.js.map