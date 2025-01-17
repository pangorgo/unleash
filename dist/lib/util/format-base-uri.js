"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBaseUri = void 0;
const formatBaseUri = (input) => {
    if (!input)
        return '';
    const firstChar = input[0];
    const lastChar = input[input.length - 1];
    if (firstChar === '/' && lastChar === '/') {
        return input.substring(0, input.length - 1);
    }
    if (firstChar !== '/' && lastChar === '/') {
        return `/${input.substring(0, input.length - 1)}`;
    }
    if (firstChar !== '/') {
        return `/${input}`;
    }
    return input;
};
exports.formatBaseUri = formatBaseUri;
//# sourceMappingURL=format-base-uri.js.map