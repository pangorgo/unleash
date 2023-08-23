"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAverageTimeToProd = void 0;
const date_fns_1 = require("date-fns");
const calculateTimeToProdForFeatures = (items) => items.map((item) => (0, date_fns_1.differenceInDays)(item.enabled, item.created));
const calculateAverageTimeToProd = (items) => {
    const timeToProdPerFeature = calculateTimeToProdForFeatures(items);
    if (timeToProdPerFeature.length) {
        const sum = timeToProdPerFeature.reduce((acc, curr) => acc + curr, 0);
        return Number((sum / Object.keys(items).length).toFixed(1));
    }
    return 0;
};
exports.calculateAverageTimeToProd = calculateAverageTimeToProd;
//# sourceMappingURL=time-to-production.js.map