"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-param-reassign */
const timer_1 = __importDefault(require("./timer"));
// wrapTimer keeps track of the timing of a async operation and emits
// a event on the given eventBus once the operation is complete
//
// the returned function is designed to be used as a .then(<func>) argument.
// It transparently passes the data to the following .then(<func>)
//
// usage: promise.then(wrapTimer(bus, type, { payload: 'ok' }))
const wrapTimer = (eventBus, event, args = {}) => {
    const t = timer_1.default.new();
    return (data) => {
        args.time = t();
        eventBus.emit(event, args);
        return data;
    };
};
const metricsHelper = {
    wrapTimer,
};
exports.default = metricsHelper;
module.exports = {
    wrapTimer,
};
//# sourceMappingURL=metrics-helper.js.map