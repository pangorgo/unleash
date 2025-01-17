"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../controller"));
const feature_1 = __importDefault(require("./feature"));
const feature_type_1 = require("./feature-type");
const archive_1 = __importDefault(require("./archive"));
const strategy_1 = __importDefault(require("./strategy"));
const event_1 = __importDefault(require("./event"));
const playground_1 = __importDefault(require("../../features/playground/playground"));
const metrics_1 = __importDefault(require("./metrics"));
const user_1 = __importDefault(require("./user/user"));
const config_1 = __importDefault(require("./config"));
const context_1 = require("./context");
const client_metrics_1 = __importDefault(require("./client-metrics"));
const state_1 = __importDefault(require("./state"));
const tag_1 = __importDefault(require("./tag"));
const tag_type_1 = __importDefault(require("./tag-type"));
const addon_1 = __importDefault(require("./addon"));
const api_token_1 = require("./api-token");
const user_admin_1 = __importDefault(require("./user-admin"));
const email_1 = __importDefault(require("./email"));
const user_feedback_1 = __importDefault(require("./user-feedback"));
const user_splash_1 = __importDefault(require("./user-splash"));
const project_1 = __importDefault(require("./project"));
const environments_1 = require("./environments");
const constraints_1 = __importDefault(require("./constraints"));
const pat_1 = __importDefault(require("./user/pat"));
const public_signup_1 = require("./public-signup");
const instance_admin_1 = __importDefault(require("./instance-admin"));
const telemetry_1 = __importDefault(require("./telemetry"));
const favorites_1 = __importDefault(require("./favorites"));
const maintenance_1 = __importDefault(require("./maintenance"));
const transaction_1 = require("../../db/transaction");
const export_import_controller_1 = __importDefault(require("../../features/export-import-toggles/export-import-controller"));
class AdminApi extends controller_1.default {
    constructor(config, services, db) {
        super(config);
        this.app.use('/features', new feature_1.default(config, services).router);
        this.app.use('/feature-types', new feature_type_1.FeatureTypeController(config, services).router);
        this.app.use('/archive', new archive_1.default(config, services).router);
        this.app.use('/strategies', new strategy_1.default(config, services).router);
        this.app.use('/events', new event_1.default(config, services).router);
        this.app.use('/playground', new playground_1.default(config, services).router);
        this.app.use('/metrics', new metrics_1.default(config, services).router);
        this.app.use('/client-metrics', new client_metrics_1.default(config, services).router);
        this.app.use('/user', new user_1.default(config, services).router);
        this.app.use('/user/tokens', new pat_1.default(config, services).router);
        this.app.use('/ui-config', new config_1.default(config, services).router);
        this.app.use('/context', new context_1.ContextController(config, services).router);
        this.app.use('/state', new state_1.default(config, services).router);
        this.app.use('/features-batch', new export_import_controller_1.default(config, services, (0, transaction_1.createKnexTransactionStarter)(db)).router);
        this.app.use('/tags', new tag_1.default(config, services).router);
        this.app.use('/tag-types', new tag_type_1.default(config, services).router);
        this.app.use('/addons', new addon_1.default(config, services).router);
        this.app.use('/api-tokens', new api_token_1.ApiTokenController(config, services).router);
        this.app.use('/email', new email_1.default(config, services).router);
        this.app.use('/user-admin', new user_admin_1.default(config, services).router);
        this.app.use('/feedback', new user_feedback_1.default(config, services).router);
        this.app.use('/projects', new project_1.default(config, services, db).router);
        this.app.use('/environments', new environments_1.EnvironmentsController(config, services).router);
        this.app.use('/splash', new user_splash_1.default(config, services).router);
        this.app.use('/constraints', new constraints_1.default(config, services).router);
        this.app.use('/invite-link', new public_signup_1.PublicSignupController(config, services).router);
        this.app.use('/instance-admin', new instance_admin_1.default(config, services).router);
        this.app.use(`/projects`, new favorites_1.default(config, services).router);
        this.app.use('/maintenance', new maintenance_1.default(config, services).router);
        this.app.use('/telemetry', new telemetry_1.default(config, services).router);
    }
}
module.exports = AdminApi;
//# sourceMappingURL=index.js.map