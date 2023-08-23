"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureStringValue = void 0;
const isDefined_1 = require("./isDefined");
function ensureStringValue(value) {
    if (!(0, isDefined_1.isDefined)(value)) {
        return '';
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return String(value);
}
exports.ensureStringValue = ensureStringValue;
//# sourceMappingURL=ensureStringValue.js.map