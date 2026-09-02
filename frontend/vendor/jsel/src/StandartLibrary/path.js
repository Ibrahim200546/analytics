"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathFunctions = void 0;
exports.pathFunctions = {
    getPathParent: (path) => {
        const dotLastIndex = path.lastIndexOf('.');
        const openBracketLastIndex = path.lastIndexOf('[');
        if (dotLastIndex === -1 && openBracketLastIndex === -1) {
            return '';
        }
        if (dotLastIndex > openBracketLastIndex) {
            return path.substring(0, dotLastIndex);
        }
        else {
            return path.substring(0, openBracketLastIndex);
        }
    },
    removeOldParentFromPath: (path) => {
        const dotLastIndex = path.indexOf('.');
        if (dotLastIndex === -1) {
            return '';
        }
        return path.substring(dotLastIndex + 1);
    },
    getCurrentIndexFromPath(path) {
        let lastIndexStringStart = path.lastIndexOf('["');
        let lastIndexStringEnd = path.lastIndexOf('"]');
        if (lastIndexStringStart !== -1 && lastIndexStringEnd !== -1 && lastIndexStringEnd === path.length - 2) {
            return path.substring(lastIndexStringStart + 2, lastIndexStringEnd);
        }
        lastIndexStringStart = path.lastIndexOf('[\'');
        lastIndexStringEnd = path.lastIndexOf('\']');
        if (lastIndexStringStart !== -1 && lastIndexStringEnd !== -1 && lastIndexStringEnd === path.length - 2) {
            return path.substring(lastIndexStringStart + 2, lastIndexStringEnd);
        }
        const lastIndexNumberStart = path.lastIndexOf('[');
        const lastIndexNumberEnd = path.lastIndexOf(']');
        if (lastIndexNumberStart !== -1 && lastIndexNumberEnd !== -1 && lastIndexNumberEnd === path.length - 1) {
            return parseInt(path.substring(lastIndexNumberStart + 1, lastIndexNumberEnd));
        }
        return null;
    }
};
//# sourceMappingURL=path.js.map