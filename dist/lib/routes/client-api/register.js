"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../controller"));
const api_user_1 = __importDefault(require("../../types/api-user"));
const api_token_1 = require("../../types/models/api-token");
const permissions_1 = require("../../types/permissions");
const standard_responses_1 = require("../../openapi/util/standard-responses");
const create_request_schema_1 = require("../../openapi/util/create-request-schema");
class RegisterController extends controller_1.default {
    constructor({ clientInstanceService, openApiService, }, config) {
        super(config);
        this.logger = config.getLogger('/api/client/register');
        this.clientInstanceService = clientInstanceService;
        this.openApiService = openApiService;
        this.route({
            method: 'post',
            path: '',
            handler: this.registerClientApplication,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    tags: ['Client'],
                    summary: 'Register a client SDK',
                    description: 'Register a client SDK with Unleash. SDKs call this endpoint on startup to tell Unleash about their existence. Used to track custom strategies in use as well as SDK versions.',
                    operationId: 'registerClientApplication',
                    requestBody: (0, create_request_schema_1.createRequestSchema)('clientApplicationSchema'),
                    responses: { 202: standard_responses_1.emptyResponse },
                }),
            ],
        });
    }
    static resolveEnvironment(user, data) {
        if (user instanceof api_user_1.default) {
            if (user.environment !== api_token_1.ALL) {
                return user.environment;
            }
            else if (user.environment === api_token_1.ALL && data.environment) {
                return data.environment;
            }
        }
        return 'default';
    }
    async registerClientApplication(req, res) {
        const { body: data, ip: clientIp, user } = req;
        data.environment = RegisterController.resolveEnvironment(user, data);
        await this.clientInstanceService.registerClient(data, clientIp);
        res.status(202).end();
    }
}
exports.default = RegisterController;
//# sourceMappingURL=register.js.map