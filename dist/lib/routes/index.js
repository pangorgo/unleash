"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const backstage_1 = require("./backstage");
const reset_password_controller_1 = __importDefault(require("./auth/reset-password-controller"));
const simple_password_provider_1 = require("./auth/simple-password-provider");
const logout_1 = __importDefault(require("./logout"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const AdminApi = require('./admin-api');
const ClientApi = require('./client-api');
const Controller = require('./controller');
const health_check_1 = require("./health-check");
const proxy_api_1 = __importDefault(require("./proxy-api"));
const edge_api_1 = __importDefault(require("./edge-api"));
const public_invite_1 = require("./public-invite");
const date_fns_1 = require("date-fns");
class IndexRouter extends Controller {
    constructor(config, services, db) {
        super(config);
        this.use('/health', new health_check_1.HealthCheckController(config, services).router);
        this.use('/invite', new public_invite_1.PublicInviteController(config, services).router);
        this.use('/internal-backstage', new backstage_1.BackstageController(config).router);
        this.use('/logout', new logout_1.default(config, services).router);
        this.useWithMiddleware('/auth/simple', new simple_password_provider_1.SimplePasswordProvider(config, services).router, (0, express_rate_limit_1.default)({
            windowMs: (0, date_fns_1.minutesToMilliseconds)(1),
            max: 10,
            validate: false,
            standardHeaders: true,
            legacyHeaders: false,
        }));
        this.use('/auth/reset', new reset_password_controller_1.default(config, services).router);
        this.use('/api/admin', new AdminApi(config, services, db).router);
        this.use('/api/client', new ClientApi(config, services).router);
        this.use('/api/frontend', new proxy_api_1.default(config, services, config.flagResolver).router);
        this.use('/edge', new edge_api_1.default(config, services).router);
    }
}
exports.default = IndexRouter;
module.exports = IndexRouter;
//# sourceMappingURL=index.js.map