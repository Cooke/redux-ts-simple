"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function defineAction(type) {
    return {
        type: type,
        create: (arg) => {
            if ((typeof arg !== 'object') && (arg !== undefined)) {
                throw "Only object types may be used as payloads for none standard actions";
            }
            return Object.assign({ type: type }, arg || {});
        }
    };
}
exports.defineAction = defineAction;
function defineStandardAction(type) {
    return {
        type: type,
        create: (arg) => ({ type: type, payload: arg })
    };
}
exports.defineStandardAction = defineStandardAction;
class ReducerBuilder {
    constructor(initState) {
        this.initState = initState;
        this.handlers = {};
        this.on = (actionDefinition, handler) => {
            // TODO check if already registered
            this.handlers[actionDefinition.type] = handler;
            return this;
        };
    }
    build() {
        return (state, action) => {
            let handler = this.handlers[action.type];
            let currentState = state || this.initState;
            if (handler) {
                return handler(currentState, action);
            }
            else {
                return currentState;
            }
        };
    }
}
exports.ReducerBuilder = ReducerBuilder;
//# sourceMappingURL=index.js.map