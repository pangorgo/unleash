"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const option_1 = require("../../types/option");
const version_1 = __importDefault(require("../../util/version"));
const controller_1 = __importDefault(require("../controller"));
const simple_auth_settings_1 = require("../../types/settings/simple-auth-settings");
const permissions_1 = require("../../types/permissions");
const create_response_schema_1 = require("../../openapi/util/create-response-schema");
const ui_config_schema_1 = require("../../openapi/spec/ui-config-schema");
const standard_responses_1 = require("../../openapi/util/standard-responses");
const extract_user_1 = require("../../util/extract-user");
const notfound_error_1 = __importDefault(require("../../error/notfound-error"));
const create_request_schema_1 = require("../../openapi/util/create-request-schema");
class ConfigController extends controller_1.default {
    constructor(config, { versionService, settingService, emailService, openApiService, proxyService, maintenanceService, }) {
        super(config);
        this.versionService = versionService;
        this.settingService = settingService;
        this.emailService = emailService;
        this.openApiService = openApiService;
        this.proxyService = proxyService;
        this.maintenanceService = maintenanceService;
        this.route({
            method: 'get',
            path: '',
            handler: this.getUiConfig,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    tags: ['Admin UI'],
                    summary: 'Get UI configuration',
                    description: 'Retrieves the full configuration used to set up the Unleash Admin UI.',
                    operationId: 'getUiConfig',
                    responses: {
                        200: (0, create_response_schema_1.createResponseSchema)('uiConfigSchema'),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: '',
            handler: this.setUiConfig,
            permission: permissions_1.ADMIN,
            middleware: [
                openApiService.validPath({
                    tags: ['Admin UI'],
                    summary: 'Set UI configuration',
                    description: 'Sets the UI configuration for this Unleash instance.',
                    operationId: 'setUiConfig',
                    requestBody: (0, create_request_schema_1.createRequestSchema)('setUiConfigSchema'),
                    responses: { 200: standard_responses_1.emptyResponse },
                }),
            ],
        });
    }
    async getUiConfig(req, res) {
        const [frontendSettings, simpleAuthSettings, maintenanceMode] = await Promise.all([
            this.proxyService.getFrontendSettings(false),
            this.settingService.get(simple_auth_settings_1.simpleAuthSettingsKey),
            this.maintenanceService.isMaintenanceMode(),
        ]);
        const disablePasswordAuth = simpleAuthSettings?.disabled ||
            this.config.authentication.type == option_1.IAuthType.NONE;
        const expFlags = this.config.flagResolver.getAll({
            email: req.user.email,
        });
        const flags = { ...this.config.ui.flags, ...expFlags };
        const response = {
            ...this.config.ui,
            flags,
            version: version_1.default,
            emailEnabled: this.emailService.isEnabled(),
            unleashUrl: this.config.server.unleashUrl,
            baseUriPath: this.config.server.baseUriPath,
            authenticationType: this.config.authentication?.type,
            segmentValuesLimit: this.config.segmentValuesLimit,
            strategySegmentsLimit: this.config.strategySegmentsLimit,
            frontendApiOrigins: frontendSettings.frontendApiOrigins,
            versionInfo: this.versionService.getVersionInfo(),
            networkViewEnabled: this.config.prometheusApi !== undefined,
            disablePasswordAuth,
            maintenanceMode,
        };
        this.openApiService.respondWithValidation(200, res, ui_config_schema_1.uiConfigSchema.$id, response);
    }
    async setUiConfig(req, res) {
        if (req.body.frontendSettings) {
            await this.proxyService.setFrontendSettings(req.body.frontendSettings, (0, extract_user_1.extractUsername)(req));
            res.sendStatus(204);
            return;
        }
        throw new notfound_error_1.default();
    }
}
exports.default = ConfigController;
//# sourceMappingURL=config.js.map