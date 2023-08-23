"use strict";
// Copy of https://github.com/Unleash/unleash-proxy/blob/main/src/create-context.ts.
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrichContextWithIp = exports.createContext = void 0;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function createContext(value) {
    const { appName, environment, userId, sessionId, remoteAddress, properties, ...rest } = value;
    // move non root context fields to properties
    const context = {
        appName,
        environment,
        userId,
        sessionId,
        remoteAddress,
        properties: Object.assign({}, rest, properties),
    };
    // Clean undefined properties on the context
    const cleanContext = Object.keys(context)
        .filter((k) => context[k])
        .reduce((a, k) => ({ ...a, [k]: context[k] }), {});
    return cleanContext;
}
exports.createContext = createContext;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const enrichContextWithIp = (query, ip) => {
    query.remoteAddress = query.remoteAddress || ip;
    return createContext(query);
};
exports.enrichContextWithIp = enrichContextWithIp;
//# sourceMappingURL=create-context.js.map