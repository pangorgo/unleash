"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
const strategySchema = require('./strategy-schema');
const NameExistsError = require('../error/name-exists-error');
const { STRATEGY_CREATED, STRATEGY_DELETED, STRATEGY_DEPRECATED, STRATEGY_REACTIVATED, STRATEGY_UPDATED, } = require('../types/events');
class StrategyService {
    constructor({ strategyStore, eventStore, }, { getLogger }) {
        this.strategyStore = strategyStore;
        this.eventStore = eventStore;
        this.logger = getLogger('services/strategy-service.js');
    }
    async getStrategies() {
        return this.strategyStore.getAll();
    }
    async getStrategy(name) {
        return this.strategyStore.get(name);
    }
    async removeStrategy(strategyName, userName) {
        const strategy = await this.strategyStore.get(strategyName);
        await this._validateEditable(strategy);
        await this.strategyStore.delete(strategyName);
        await this.eventStore.store({
            type: STRATEGY_DELETED,
            createdBy: userName,
            data: {
                name: strategyName,
            },
        });
    }
    async deprecateStrategy(strategyName, userName) {
        if (await this.strategyStore.exists(strategyName)) {
            // Check existence
            await this.strategyStore.deprecateStrategy({ name: strategyName });
            await this.eventStore.store({
                type: STRATEGY_DEPRECATED,
                createdBy: userName,
                data: {
                    name: strategyName,
                },
            });
        }
        else {
            throw new notfound_error_1.default(`Could not find strategy with name ${strategyName}`);
        }
    }
    async reactivateStrategy(strategyName, userName) {
        await this.strategyStore.get(strategyName); // Check existence
        await this.strategyStore.reactivateStrategy({ name: strategyName });
        await this.eventStore.store({
            type: STRATEGY_REACTIVATED,
            createdBy: userName,
            data: {
                name: strategyName,
            },
        });
    }
    async createStrategy(value, userName) {
        const strategy = await strategySchema.validateAsync(value);
        strategy.deprecated = false;
        await this._validateStrategyName(strategy);
        await this.strategyStore.createStrategy(strategy);
        await this.eventStore.store({
            type: STRATEGY_CREATED,
            createdBy: userName,
            data: strategy,
        });
        return this.strategyStore.get(strategy.name);
    }
    async updateStrategy(input, userName) {
        const value = await strategySchema.validateAsync(input);
        const strategy = await this.strategyStore.get(input.name);
        await this._validateEditable(strategy);
        await this.strategyStore.updateStrategy(value);
        await this.eventStore.store({
            type: STRATEGY_UPDATED,
            createdBy: userName,
            data: value,
        });
    }
    _validateStrategyName(data) {
        return new Promise((resolve, reject) => {
            this.strategyStore
                .get(data.name)
                .then(() => reject(new NameExistsError(`Strategy with name ${data.name} already exist!`)))
                .catch(() => resolve(data));
        });
    }
    // This check belongs in the store.
    _validateEditable(strategy) {
        if (strategy.editable === false) {
            throw new Error(`Cannot edit strategy ${strategy.name}`);
        }
    }
}
exports.default = StrategyService;
module.exports = StrategyService;
//# sourceMappingURL=strategy-service.js.map