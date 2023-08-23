"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../controller"));
const permissions_1 = require("../../types/permissions");
const create_response_schema_1 = require("../../openapi/util/create-response-schema");
const create_request_schema_1 = require("../../openapi/util/create-request-schema");
const validated_edge_tokens_schema_1 = require("../../openapi/spec/validated-edge-tokens-schema");
const standard_responses_1 = require("../../openapi/util/standard-responses");
const schema_1 = require("../../services/client-metrics/schema");
class EdgeController extends controller_1.default {
    constructor(config, { edgeService, openApiService, clientMetricsServiceV2, clientInstanceService, }) {
        super(config);
        this.logger = config.getLogger('edge-api/index.ts');
        this.edgeService = edgeService;
        this.openApiService = openApiService;
        this.metricsV2 = clientMetricsServiceV2;
        this.clientInstanceService = clientInstanceService;
        this.route({
            method: 'post',
            path: '/validate',
            handler: this.getValidTokens,
            permission: permissions_1.NONE,
            middleware: [
                this.openApiService.validPath({
                    tags: ['Edge'],
                    summary: 'Check which tokens are valid',
                    description: 'This operation accepts a list of tokens to validate. Unleash will validate each token you provide. For each valid token you provide, Unleash will return the token along with its type and which projects it has access to.',
                    operationId: 'getValidTokens',
                    requestBody: (0, create_request_schema_1.createRequestSchema)('tokenStringListSchema'),
                    responses: {
                        200: (0, create_response_schema_1.createResponseSchema)('validatedEdgeTokensSchema'),
                        ...(0, standard_responses_1.getStandardResponses)(400, 413, 415),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: '/metrics',
            handler: this.bulkMetrics,
            permission: permissions_1.NONE,
            middleware: [
                this.openApiService.validPath({
                    tags: ['Edge'],
                    summary: 'Send metrics from Edge',
                    description: `This operation accepts batched metrics from Edge. Metrics will be inserted into Unleash's metrics storage`,
                    operationId: 'bulkMetrics',
                    requestBody: (0, create_request_schema_1.createRequestSchema)('bulkMetricsSchema'),
                    responses: {
                        202: standard_responses_1.emptyResponse,
                        ...(0, standard_responses_1.getStandardResponses)(400, 413, 415),
                    },
                }),
            ],
        });
    }
    async getValidTokens(req, res) {
        const tokens = await this.edgeService.getValidTokens(req.body.tokens);
        this.openApiService.respondWithValidation(200, res, validated_edge_tokens_schema_1.validatedEdgeTokensSchema.$id, tokens);
    }
    async bulkMetrics(req, res) {
        const { body, ip: clientIp } = req;
        const { metrics, applications } = body;
        try {
            let promises = [];
            for (const app of applications) {
                promises.push(this.clientInstanceService.registerClient(app, clientIp));
            }
            if (metrics && metrics.length > 0) {
                const data = await schema_1.clientMetricsEnvBulkSchema.validateAsync(metrics);
                promises.push(this.metricsV2.registerBulkMetrics(data));
            }
            await Promise.all(promises);
            res.status(202).end();
        }
        catch (e) {
            res.status(400).end();
        }
    }
}
exports.default = EdgeController;
//# sourceMappingURL=index.js.map