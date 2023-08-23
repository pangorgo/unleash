"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fast_json_patch_1 = require("fast-json-patch");
const controller_1 = __importDefault(require("../../controller"));
const types_1 = require("../../../types");
const util_1 = require("../../../util");
const openapi_1 = require("../../../openapi");
const feature_schema_1 = require("../../../schema/feature-schema");
const error_1 = require("../../../error");
const PATH = '/:projectId/features';
const PATH_STALE = '/:projectId/stale';
const PATH_TAGS = `/:projectId/tags`;
const PATH_FEATURE = `${PATH}/:featureName`;
const PATH_FEATURE_CLONE = `${PATH_FEATURE}/clone`;
const PATH_ENV = `${PATH_FEATURE}/environments/:environment`;
const BULK_PATH_ENV = `/:projectId/bulk_features/environments/:environment`;
const PATH_STRATEGIES = `${PATH_ENV}/strategies`;
const PATH_STRATEGY = `${PATH_STRATEGIES}/:strategyId`;
class ProjectFeaturesController extends controller_1.default {
    constructor(config, { featureToggleServiceV2, openApiService, transactionalFeatureToggleService, featureTagService, }, startTransaction) {
        super(config);
        this.featureService = featureToggleServiceV2;
        this.transactionalFeatureToggleService =
            transactionalFeatureToggleService;
        this.startTransaction = startTransaction;
        this.openApiService = openApiService;
        this.featureTagService = featureTagService;
        this.flagResolver = config.flagResolver;
        this.logger = config.getLogger('/admin-api/project/features.ts');
        this.route({
            method: 'get',
            path: PATH_ENV,
            permission: types_1.NONE,
            handler: this.getFeatureEnvironment,
            middleware: [
                openApiService.validPath({
                    summary: 'Get a feature environment',
                    description: 'Information about the enablement status and strategies for a feature toggle in specified environment.',
                    tags: ['Features'],
                    operationId: 'getFeatureEnvironment',
                    responses: {
                        200: (0, openapi_1.createResponseSchema)('featureEnvironmentSchema'),
                        ...(0, openapi_1.getStandardResponses)(401, 403, 404),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: `${PATH_ENV}/off`,
            acceptAnyContentType: true,
            handler: this.toggleFeatureEnvironmentOff,
            permission: types_1.UPDATE_FEATURE_ENVIRONMENT,
            middleware: [
                openApiService.validPath({
                    summary: 'Disable a feature toggle',
                    description: 'Disable a feature toggle in the specified environment.',
                    tags: ['Features'],
                    operationId: 'toggleFeatureEnvironmentOff',
                    responses: {
                        200: (0, openapi_1.createResponseSchema)('featureSchema'),
                        ...(0, openapi_1.getStandardResponses)(400, 401, 403, 404),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: `${PATH_ENV}/on`,
            acceptAnyContentType: true,
            handler: this.toggleFeatureEnvironmentOn,
            permission: types_1.UPDATE_FEATURE_ENVIRONMENT,
            middleware: [
                openApiService.validPath({
                    summary: 'Enable a feature toggle',
                    description: 'Enable a feature toggle in the specified environment.',
                    tags: ['Features'],
                    operationId: 'toggleFeatureEnvironmentOn',
                    responses: {
                        200: (0, openapi_1.createResponseSchema)('featureSchema'),
                        ...(0, openapi_1.getStandardResponses)(400, 401, 403, 404),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: `${BULK_PATH_ENV}/on`,
            handler: this.bulkToggleFeaturesEnvironmentOn,
            permission: types_1.UPDATE_FEATURE_ENVIRONMENT,
            middleware: [
                openApiService.validPath({
                    tags: ['Features'],
                    summary: 'Bulk enable a list of features',
                    description: 'This endpoint enables multiple feature toggles.',
                    operationId: 'bulkToggleFeaturesEnvironmentOn',
                    requestBody: (0, openapi_1.createRequestSchema)('bulkToggleFeaturesSchema'),
                    responses: {
                        200: openapi_1.emptyResponse,
                        ...(0, openapi_1.getStandardResponses)(400, 401, 403, 404, 413, 415),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: `${BULK_PATH_ENV}/off`,
            handler: this.bulkToggleFeaturesEnvironmentOff,
            permission: types_1.UPDATE_FEATURE_ENVIRONMENT,
            middleware: [
                openApiService.validPath({
                    tags: ['Features'],
                    summary: 'Bulk disable a list of features',
                    description: 'This endpoint disables multiple feature toggles.',
                    operationId: 'bulkToggleFeaturesEnvironmentOff',
                    requestBody: (0, openapi_1.createRequestSchema)('bulkToggleFeaturesSchema'),
                    responses: {
                        200: openapi_1.emptyResponse,
                        ...(0, openapi_1.getStandardResponses)(400, 401, 403, 404, 413, 415),
                    },
                }),
            ],
        });
        this.route({
            method: 'get',
            path: PATH_STRATEGIES,
            handler: this.getFeatureStrategies,
            permission: types_1.NONE,
            middleware: [
                openApiService.validPath({
                    tags: ['Features'],
                    summary: 'Get feature toggle strategies',
                    operationId: 'getFeatureStrategies',
                    description: 'Get strategies defined for a feature toggle in the specified environment.',
                    responses: {
                        200: (0, openapi_1.createResponseSchema)('featureStrategySchema'),
                        ...(0, openapi_1.getStandardResponses)(401, 403, 404),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: PATH_STRATEGIES,
            handler: this.addFeatureStrategy,
            permission: types_1.CREATE_FEATURE_STRATEGY,
            middleware: [
                openApiService.validPath({
                    tags: ['Features'],
                    summary: 'Add a strategy to a feature toggle',
                    description: 'Add a strategy to a feature toggle in the specified environment.',
                    operationId: 'addFeatureStrategy',
                    requestBody: (0, openapi_1.createRequestSchema)('createFeatureStrategySchema'),
                    responses: {
                        200: (0, openapi_1.createResponseSchema)('featureStrategySchema'),
                        ...(0, openapi_1.getStandardResponses)(401, 403, 404),
                    },
                }),
            ],
        });
        this.route({
            method: 'get',
            path: PATH_STRATEGY,
            handler: this.getFeatureStrategy,
            permission: types_1.NONE,
            middleware: [
                openApiService.validPath({
                    tags: ['Features'],
                    summary: 'Get a strategy configuration',
                    description: 'Get a strategy configuration for an environment in a feature toggle.',
                    operationId: 'getFeatureStrategy',
                    responses: {
                        200: (0, openapi_1.createResponseSchema)('featureStrategySchema'),
                        ...(0, openapi_1.getStandardResponses)(401, 403, 404),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: `${PATH_STRATEGIES}/set-sort-order`,
            handler: this.setStrategiesSortOrder,
            permission: types_1.UPDATE_FEATURE_STRATEGY,
            middleware: [
                openApiService.validPath({
                    tags: ['Features'],
                    operationId: 'setStrategySortOrder',
                    summary: 'Set strategy sort order',
                    description: 'Set the sort order of the provided list of strategies.',
                    requestBody: (0, openapi_1.createRequestSchema)('setStrategySortOrderSchema'),
                    responses: {
                        200: openapi_1.emptyResponse,
                        ...(0, openapi_1.getStandardResponses)(400, 401, 403),
                    },
                }),
            ],
        });
        this.route({
            method: 'put',
            path: PATH_STRATEGY,
            handler: this.updateFeatureStrategy,
            permission: types_1.UPDATE_FEATURE_STRATEGY,
            middleware: [
                openApiService.validPath({
                    tags: ['Features'],
                    summary: 'Update a strategy',
                    description: 'Replace strategy configuration for a feature toggle in the specified environment.',
                    operationId: 'updateFeatureStrategy',
                    requestBody: (0, openapi_1.createRequestSchema)('updateFeatureStrategySchema'),
                    responses: {
                        200: (0, openapi_1.createResponseSchema)('featureStrategySchema'),
                        ...(0, openapi_1.getStandardResponses)(400, 401, 403, 404, 415),
                    },
                }),
            ],
        });
        this.route({
            method: 'patch',
            path: PATH_STRATEGY,
            handler: this.patchFeatureStrategy,
            permission: types_1.UPDATE_FEATURE_STRATEGY,
            middleware: [
                openApiService.validPath({
                    tags: ['Features'],
                    summary: 'Change specific properties of a strategy',
                    description: 'Change specific properties of a strategy configuration in a feature toggle.',
                    operationId: 'patchFeatureStrategy',
                    requestBody: (0, openapi_1.createRequestSchema)('patchesSchema'),
                    responses: {
                        200: (0, openapi_1.createResponseSchema)('featureStrategySchema'),
                        ...(0, openapi_1.getStandardResponses)(400, 401, 403, 404, 415),
                    },
                }),
            ],
        });
        this.route({
            method: 'delete',
            path: PATH_STRATEGY,
            acceptAnyContentType: true,
            handler: this.deleteFeatureStrategy,
            permission: types_1.DELETE_FEATURE_STRATEGY,
            middleware: [
                openApiService.validPath({
                    tags: ['Features'],
                    summary: 'Delete a strategy from a feature toggle',
                    description: 'Delete a strategy configuration from a feature toggle in the specified environment.',
                    operationId: 'deleteFeatureStrategy',
                    responses: {
                        200: openapi_1.emptyResponse,
                        ...(0, openapi_1.getStandardResponses)(401, 403, 404),
                    },
                }),
            ],
        });
        this.route({
            method: 'get',
            path: PATH,
            handler: this.getFeatures,
            permission: types_1.NONE,
            middleware: [
                openApiService.validPath({
                    summary: 'Get all features in a project',
                    description: 'A list of all features for the specified project.',
                    tags: ['Features'],
                    operationId: 'getFeatures',
                    responses: {
                        200: (0, openapi_1.createResponseSchema)('featuresSchema'),
                        ...(0, openapi_1.getStandardResponses)(400, 401, 403),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: PATH,
            handler: this.createFeature,
            permission: types_1.CREATE_FEATURE,
            middleware: [
                openApiService.validPath({
                    summary: 'Add a new feature toggle',
                    description: 'Create a new feature toggle in a specified project.',
                    tags: ['Features'],
                    operationId: 'createFeature',
                    requestBody: (0, openapi_1.createRequestSchema)('createFeatureSchema'),
                    responses: {
                        200: (0, openapi_1.createResponseSchema)('featureSchema'),
                        ...(0, openapi_1.getStandardResponses)(401, 403, 404, 415),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: PATH_FEATURE_CLONE,
            acceptAnyContentType: true,
            handler: this.cloneFeature,
            permission: types_1.CREATE_FEATURE,
            middleware: [
                openApiService.validPath({
                    summary: 'Clone a feature toggle',
                    description: 'Creates a copy of the specified feature toggle. The copy can be created in any project.',
                    tags: ['Features'],
                    operationId: 'cloneFeature',
                    requestBody: (0, openapi_1.createRequestSchema)('cloneFeatureSchema'),
                    responses: {
                        200: (0, openapi_1.createResponseSchema)('featureSchema'),
                        ...(0, openapi_1.getStandardResponses)(401, 403, 404, 415),
                    },
                }),
            ],
        });
        this.route({
            method: 'get',
            path: PATH_FEATURE,
            handler: this.getFeature,
            permission: types_1.NONE,
            middleware: [
                openApiService.validPath({
                    operationId: 'getFeature',
                    tags: ['Features'],
                    summary: 'Get a feature',
                    description: 'This endpoint returns the information about the requested feature if the feature belongs to the specified project.',
                    responses: {
                        200: (0, openapi_1.createResponseSchema)('featureSchema'),
                        403: {
                            description: 'You either do not have the required permissions or used an invalid URL.',
                        },
                        ...(0, openapi_1.getStandardResponses)(401, 403, 404),
                    },
                }),
            ],
        });
        this.route({
            method: 'put',
            path: PATH_FEATURE,
            handler: this.updateFeature,
            permission: types_1.UPDATE_FEATURE,
            middleware: [
                openApiService.validPath({
                    tags: ['Features'],
                    operationId: 'updateFeature',
                    summary: 'Update a feature toggle',
                    description: 'Updates the specified feature if the feature belongs to the specified project. Only the provided properties are updated; any feature properties left out of the request body are left untouched.',
                    requestBody: (0, openapi_1.createRequestSchema)('updateFeatureSchema'),
                    responses: {
                        200: (0, openapi_1.createResponseSchema)('featureSchema'),
                        ...(0, openapi_1.getStandardResponses)(401, 403, 404, 415),
                    },
                }),
            ],
        });
        this.route({
            method: 'patch',
            path: PATH_FEATURE,
            handler: this.patchFeature,
            permission: types_1.UPDATE_FEATURE,
            middleware: [
                openApiService.validPath({
                    tags: ['Features'],
                    operationId: 'patchFeature',
                    summary: 'Modify a feature toggle',
                    description: 'Change specific properties of a feature toggle.',
                    requestBody: (0, openapi_1.createRequestSchema)('patchesSchema'),
                    responses: {
                        200: (0, openapi_1.createResponseSchema)('featureSchema'),
                        ...(0, openapi_1.getStandardResponses)(401, 403, 404, 415),
                    },
                }),
            ],
        });
        this.route({
            method: 'delete',
            path: PATH_FEATURE,
            acceptAnyContentType: true,
            handler: this.archiveFeature,
            permission: types_1.DELETE_FEATURE,
            middleware: [
                openApiService.validPath({
                    tags: ['Features'],
                    operationId: 'archiveFeature',
                    summary: 'Archive a feature toggle',
                    description: 'This endpoint archives the specified feature if the feature belongs to the specified project.',
                    responses: {
                        202: openapi_1.emptyResponse,
                        403: {
                            description: 'You either do not have the required permissions or used an invalid URL.',
                        },
                        ...(0, openapi_1.getStandardResponses)(401, 403, 404),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: PATH_STALE,
            handler: this.staleFeatures,
            permission: types_1.UPDATE_FEATURE,
            middleware: [
                openApiService.validPath({
                    tags: ['Features'],
                    operationId: 'staleFeatures',
                    summary: 'Mark features as stale / not stale',
                    description: `This endpoint marks the provided list of features as either [stale](https://docs.getunleash.io/reference/technical-debt#stale-and-potentially-stale-toggles) or not stale depending on the request body you send. Any provided features that don't exist are ignored.`,
                    requestBody: (0, openapi_1.createRequestSchema)('batchStaleSchema'),
                    responses: {
                        202: openapi_1.emptyResponse,
                        ...(0, openapi_1.getStandardResponses)(401, 403, 415),
                    },
                }),
            ],
        });
        this.route({
            method: 'put',
            path: PATH_TAGS,
            handler: this.updateFeaturesTags,
            permission: types_1.UPDATE_FEATURE,
            middleware: [
                openApiService.validPath({
                    tags: ['Tags'],
                    operationId: 'addTagToFeatures',
                    summary: 'Adds a tag to the specified features',
                    description: 'Add a tag to a list of features. Create tags if needed.',
                    requestBody: (0, openapi_1.createRequestSchema)('tagsBulkAddSchema'),
                    responses: {
                        200: openapi_1.emptyResponse,
                        ...(0, openapi_1.getStandardResponses)(401, 403, 404, 415),
                    },
                }),
            ],
        });
    }
    async getFeatures(req, res) {
        const { projectId } = req.params;
        const query = await this.prepQuery(req.query, projectId);
        const features = await this.featureService.getFeatureOverview({
            ...query,
            userId: req.user.id,
        });
        this.openApiService.respondWithValidation(200, res, openapi_1.featuresSchema.$id, { version: 2, features: (0, types_1.serializeDates)(features) });
    }
    async prepQuery(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    { tag, namePrefix }, projectId) {
        if (!tag && !namePrefix) {
            return { projectId };
        }
        const tagQuery = this.paramToArray(tag);
        const query = await feature_schema_1.querySchema.validateAsync({
            tag: tagQuery,
            namePrefix,
        });
        if (query.tag) {
            query.tag = query.tag.map((q) => q.split(':'));
        }
        return { projectId, ...query };
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    paramToArray(param) {
        if (!param) {
            return param;
        }
        return Array.isArray(param) ? param : [param];
    }
    async cloneFeature(req, res) {
        const { projectId, featureName } = req.params;
        const { name, replaceGroupId } = req.body;
        const userName = (0, util_1.extractUsername)(req);
        const created = await this.featureService.cloneFeatureToggle(featureName, projectId, name, replaceGroupId, userName);
        this.openApiService.respondWithValidation(201, res, openapi_1.featureSchema.$id, (0, types_1.serializeDates)(created));
    }
    async createFeature(req, res) {
        const { projectId } = req.params;
        const userName = (0, util_1.extractUsername)(req);
        const created = await this.featureService.createFeatureToggle(projectId, {
            ...req.body,
            description: req.body.description || undefined,
        }, userName);
        this.openApiService.respondWithValidation(201, res, openapi_1.featureSchema.$id, (0, types_1.serializeDates)(created));
    }
    async getFeature(req, res) {
        const { featureName, projectId } = req.params;
        const { variantEnvironments } = req.query;
        const { user } = req;
        const feature = await this.featureService.getFeature({
            featureName,
            archived: false,
            projectId,
            environmentVariants: variantEnvironments === 'true',
            userId: user.id,
        });
        res.status(200).json(feature);
    }
    async updateFeature(req, res) {
        const { projectId, featureName } = req.params;
        const { createdAt, ...data } = req.body;
        const userName = (0, util_1.extractUsername)(req);
        if (data.name && data.name !== featureName) {
            throw new error_1.BadDataError('Cannot change name of feature toggle');
        }
        const created = await this.featureService.updateFeatureToggle(projectId, {
            ...data,
            name: featureName,
        }, userName, featureName);
        this.openApiService.respondWithValidation(200, res, openapi_1.featureSchema.$id, (0, types_1.serializeDates)(created));
    }
    async patchFeature(req, res) {
        const { projectId, featureName } = req.params;
        const updated = await this.featureService.patchFeature(projectId, featureName, (0, util_1.extractUsername)(req), req.body);
        this.openApiService.respondWithValidation(200, res, openapi_1.featureSchema.$id, (0, types_1.serializeDates)(updated));
    }
    async archiveFeature(req, res) {
        const { featureName, projectId } = req.params;
        const userName = (0, util_1.extractUsername)(req);
        await this.featureService.archiveToggle(featureName, userName, projectId);
        res.status(202).send();
    }
    async staleFeatures(req, res) {
        const { features, stale } = req.body;
        const { projectId } = req.params;
        const userName = (0, util_1.extractUsername)(req);
        await this.featureService.setToggleStaleness(features, stale, userName, projectId);
        res.status(202).end();
    }
    async getFeatureEnvironment(req, res) {
        const { environment, featureName, projectId } = req.params;
        const { defaultStrategy, ...environmentInfo } = await this.featureService.getEnvironmentInfo(projectId, environment, featureName);
        const result = {
            ...environmentInfo,
            strategies: environmentInfo.strategies.map((strategy) => {
                const { strategyName, projectId: project, environment: environmentId, createdAt, ...rest } = strategy;
                return { ...rest, name: strategyName };
            }),
        };
        this.openApiService.respondWithValidation(200, res, openapi_1.featureEnvironmentSchema.$id, (0, types_1.serializeDates)(result));
    }
    async toggleFeatureEnvironmentOn(req, res) {
        const { featureName, environment, projectId } = req.params;
        const { shouldActivateDisabledStrategies } = req.query;
        await this.featureService.updateEnabled(projectId, featureName, environment, true, (0, util_1.extractUsername)(req), req.user, shouldActivateDisabledStrategies === 'true');
        res.status(200).end();
    }
    async bulkToggleFeaturesEnvironmentOn(req, res) {
        const { environment, projectId } = req.params;
        const { shouldActivateDisabledStrategies } = req.query;
        const { features } = req.body;
        if (this.flagResolver.isEnabled('disableBulkToggle')) {
            res.status(403).end();
            return;
        }
        await this.startTransaction(async (tx) => this.transactionalFeatureToggleService(tx).bulkUpdateEnabled(projectId, features, environment, true, (0, util_1.extractUsername)(req), req.user, shouldActivateDisabledStrategies === 'true'));
        res.status(200).end();
    }
    async bulkToggleFeaturesEnvironmentOff(req, res) {
        const { environment, projectId } = req.params;
        const { shouldActivateDisabledStrategies } = req.query;
        const { features } = req.body;
        if (this.flagResolver.isEnabled('disableBulkToggle')) {
            res.status(403).end();
            return;
        }
        await this.startTransaction(async (tx) => this.transactionalFeatureToggleService(tx).bulkUpdateEnabled(projectId, features, environment, false, (0, util_1.extractUsername)(req), req.user, shouldActivateDisabledStrategies === 'true'));
        res.status(200).end();
    }
    async toggleFeatureEnvironmentOff(req, res) {
        const { featureName, environment, projectId } = req.params;
        await this.featureService.updateEnabled(projectId, featureName, environment, false, (0, util_1.extractUsername)(req), req.user);
        res.status(200).end();
    }
    async addFeatureStrategy(req, res) {
        const { projectId, featureName, environment } = req.params;
        const { ...strategyConfig } = req.body;
        if (!strategyConfig.segmentIds) {
            strategyConfig.segmentIds = [];
        }
        const userName = (0, util_1.extractUsername)(req);
        const strategy = await this.featureService.createStrategy(strategyConfig, { environment, projectId, featureName }, userName, req.user);
        const updatedStrategy = await this.featureService.getStrategy(strategy.id);
        res.status(200).json(updatedStrategy);
    }
    async getFeatureStrategies(req, res) {
        const { projectId, featureName, environment } = req.params;
        const featureStrategies = await this.featureService.getStrategiesForEnvironment(projectId, featureName, environment);
        res.status(200).json(featureStrategies);
    }
    async setStrategiesSortOrder(req, res) {
        const { featureName, projectId, environment } = req.params;
        const createdBy = (0, util_1.extractUsername)(req);
        await this.startTransaction(async (tx) => this.transactionalFeatureToggleService(tx).updateStrategiesSortOrder({
            featureName,
            environment,
            projectId,
        }, req.body, createdBy));
        res.status(200).send();
    }
    async updateFeatureStrategy(req, res) {
        const { strategyId, environment, projectId, featureName } = req.params;
        const userName = (0, util_1.extractUsername)(req);
        if (!req.body.segmentIds) {
            req.body.segmentIds = [];
        }
        const updatedStrategy = await this.startTransaction(async (tx) => this.transactionalFeatureToggleService(tx).updateStrategy(strategyId, req.body, { environment, projectId, featureName }, userName, req.user));
        res.status(200).json(updatedStrategy);
    }
    async patchFeatureStrategy(req, res) {
        const { strategyId, projectId, environment, featureName } = req.params;
        const userName = (0, util_1.extractUsername)(req);
        const patch = req.body;
        const strategy = await this.featureService.getStrategy(strategyId);
        const { newDocument } = (0, fast_json_patch_1.applyPatch)(strategy, patch);
        const updatedStrategy = await this.startTransaction(async (tx) => this.transactionalFeatureToggleService(tx).updateStrategy(strategyId, newDocument, { environment, projectId, featureName }, userName, req.user));
        res.status(200).json(updatedStrategy);
    }
    async getFeatureStrategy(req, res) {
        this.logger.info('Getting strategy');
        const { strategyId } = req.params;
        this.logger.info(strategyId);
        const strategy = await this.featureService.getStrategy(strategyId);
        res.status(200).json(strategy);
    }
    async deleteFeatureStrategy(req, res) {
        this.logger.info('Deleting strategy');
        const { environment, projectId, featureName } = req.params;
        const userName = (0, util_1.extractUsername)(req);
        const { strategyId } = req.params;
        this.logger.info(strategyId);
        const strategy = await this.featureService.deleteStrategy(strategyId, { environment, projectId, featureName }, userName, req.user);
        res.status(200).json(strategy);
    }
    async updateStrategyParameter(req, res) {
        const { strategyId, environment, projectId, featureName } = req.params;
        const userName = (0, util_1.extractUsername)(req);
        const { name, value } = req.body;
        const updatedStrategy = await this.featureService.updateStrategyParameter(strategyId, name, value, { environment, projectId, featureName }, userName);
        res.status(200).json(updatedStrategy);
    }
    async updateFeaturesTags(req, res) {
        const { features, tags } = req.body;
        const userName = (0, util_1.extractUsername)(req);
        await this.featureTagService.updateTags(features, tags.addedTags, tags.removedTags, userName);
        res.status(200).end();
    }
    async getStrategyParameters(req, res) {
        this.logger.info('Getting strategy parameters');
        const { strategyId } = req.params;
        const strategy = await this.featureService.getStrategy(strategyId);
        res.status(200).json(strategy.parameters);
    }
}
exports.default = ProjectFeaturesController;
//# sourceMappingURL=project-features.js.map