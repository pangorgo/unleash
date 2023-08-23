"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
class FeatureTypeService {
    constructor({ featureTypeStore }, { getLogger }) {
        this.featureTypeStore = featureTypeStore;
        this.logger = getLogger('services/feature-type-service.ts');
    }
    async getAll() {
        return this.featureTypeStore.getAll();
    }
    async updateLifetime(id, newLifetimeDays) {
        // because our OpenAPI library does type coercion, any `null` values you
        // pass in get converted to `0`.
        const translatedLifetime = newLifetimeDays === 0 ? null : newLifetimeDays;
        const result = await this.featureTypeStore.updateLifetime(id, translatedLifetime);
        if (!result) {
            throw new notfound_error_1.default(`The feature type you tried to update ("${id}") does not exist.`);
        }
        return result;
    }
}
exports.default = FeatureTypeService;
module.exports = FeatureTypeService;
//# sourceMappingURL=feature-type-service.js.map