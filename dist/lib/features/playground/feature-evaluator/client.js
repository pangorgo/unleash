"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const variant_1 = require("./variant");
const playground_strategy_schema_1 = require("../../../openapi/spec/playground-strategy-schema");
class UnleashClient {
    constructor(repository, strategies) {
        this.repository = repository;
        this.strategies = strategies || [];
        this.strategies.forEach((strategy) => {
            if (!strategy ||
                !strategy.name ||
                typeof strategy.name !== 'string' ||
                !strategy.isEnabled ||
                typeof strategy.isEnabled !== 'function') {
                throw new Error('Invalid strategy data / interface');
            }
        });
    }
    getStrategy(name) {
        return this.strategies.find((strategy) => strategy.name === name);
    }
    isEnabled(name, context, fallback) {
        const feature = this.repository.getToggle(name);
        return this.isFeatureEnabled(feature, context, fallback);
    }
    isFeatureEnabled(feature, context, fallback) {
        if (!feature) {
            return fallback();
        }
        if (!Array.isArray(feature.strategies)) {
            return {
                result: false,
                strategies: [],
            };
        }
        if (feature.strategies.length === 0) {
            return {
                result: feature.enabled,
                strategies: [],
            };
        }
        const strategies = feature.strategies.map((strategySelector) => {
            const getStrategy = () => {
                // the application hostname strategy relies on external
                // variables to calculate its result. As such, we can't
                // evaluate it in a way that makes sense. So we'll
                // use the 'unknown' strategy instead.
                if (strategySelector.name === 'applicationHostname') {
                    return this.getStrategy('unknown');
                }
                return (this.getStrategy(strategySelector.name) ??
                    this.getStrategy('unknown'));
            };
            const strategy = getStrategy();
            const segments = strategySelector.segments
                ?.map(this.getSegment(this.repository))
                .filter(Boolean) ?? [];
            const evaluationResult = strategy.isEnabledWithConstraints(strategySelector.parameters, context, strategySelector.constraints, segments, strategySelector.disabled, strategySelector.variants);
            return {
                name: strategySelector.name,
                id: strategySelector.id,
                title: strategySelector.title,
                disabled: strategySelector.disabled || false,
                parameters: strategySelector.parameters,
                ...evaluationResult,
            };
        });
        // Feature evaluation
        const overallStrategyResult = () => {
            // if at least one strategy is enabled, then the feature is enabled
            const enabledStrategy = strategies.find((strategy) => strategy.result.enabled === true);
            if (enabledStrategy &&
                enabledStrategy.result.evaluationStatus === 'complete') {
                return [
                    true,
                    enabledStrategy.result.variants,
                    enabledStrategy.result.variant,
                ];
            }
            // if at least one strategy is unknown, then the feature _may_ be enabled
            if (strategies.some((strategy) => strategy.result.enabled === 'unknown')) {
                return [
                    playground_strategy_schema_1.playgroundStrategyEvaluation.unknownResult,
                    undefined,
                    undefined,
                ];
            }
            return [false, undefined, undefined];
        };
        const [result, variants, variant] = overallStrategyResult();
        const evalResults = {
            result,
            variant,
            variants,
            strategies,
        };
        return evalResults;
    }
    getSegment(repo) {
        return (segmentId) => {
            const segment = repo.getSegment(segmentId);
            if (!segment) {
                return undefined;
            }
            return {
                name: segment.name,
                id: segmentId,
                constraints: segment.constraints,
            };
        };
    }
    getVariant(name, context, fallbackVariant) {
        return this.resolveVariant(name, context, fallbackVariant);
    }
    // This function is intended to close an issue in the proxy where feature enabled
    // state gets checked twice when resolving a variant with random stickiness and
    // gradual rollout. This is not intended for general use, prefer getVariant instead
    forceGetVariant(name, context, forcedResult, fallbackVariant) {
        return this.resolveVariant(name, context, fallbackVariant, forcedResult);
    }
    resolveVariant(name, context, fallbackVariant, forcedResult) {
        const fallback = fallbackVariant || (0, variant_1.getDefaultVariant)();
        const feature = this.repository.getToggle(name);
        if (typeof feature === 'undefined') {
            return fallback;
        }
        let enabled = true;
        const result = forcedResult ??
            this.isFeatureEnabled(feature, context, () => fallbackVariant ? fallbackVariant.enabled : false);
        enabled = result.result === true;
        const strategyVariant = result.variant;
        if (enabled && strategyVariant) {
            return strategyVariant;
        }
        if (!enabled) {
            return fallback;
        }
        if (!feature.variants ||
            !Array.isArray(feature.variants) ||
            feature.variants.length === 0 ||
            !feature.enabled) {
            return fallback;
        }
        const variant = (0, variant_1.selectVariant)(feature, context);
        if (variant === null) {
            return fallback;
        }
        return {
            name: variant.name,
            payload: variant.payload,
            enabled,
        };
    }
}
exports.default = UnleashClient;
//# sourceMappingURL=client.js.map