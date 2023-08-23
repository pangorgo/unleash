"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offlineUnleashClient = exports.mapSegmentsForClient = exports.mapFeaturesForClient = void 0;
const feature_evaluator_1 = require("./feature-evaluator");
const serialize_dates_1 = require("../../types/serialize-dates");
const mapFeaturesForClient = (features) => features.map((feature) => ({
    impressionData: false,
    ...feature,
    variants: (feature.variants || []).map((variant) => ({
        overrides: [],
        ...variant,
        payload: variant.payload && {
            ...variant.payload,
            type: variant.payload.type,
        },
    })),
    project: feature.project,
    strategies: feature.strategies.map((strategy) => ({
        parameters: {},
        ...strategy,
        variants: (strategy.variants || []).map((variant) => ({
            ...variant,
            payload: variant.payload && {
                ...variant.payload,
                type: variant.payload.type,
            },
        })),
        constraints: strategy.constraints &&
            strategy.constraints.map((constraint) => ({
                inverted: false,
                values: [],
                ...constraint,
                operator: constraint.operator,
            })),
    })),
}));
exports.mapFeaturesForClient = mapFeaturesForClient;
const mapSegmentsForClient = (segments) => (0, serialize_dates_1.serializeDates)(segments);
exports.mapSegmentsForClient = mapSegmentsForClient;
const offlineUnleashClient = async ({ features, context, segments, }) => {
    const client = new feature_evaluator_1.FeatureEvaluator({
        ...context,
        appName: context.appName,
        storageProvider: new feature_evaluator_1.InMemStorageProvider(),
        bootstrap: {
            data: (0, exports.mapFeaturesForClient)(features),
            segments: (0, exports.mapSegmentsForClient)(segments),
        },
    });
    await client.start();
    return client;
};
exports.offlineUnleashClient = offlineUnleashClient;
//# sourceMappingURL=offline-unleash-client.js.map