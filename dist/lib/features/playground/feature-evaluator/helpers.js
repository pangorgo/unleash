"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectDefaultStrategy = exports.getDefaultStrategy = exports.safeName = exports.resolveContextValue = exports.createFallbackFunction = void 0;
function createFallbackFunction(name, context, fallback) {
    const createEvalResult = (enabled) => ({
        result: enabled,
        strategies: [],
    });
    if (typeof fallback === 'function') {
        return () => createEvalResult(fallback(name, context));
    }
    if (typeof fallback === 'boolean') {
        return () => createEvalResult(fallback);
    }
    return () => createEvalResult(false);
}
exports.createFallbackFunction = createFallbackFunction;
function resolveContextValue(context, field) {
    if (context[field]) {
        return context[field];
    }
    if (context.properties && context.properties[field]) {
        return context.properties[field];
    }
    return undefined;
}
exports.resolveContextValue = resolveContextValue;
function safeName(str = '') {
    return str.replace(/\//g, '_');
}
exports.safeName = safeName;
function getDefaultStrategy(featureName) {
    return {
        name: 'flexibleRollout',
        constraints: [],
        disabled: false,
        parameters: {
            rollout: '100',
            stickiness: 'default',
            groupId: featureName,
        },
    };
}
exports.getDefaultStrategy = getDefaultStrategy;
function resolveGroupId(defaultStrategy, featureName) {
    const groupId = defaultStrategy?.parameters?.groupId !== ''
        ? defaultStrategy.parameters?.groupId
        : featureName;
    return groupId || '';
}
function getProjectDefaultStrategy(defaultStrategy, featureName) {
    return {
        ...defaultStrategy,
        parameters: {
            ...defaultStrategy.parameters,
            groupId: resolveGroupId(defaultStrategy, featureName),
        },
    };
}
exports.getProjectDefaultStrategy = getProjectDefaultStrategy;
//# sourceMappingURL=helpers.js.map