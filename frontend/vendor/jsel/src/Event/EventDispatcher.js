"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventDispatcher {
    constructor() {
        this.eventListeners = {};
    }
    dispatch(event) {
        const eventListeners = this.eventListeners[event.type] ?? [];
        for (const eventListener of eventListeners) {
            eventListener(event);
        }
    }
    addEventListener(type, eventListener) {
        const typeValue = type.valueOf();
        if (!(typeValue in this.eventListeners)) {
            this.eventListeners[typeValue] = [];
        }
        this.eventListeners[typeValue].push(eventListener);
    }
    removeEventListener(type, eventListener) {
        const typeValue = type.valueOf();
        if (!(typeValue in this.eventListeners)) {
            return;
        }
        this.eventListeners[typeValue] = this.eventListeners[typeValue].filter(myEventListener => myEventListener !== eventListener);
    }
}
exports.default = EventDispatcher;
//# sourceMappingURL=EventDispatcher.js.map