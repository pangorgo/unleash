"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anonymiseKeys = exports.anonymise = void 0;
const crypto_1 = require("crypto");
function anonymise(s) {
    if (!s) {
        return '';
    }
    const hash = (0, crypto_1.createHash)('sha256')
        .update(s, 'utf-8')
        .digest('hex')
        .slice(0, 9);
    return `${hash}@unleash.run`;
}
exports.anonymise = anonymise;
function anonymiseKeys(object, keys) {
    if (typeof object !== 'object' || object === null) {
        return object;
    }
    if (Array.isArray(object)) {
        return object.map((item) => anonymiseKeys(item, keys));
    }
    else {
        return Object.keys(object).reduce((result, key) => {
            if (keys.includes(key) &&
                result[key] !== undefined &&
                result[key] !== null) {
                result[key] = anonymise(result[key]);
            }
            else if (typeof result[key] === 'object') {
                result[key] = anonymiseKeys(result[key], keys);
            }
            return result;
        }, object);
    }
}
exports.anonymiseKeys = anonymiseKeys;
//# sourceMappingURL=anonymise.js.map