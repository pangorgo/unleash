"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../controller"));
const feature_1 = __importDefault(require("./feature"));
const metrics_1 = __importDefault(require("./metrics"));
const register_1 = __importDefault(require("./register"));
class ClientApi extends controller_1.default {
    constructor(config, services) {
        super(config);
        this.use('/features', new feature_1.default(services, config).router);
        this.use('/metrics', new metrics_1.default(services, config).router);
        this.use('/register', new register_1.default(services, config).router);
    }
}
exports.default = ClientApi;
module.exports = ClientApi;
//# sourceMappingURL=index.js.map