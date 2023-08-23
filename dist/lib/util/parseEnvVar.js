"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEnvVarStrings = exports.parseEnvVarBoolean = exports.parseEnvVarNumber = void 0;
function parseEnvVarNumber(envVar, defaultVal) {
    if (!envVar) {
        return defaultVal;
    }
    const parsed = Number.parseInt(envVar, 10);
    if (Number.isNaN(parsed)) {
        return defaultVal;
    }
    return parsed;
}
exports.parseEnvVarNumber = parseEnvVarNumber;
function parseEnvVarBoolean(envVar, defaultVal) {
    if (envVar) {
        return envVar === 'true' || envVar === '1' || envVar === 't';
    }
    return defaultVal;
}
exports.parseEnvVarBoolean = parseEnvVarBoolean;
function parseEnvVarStrings(envVar, defaultVal) {
    if (typeof envVar === 'string') {
        return envVar
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    }
    return defaultVal;
}
exports.parseEnvVarStrings = parseEnvVarStrings;
//# sourceMappingURL=parseEnvVar.js.map