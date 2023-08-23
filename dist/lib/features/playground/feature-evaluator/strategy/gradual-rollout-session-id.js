"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strategy_1 = require("./strategy");
const util_1 = __importDefault(require("./util"));
class GradualRolloutSessionIdStrategy extends strategy_1.Strategy {
    constructor() {
        super('gradualRolloutSessionId');
    }
    isEnabled(parameters, context) {
        const { sessionId } = context;
        if (!sessionId) {
            return false;
        }
        const percentage = Number(parameters.percentage);
        const groupId = parameters.groupId || '';
        const normalizedId = (0, util_1.default)(sessionId, groupId);
        return percentage > 0 && normalizedId <= percentage;
    }
}
exports.default = GradualRolloutSessionIdStrategy;
//# sourceMappingURL=gradual-rollout-session-id.js.map