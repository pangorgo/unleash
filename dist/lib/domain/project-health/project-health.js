"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHealthRating = exports.calculateProjectHealth = void 0;
const date_fns_1 = require("date-fns");
const getPotentiallyStaleCount = (features, featureTypes) => {
    const today = new Date().valueOf();
    return features.filter((feature) => {
        const diff = today - feature.createdAt?.valueOf();
        const featureTypeExpectedLifetime = featureTypes.find((t) => t.id === feature.type)?.lifetimeDays;
        return (!feature.stale &&
            featureTypeExpectedLifetime !== null &&
            diff >= featureTypeExpectedLifetime * (0, date_fns_1.hoursToMilliseconds)(24));
    }).length;
};
const calculateProjectHealth = (features, featureTypes) => ({
    potentiallyStaleCount: getPotentiallyStaleCount(features, featureTypes),
    activeCount: features.filter((f) => !f.stale).length,
    staleCount: features.filter((f) => f.stale).length,
});
exports.calculateProjectHealth = calculateProjectHealth;
const calculateHealthRating = (features, featureTypes) => {
    const { potentiallyStaleCount, activeCount, staleCount } = (0, exports.calculateProjectHealth)(features, featureTypes);
    const toggleCount = activeCount + staleCount;
    const startPercentage = 100;
    const stalePercentage = (staleCount / toggleCount) * 100 || 0;
    const potentiallyStalePercentage = (potentiallyStaleCount / toggleCount) * 100 || 0;
    const rating = Math.round(startPercentage - stalePercentage - potentiallyStalePercentage);
    return rating;
};
exports.calculateHealthRating = calculateHealthRating;
//# sourceMappingURL=project-health.js.map