"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../controller"));
const types_1 = require("../../types");
const openapi_1 = require("../../openapi");
const proxy_1 = require("../../proxy");
const middleware_1 = require("../../middleware");
const not_implemented_error_1 = __importDefault(require("../../error/not-implemented-error"));
const notfound_error_1 = __importDefault(require("../../error/notfound-error"));
class ProxyController extends controller_1.default {
    constructor(config, services, flagResolver) {
        super(config);
        this.logger = config.getLogger('proxy-api/index.ts');
        this.services = services;
        this.flagResolver = flagResolver;
        // Support CORS requests for the frontend endpoints.
        // Preflight requests are handled in `app.ts`.
        this.app.use((0, middleware_1.corsOriginMiddleware)(services, config));
        this.route({
            method: 'get',
            path: '',
            handler: this.getProxyFeatures,
            permission: types_1.NONE,
            middleware: [
                this.services.openApiService.validPath({
                    tags: ['Frontend API'],
                    operationId: 'getFrontendFeatures',
                    responses: {
                        200: (0, openapi_1.createResponseSchema)('proxyFeaturesSchema'),
                        ...(0, openapi_1.getStandardResponses)(401, 404),
                    },
                    summary: 'Retrieve enabled feature toggles for the provided context.',
                    description: 'This endpoint returns the list of feature toggles that the proxy evaluates to enabled for the given context. Context values are provided as query parameters. If the Frontend API is disabled 404 is returned.',
                }),
            ],
        });
        this.route({
            method: 'post',
            path: '',
            handler: ProxyController.endpointNotImplemented,
            permission: types_1.NONE,
        });
        this.route({
            method: 'get',
            path: '/client/features',
            handler: ProxyController.endpointNotImplemented,
            permission: types_1.NONE,
        });
        this.route({
            method: 'post',
            path: '/client/metrics',
            handler: this.registerProxyMetrics,
            permission: types_1.NONE,
            middleware: [
                this.services.openApiService.validPath({
                    tags: ['Frontend API'],
                    summary: 'Register client usage metrics',
                    description: `Registers usage metrics. Stores information about how many times each toggle was evaluated to enabled and disabled within a time frame. If provided, this operation will also store data on how many times each feature toggle's variants were displayed to the end user. If the Frontend API is disabled 404 is returned.`,
                    operationId: 'registerFrontendMetrics',
                    requestBody: (0, openapi_1.createRequestSchema)('clientMetricsSchema'),
                    responses: {
                        200: openapi_1.emptyResponse,
                        ...(0, openapi_1.getStandardResponses)(400, 401, 404),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: '/client/register',
            handler: this.registerProxyClient,
            permission: types_1.NONE,
            middleware: [
                this.services.openApiService.validPath({
                    tags: ['Frontend API'],
                    summary: 'Register a client SDK',
                    description: 'This is for future use. Currently Frontend client registration is not supported. Returning 200 for clients that expect this status code. If the Frontend API is disabled 404 is returned.',
                    operationId: 'registerFrontendClient',
                    requestBody: (0, openapi_1.createRequestSchema)('proxyClientSchema'),
                    responses: {
                        200: openapi_1.emptyResponse,
                        ...(0, openapi_1.getStandardResponses)(400, 401, 404),
                    },
                }),
            ],
        });
        this.route({
            method: 'get',
            path: '/health',
            handler: ProxyController.endpointNotImplemented,
            permission: types_1.NONE,
        });
        this.route({
            method: 'get',
            path: '/internal-backstage/prometheus',
            handler: ProxyController.endpointNotImplemented,
            permission: types_1.NONE,
        });
    }
    static async endpointNotImplemented(req, res) {
        const error = new not_implemented_error_1.default('The frontend API does not support this endpoint.');
        res.status(error.statusCode).json(error);
    }
    async getProxyFeatures(req, res) {
        if (!this.config.flagResolver.isEnabled('embedProxy')) {
            throw new notfound_error_1.default();
        }
        const toggles = await this.services.proxyService.getProxyFeatures(req.user, ProxyController.createContext(req));
        res.set('Cache-control', 'public, max-age=2');
        this.services.openApiService.respondWithValidation(200, res, openapi_1.proxyFeaturesSchema.$id, { toggles });
    }
    async registerProxyMetrics(req, res) {
        if (!this.config.flagResolver.isEnabled('embedProxy')) {
            throw new notfound_error_1.default();
        }
        await this.services.proxyService.registerProxyMetrics(req.user, req.body, req.ip);
        res.sendStatus(200);
    }
    async registerProxyClient(req, res) {
        if (!this.config.flagResolver.isEnabled('embedProxy')) {
            throw new notfound_error_1.default();
        }
        // Client registration is not yet supported by @unleash/proxy,
        // but proxy clients may still expect a 200 from this endpoint.
        res.sendStatus(200);
    }
    static createContext(req) {
        const { query } = req;
        return (0, proxy_1.enrichContextWithIp)(query, req.ip);
    }
}
exports.default = ProxyController;
//# sourceMappingURL=index.js.map