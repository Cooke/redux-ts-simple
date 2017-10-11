"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
function createAction(type) {
    var actionCreator = function (payload, meta) { return ({
        type: type,
        payload: payload,
        meta: meta,
        error: payload instanceof Error
    }); };
    actionCreator.type = type;
    return actionCreator;
}
exports.createAction = createAction;
var ReducerBuilder = (function () {
    function ReducerBuilder(initState) {
        var _this = this;
        this.initState = initState;
        this.handlers = {};
        this.elseHandler = null;
        this.everyHandler = null;
        this.every = function (handler) {
            _this.everyHandler = handler;
            return _this;
        };
        this.else = function (handler) {
            _this.elseHandler = handler;
            return _this;
        };
        this.registerActionHandler = function (actionDefinition, handler) {
            if (_this.handlers[actionDefinition.type]) {
                throw new Error("An action handler has already been registered for the action '" + actionDefinition.type + "'.");
            }
            _this.handlers[actionDefinition.type] = handler;
            return _this;
        };
    }
    ReducerBuilder.prototype.on = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        for (var i = 0; i < args.length - 1; i++) {
            this.registerActionHandler(args[i], args[args.length - 1]);
        }
        return this;
    };
    ReducerBuilder.prototype.build = function () {
        var _this = this;
        return function (state, action) {
            var handler = _this.handlers[action.type];
            var elseHandler = _this.elseHandler;
            var currentState = state || _this.initState;
            if (handler) {
                currentState = handler(currentState, action);
            }
            else if (elseHandler) {
                currentState = elseHandler(currentState, action);
            }
            if (_this.everyHandler) {
                currentState = _this.everyHandler(currentState, action);
            }
            return currentState;
        };
    };
    return ReducerBuilder;
}());
exports.ReducerBuilder = ReducerBuilder;
// The purpose with the merge functions is to enable more type safe spread operations
function merge(existing, updates) {
    return __assign({}, existing, updates);
}
exports.merge = merge;
function mergeInto(existing, key, updates) {
    return __assign({}, existing, (_a = {}, _a[key] = merge(existing[key], updates), _a));
    var _a;
}
exports.mergeInto = mergeInto;
