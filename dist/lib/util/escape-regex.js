"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeRegExp = void 0;
function safeRegExp(pattern, flags) {
    return new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
}
exports.safeRegExp = safeRegExp;
//# sourceMappingURL=escape-regex.js.map