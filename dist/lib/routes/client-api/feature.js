"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const memoizee_1 = __importDefault(require("memoizee"));
// eslint-disable-next-line import/no-extraneous-dependencies
const hash_sum_1 = __importDefault(require("hash-sum"));
const controller_1 = __importDefault(require("../controller"));
const feature_schema_1 = require("../../schema/feature-schema");
const notfound_error_1 = __importDefault(require("../../error/notfound-error"));
const api_user_1 = __importDefault(require("../../types/api-user"));
const api_token_1 = require("../../types/models/api-token");
const permissions_1 = require("../../types/permissions");
const create_response_schema_1 = require("../../openapi/util/create-response-schema");
const client_feature_schema_1 = require("../../openapi/spec/client-feature-schema");
const client_features_schema_1 = require("../../openapi/spec/client-features-schema");
const version = 2;
class FeatureController extends controller_1.default {
    constructor({ featureToggleServiceV2, segmentService, clientSpecService, openApiService, configurationRevisionService, }, config) {
        super(config);
        const { clientFeatureCaching } = config;
        this.featureToggleServiceV2 = featureToggleServiceV2;
        this.segmentService = segmentService;
        this.clientSpecService = clientSpecService;
        this.openApiService = openApiService;
        this.configurationRevisionService = configurationRevisionService;
        this.logger = config.getLogger('client-api/feature.js');
        this.route({
            method: 'get',
            path: '/:featureName',
            handler: this.getFeatureToggle,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    operationId: 'getClientFeature',
                    summary: 'Get a single feature toggle',
                    description: 'Gets all the client data for a single toggle. Contains the exact same information about a toggle as the `/api/client/features` endpoint does, but only contains data about the specified toggle. All SDKs should use `/api/client/features`',
                    tags: ['Client'],
                    responses: {
                        200: (0, create_response_schema_1.createResponseSchema)('clientFeatureSchema'),
                    },
                }),
            ],
        });
        this.route({
            method: 'get',
            path: '',
            handler: this.getAll,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    summary: 'Get all toggles (SDK)',
                    description: 'Returns the SDK configuration for all feature toggles that are available to the provided API key. Used by SDKs to configure local evaluation',
                    operationId: 'getAllClientFeatures',
                    tags: ['Client'],
                    responses: {
                        200: (0, create_response_schema_1.createResponseSchema)('clientFeaturesSchema'),
                    },
                }),
            ],
        });
        if (clientFeatureCaching.enabled) {
            this.featuresAndSegments = (0, memoizee_1.default)(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (query, etag) => this.resolveFeaturesAndSegments(query), {
                promise: true,
                maxAge: clientFeatureCaching.maxAge,
                normalizer(args) {
                    // args is arguments object as accessible in memoized function
                    return args[1];
                },
            });
        }
        else {
            this.featuresAndSegments = this.resolveFeaturesAndSegments;
        }
    }
    async resolveFeaturesAndSegments(query) {
        return Promise.all([
            this.featureToggleServiceV2.getClientFeatures(query),
            this.segmentService.getActiveForClient(),
        ]);
    }
    async resolveQuery(req) {
        const { user, query } = req;
        const override = {};
        if (user instanceof api_user_1.default) {
            if (!(0, api_token_1.isAllProjects)(user.projects)) {
                override.project = user.projects;
            }
            if (user.environment !== api_token_1.ALL) {
                override.environment = user.environment;
            }
        }
        const inlineSegmentConstraints = !this.clientSpecService.requestSupportsSpec(req, 'segments');
        return this.prepQuery({
            ...query,
            ...override,
            inlineSegmentConstraints,
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    paramToArray(param) {
        if (!param) {
            return param;
        }
        return Array.isArray(param) ? param : [param];
    }
    async prepQuery({ tag, project, namePrefix, environment, inlineSegmentConstraints, }) {
        if (!tag &&
            !project &&
            !namePrefix &&
            !environment &&
            !inlineSegmentConstraints) {
            return {};
        }
        const tagQuery = this.paramToArray(tag);
        const projectQuery = this.paramToArray(project);
        const query = await feature_schema_1.querySchema.validateAsync({
            tag: tagQuery,
            project: projectQuery,
            namePrefix,
            environment,
            inlineSegmentConstraints,
        });
        if (query.tag) {
            query.tag = query.tag.map((q) => q.split(':'));
        }
        return query;
    }
    async getAll(req, res) {
        const query = await this.resolveQuery(req);
        const userVersion = req.headers['if-none-match'];
        const meta = await this.calculateMeta(query);
        const { etag } = meta;
        res.setHeader('ETag', etag);
        if (etag === userVersion) {
            res.status(304);
            res.end();
            return;
        }
        else {
            this.logger.debug(`Provided revision: ${userVersion}, calculated revision: ${etag}`);
        }
        const [features, segments] = await this.featuresAndSegments(query, etag);
        if (this.clientSpecService.requestSupportsSpec(req, 'segments')) {
            this.openApiService.respondWithValidation(200, res, client_features_schema_1.clientFeaturesSchema.$id, {
                version,
                features,
                query: { ...query },
                segments,
                meta,
            });
        }
        else {
            this.openApiService.respondWithValidation(200, res, client_features_schema_1.clientFeaturesSchema.$id, { version, features, query, meta });
        }
    }
    async calculateMeta(query) {
        // TODO: We will need to standardize this to be able to implement this a cross languages (Edge in Rust?).
        const revisionId = await this.configurationRevisionService.getMaxRevisionId();
        // TODO: We will need to standardize this to be able to implement this a cross languages (Edge in Rust?).
        const queryHash = (0, hash_sum_1.default)(query);
        const etag = `"${queryHash}:${revisionId}"`;
        return { revisionId, etag, queryHash };
    }
    async getFeatureToggle(req, res) {
        const name = req.params.featureName;
        const featureQuery = await this.resolveQuery(req);
        const q = { ...featureQuery, namePrefix: name };
        const toggles = await this.featureToggleServiceV2.getClientFeatures(q);
        const toggle = toggles.find((t) => t.name === name);
        if (!toggle) {
            throw new notfound_error_1.default(`Could not find feature toggle ${name}`);
        }
        this.openApiService.respondWithValidation(200, res, client_feature_schema_1.clientFeatureSchema.$id, {
            ...toggle,
        });
    }
}
exports.default = FeatureController;
//# sourceMappingURL=feature.js.map