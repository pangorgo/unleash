"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateObjectCombinations = exports.generateCombinations = exports.splitByComma = void 0;
const splitByComma = (obj) => Object.fromEntries(Object.entries(obj).map(([key, value]) => [
    key,
    typeof value === 'string' ? value.split(',') : [value],
]));
exports.splitByComma = splitByComma;
const generateCombinations = (obj) => {
    const keys = Object.keys(obj);
    return keys.reduce((results, key) => results.flatMap((result) => obj[key].map((value) => ({ ...result, [key]: value }))), [{}]);
};
exports.generateCombinations = generateCombinations;
const generateObjectCombinations = (obj) => {
    const splitObj = (0, exports.splitByComma)(obj);
    return (0, exports.generateCombinations)(splitObj);
};
exports.generateObjectCombinations = generateObjectCombinations;
//# sourceMappingURL=generateObjectCombinations.js.map