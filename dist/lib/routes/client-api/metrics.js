"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../controller"));
const permissions_1 = require("../../types/permissions");
const create_request_schema_1 = require("../../openapi/util/create-request-schema");
const standard_responses_1 = require("../../openapi/util/standard-responses");
class ClientMetricsController extends controller_1.default {
    constructor({ clientInstanceService, clientMetricsServiceV2, openApiService, }, config) {
        super(config);
        const { getLogger } = config;
        this.logger = getLogger('/api/client/metrics');
        this.clientInstanceService = clientInstanceService;
        this.openApiService = openApiService;
        this.metricsV2 = clientMetricsServiceV2;
        this.route({
            method: 'post',
            path: '',
            handler: this.registerMetrics,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    tags: ['Client'],
                    summary: 'Register client usage metrics',
                    description: `Registers usage metrics. Stores information about how many times each toggle was evaluated to enabled and disabled within a time frame. If provided, this operation will also store data on how many times each feature toggle's variants were displayed to the end user.`,
                    operationId: 'registerClientMetrics',
                    requestBody: (0, create_request_schema_1.createRequestSchema)('clientMetricsSchema'),
                    responses: {
                        ...(0, standard_responses_1.getStandardResponses)(400),
                        202: standard_responses_1.emptyResponse,
                    },
                }),
            ],
        });
    }
    async registerMetrics(req, res) {
        try {
            const { body: data, ip: clientIp, user } = req;
            data.environment = this.metricsV2.resolveMetricsEnvironment(user, data);
            await this.clientInstanceService.registerInstance(data, clientIp);
            await this.metricsV2.registerClientMetrics(data, clientIp);
            res.status(202).end();
        }
        catch (e) {
            res.status(400).end();
        }
    }
}
exports.default = ClientMetricsController;
//# sourceMappingURL=metrics.js.map