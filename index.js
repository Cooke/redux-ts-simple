"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
function defineAction(type) {
    return {
        type: type,
        create: function (arg) {
            if ((typeof arg !== 'object') && (arg !== undefined)) {
                throw "Only object types may be used as payloads for none standard actions";
            }
            return __assign({ type: type }, (arg || {}));
        }
    };
}
exports.defineAction = defineAction;
function defineStandardAction(type) {
    return {
        type: type,
        create: function (arg) { return ({ type: type, payload: arg }); }
    };
}
exports.defineStandardAction = defineStandardAction;
var ReducerBuilder = (function () {
    function ReducerBuilder(initState) {
        var _this = this;
        this.initState = initState;
        this.handlers = {};
        this.on = function (actionDefinition, handler) {
            // TODO check if already registered
            _this.handlers[actionDefinition.type] = handler;
            return _this;
        };
    }
    ReducerBuilder.prototype.build = function () {
        var _this = this;
        return function (state, action) {
            var handler = _this.handlers[action.type];
            var currentState = state || _this.initState;
            if (handler) {
                return handler(currentState, action);
            }
            else {
                return currentState;
            }
        };
    };
    return ReducerBuilder;
}());
exports.ReducerBuilder = ReducerBuilder;
function merge(existing, updates) {
    return __assign({}, existing, updates);
}
exports.merge = merge;
;
function mergeInto(existing, key, updates) {
    return __assign({}, existing, (_a = {}, _a[key] = merge(existing[key], updates), _a));
    var _a;
}
exports.mergeInto = mergeInto;
;
