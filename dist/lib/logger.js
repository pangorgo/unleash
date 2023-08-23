"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogProvider = exports.getDefaultLogProvider = exports.LogLevel = void 0;
const log4js_1 = require("log4js");
var LogLevel;
(function (LogLevel) {
    LogLevel["debug"] = "debug";
    LogLevel["info"] = "info";
    LogLevel["warn"] = "warn";
    LogLevel["error"] = "error";
    LogLevel["fatal"] = "fatal";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
function getDefaultLogProvider(logLevel = LogLevel.error) {
    (0, log4js_1.configure)({
        appenders: {
            console: { type: 'console' },
        },
        categories: {
            default: { appenders: ['console'], level: logLevel },
        },
    });
    return log4js_1.getLogger;
}
exports.getDefaultLogProvider = getDefaultLogProvider;
function validate(isValid, msg) {
    if (!isValid) {
        throw new TypeError(msg);
    }
}
function validateLogProvider(provider) {
    validate(typeof provider === 'function', 'Provider needs to be a function');
    const logger = provider('unleash:logger');
    validate(typeof logger.debug === 'function', 'Logger must implement debug');
    validate(typeof logger.info === 'function', 'Logger must implement info');
    validate(typeof logger.warn === 'function', 'Logger must implement warn');
    validate(typeof logger.error === 'function', 'Logger must implement error');
}
exports.validateLogProvider = validateLogProvider;
//# sourceMappingURL=logger.js.map