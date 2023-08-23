"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strategy_1 = require("./strategy");
const util_1 = __importDefault(require("./util"));
class GradualRolloutUserIdStrategy extends strategy_1.Strategy {
    constructor() {
        super('gradualRolloutUserId');
    }
    isEnabled(parameters, context) {
        const { userId } = context;
        if (!userId) {
            return false;
        }
        const percentage = Number(parameters.percentage);
        const groupId = parameters.groupId || '';
        const normalizedUserId = (0, util_1.default)(userId, groupId);
        return percentage > 0 && normalizedUserId <= percentage;
    }
}
exports.default = GradualRolloutUserIdStrategy;
//# sourceMappingURL=gradual-rollout-user-id.js.map