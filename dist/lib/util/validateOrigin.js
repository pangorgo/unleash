"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOrigins = exports.validateOrigin = void 0;
const validateOrigin = (origin) => {
    if (origin === '*') {
        return true;
    }
    if (origin?.includes('*')) {
        return false;
    }
    try {
        const parsed = new URL(origin);
        return parsed.origin && parsed.origin === origin;
    }
    catch {
        return false;
    }
};
exports.validateOrigin = validateOrigin;
const validateOrigins = (origins) => {
    for (const origin of origins) {
        if (!(0, exports.validateOrigin)(origin)) {
            return `Invalid origin: ${origin}`;
        }
    }
};
exports.validateOrigins = validateOrigins;
//# sourceMappingURL=validateOrigin.js.map