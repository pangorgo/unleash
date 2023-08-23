"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseTimeMetrics = void 0;
const responseTime = __importStar(require("response-time"));
const metric_events_1 = require("../metric-events");
// eslint-disable-next-line @typescript-eslint/naming-convention
const _responseTime = responseTime.default;
const appNameReportingThreshold = 1000;
function responseTimeMetrics(eventBus, flagResolver, instanceStatsService) {
    return _responseTime((req, res, time) => {
        const { statusCode } = res;
        const pathname = req.route ? req.baseUrl + req.route.path : '(hidden)';
        let appName;
        if (!flagResolver.isEnabled('responseTimeWithAppNameKillSwitch') &&
            (instanceStatsService.getAppCountSnapshot('7d') ??
                appNameReportingThreshold) < appNameReportingThreshold) {
            appName = req.headers['unleash-appname'] ?? req.query.appName;
        }
        const timingInfo = {
            path: pathname,
            method: req.method,
            statusCode,
            time,
            appName,
        };
        eventBus.emit(metric_events_1.REQUEST_TIME, timingInfo);
    });
}
exports.responseTimeMetrics = responseTimeMetrics;
//# sourceMappingURL=response-time-metrics.js.map