"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../controller"));
const permissions_1 = require("../../types/permissions");
const create_request_schema_1 = require("../../openapi/util/create-request-schema");
const create_response_schema_1 = require("../../openapi/util/create-response-schema");
const standard_responses_1 = require("../../openapi/util/standard-responses");
class MetricsController extends controller_1.default {
    constructor(config, { clientInstanceService, openApiService, }) {
        super(config);
        this.logger = config.getLogger('/admin-api/metrics.ts');
        this.clientInstanceService = clientInstanceService;
        // deprecated routes
        this.get('/seen-toggles', this.deprecated);
        this.get('/seen-apps', this.deprecated);
        this.get('/feature-toggles', this.deprecated);
        this.get('/feature-toggles/:name', this.deprecated);
        this.route({
            method: 'post',
            path: '/applications/:appName',
            handler: this.createApplication,
            permission: permissions_1.UPDATE_APPLICATION,
            middleware: [
                openApiService.validPath({
                    tags: ['Metrics'],
                    operationId: 'createApplication',
                    summary: 'Create an application to connect reported metrics',
                    description: 'Is used to report usage as well which sdk the application uses',
                    responses: {
                        202: standard_responses_1.emptyResponse,
                        ...(0, standard_responses_1.getStandardResponses)(400, 401, 403),
                    },
                    requestBody: (0, create_request_schema_1.createRequestSchema)('createApplicationSchema'),
                }),
            ],
        });
        this.route({
            method: 'delete',
            path: '/applications/:appName',
            handler: this.deleteApplication,
            permission: permissions_1.UPDATE_APPLICATION,
            acceptAnyContentType: true,
            middleware: [
                openApiService.validPath({
                    tags: ['Metrics'],
                    operationId: 'deleteApplication',
                    summary: 'Delete an application',
                    description: `Delete the application specified in the request URL. Returns 200 OK if the application was successfully deleted or if it didn't exist`,
                    responses: {
                        200: standard_responses_1.emptyResponse,
                        ...(0, standard_responses_1.getStandardResponses)(401, 403),
                    },
                }),
            ],
        });
        this.route({
            method: 'get',
            path: '/applications',
            handler: this.getApplications,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    tags: ['Metrics'],
                    summary: 'Get all applications',
                    description: 'Returns all applications registered with Unleash. Applications can be created via metrics reporting or manual creation',
                    operationId: 'getApplications',
                    responses: {
                        200: (0, create_response_schema_1.createResponseSchema)('applicationsSchema'),
                    },
                }),
            ],
        });
        this.route({
            method: 'get',
            path: '/applications/:appName',
            handler: this.getApplication,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    tags: ['Metrics'],
                    operationId: 'getApplication',
                    summary: 'Get application data',
                    description: 'Returns data about the specified application (`appName`). The data contains information on the name of the application, sdkVersion (which sdk reported these metrics, typically `unleash-client-node:3.4.1` or `unleash-client-java:7.1.0`), as well as data about how to display this application in a list.',
                    responses: {
                        200: (0, create_response_schema_1.createResponseSchema)('applicationSchema'),
                        ...(0, standard_responses_1.getStandardResponses)(404),
                    },
                }),
            ],
        });
    }
    async deprecated(req, res) {
        res.status(410).json({
            lastHour: {},
            lastMinute: {},
            maturity: 'deprecated',
        });
    }
    async deleteApplication(req, res) {
        const { appName } = req.params;
        await this.clientInstanceService.deleteApplication(appName);
        res.status(200).end();
    }
    async createApplication(req, res) {
        const input = {
            ...req.body,
            appName: req.params.appName,
        };
        await this.clientInstanceService.createApplication(input);
        res.status(202).end();
    }
    async getApplications(req, res) {
        const query = req.query.strategyName
            ? { strategyName: req.query.strategyName }
            : {};
        const applications = await this.clientInstanceService.getApplications(query);
        res.json({ applications });
    }
    async getApplication(req, res) {
        const { appName } = req.params;
        const appDetails = await this.clientInstanceService.getApplication(appName);
        res.json(appDetails);
    }
}
exports.default = MetricsController;
//# sourceMappingURL=metrics.js.map