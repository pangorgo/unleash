"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../controller"));
const extract_user_1 = require("../../util/extract-user");
const permissions_1 = require("../../types/permissions");
const feature_schema_1 = require("../../schema/feature-schema");
const constants_1 = require("../../util/constants");
const features_schema_1 = require("../../openapi/spec/features-schema");
const serialize_dates_1 = require("../../types/serialize-dates");
const create_request_schema_1 = require("../../openapi/util/create-request-schema");
const create_response_schema_1 = require("../../openapi/util/create-response-schema");
const standard_responses_1 = require("../../openapi/util/standard-responses");
const version = 1;
class FeatureController extends controller_1.default {
    constructor(config, { featureTagService, featureToggleServiceV2, openApiService, }) {
        super(config);
        this.tagService = featureTagService;
        this.openApiService = openApiService;
        this.service = featureToggleServiceV2;
        this.route({
            method: 'get',
            path: '',
            handler: this.getAllToggles,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    tags: ['Features'],
                    operationId: 'getAllToggles',
                    responses: {
                        200: (0, create_response_schema_1.createResponseSchema)('featuresSchema'),
                        ...(0, standard_responses_1.getStandardResponses)(401, 403),
                    },
                    summary: 'Get all feature toggles (deprecated)',
                    description: 'Gets all feature toggles with their full configuration. This endpoint is **deprecated**. You should  use the project-based endpoint instead (`/api/admin/projects/<project-id>/features`).',
                    deprecated: true,
                }),
            ],
        });
        this.route({
            method: 'post',
            path: '/validate',
            handler: this.validate,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    tags: ['Features'],
                    operationId: 'validateFeature',
                    summary: 'Validate a feature toggle name.',
                    requestBody: (0, create_request_schema_1.createRequestSchema)('validateFeatureSchema'),
                    description: 'Validates a feature toggle name: checks whether the name is URL-friendly and whether a feature with the given name already exists. Returns 200 if the feature name is compliant and unused.',
                    responses: {
                        200: standard_responses_1.emptyResponse,
                        ...(0, standard_responses_1.getStandardResponses)(400, 401, 409, 415),
                    },
                }),
            ],
        });
        this.route({
            method: 'get',
            path: '/:featureName/tags',
            handler: this.listTags,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    summary: 'Get all tags for a feature.',
                    description: 'Retrieves all the tags for a feature name. If the feature does not exist it returns an empty list.',
                    tags: ['Features'],
                    operationId: 'listTags',
                    responses: {
                        200: (0, create_response_schema_1.createResponseSchema)('tagsSchema'),
                        ...(0, standard_responses_1.getStandardResponses)(401, 403, 404),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: '/:featureName/tags',
            permission: permissions_1.UPDATE_FEATURE,
            handler: this.addTag,
            middleware: [
                openApiService.validPath({
                    summary: 'Adds a tag to a feature.',
                    description: 'Adds a tag to a feature if the feature and tag type exist in the system. The operation is idempotent, so adding an existing tag will result in a successful response.',
                    tags: ['Features'],
                    operationId: 'addTag',
                    requestBody: (0, create_request_schema_1.createRequestSchema)('tagSchema'),
                    responses: {
                        201: (0, create_response_schema_1.resourceCreatedResponseSchema)('tagSchema'),
                        ...(0, standard_responses_1.getStandardResponses)(400, 401, 403, 404),
                    },
                }),
            ],
        });
        this.route({
            method: 'put',
            path: '/:featureName/tags',
            permission: permissions_1.UPDATE_FEATURE,
            handler: this.updateTags,
            middleware: [
                openApiService.validPath({
                    summary: 'Updates multiple tags for a feature.',
                    description: 'Receives a list of tags to add and a list of tags to remove that are mandatory but can be empty. All tags under addedTags are first added to the feature and then all tags under removedTags are removed from the feature.',
                    tags: ['Features'],
                    operationId: 'updateTags',
                    requestBody: (0, create_request_schema_1.createRequestSchema)('updateTagsSchema'),
                    responses: {
                        200: (0, create_response_schema_1.resourceCreatedResponseSchema)('tagsSchema'),
                        ...(0, standard_responses_1.getStandardResponses)(400, 401, 403, 404),
                    },
                }),
            ],
        });
        this.route({
            method: 'delete',
            path: '/:featureName/tags/:type/:value',
            permission: permissions_1.UPDATE_FEATURE,
            acceptAnyContentType: true,
            handler: this.removeTag,
            middleware: [
                openApiService.validPath({
                    summary: 'Removes a tag from a feature.',
                    description: 'Removes a tag from a feature. If the feature exists but the tag does not, it returns a successful response.',
                    tags: ['Features'],
                    operationId: 'removeTag',
                    responses: {
                        200: standard_responses_1.emptyResponse,
                        ...(0, standard_responses_1.getStandardResponses)(401, 403, 404),
                    },
                }),
            ],
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    paramToArray(param) {
        if (!param) {
            return param;
        }
        return Array.isArray(param) ? param : [param];
    }
    async prepQuery({ tag, project, namePrefix, }) {
        if (!tag && !project && !namePrefix) {
            return null;
        }
        const tagQuery = this.paramToArray(tag);
        const projectQuery = this.paramToArray(project);
        const query = await feature_schema_1.querySchema.validateAsync({
            tag: tagQuery,
            project: projectQuery,
            namePrefix,
        });
        if (query.tag) {
            query.tag = query.tag.map((q) => q.split(':'));
        }
        return query;
    }
    async getAllToggles(req, res) {
        const query = await this.prepQuery(req.query);
        const { user } = req;
        const features = await this.service.getFeatureToggles(query, user.id);
        this.openApiService.respondWithValidation(200, res, features_schema_1.featuresSchema.$id, { version, features: (0, serialize_dates_1.serializeDates)(features) });
    }
    async getToggle(req, res) {
        const name = req.params.featureName;
        const feature = await this.service.getFeatureToggleLegacy(name);
        res.json(feature).end();
    }
    async listTags(req, res) {
        const tags = await this.tagService.listTags(req.params.featureName);
        res.json({ version, tags });
    }
    async addTag(req, res) {
        const { featureName } = req.params;
        const userName = (0, extract_user_1.extractUsername)(req);
        const tag = await this.tagService.addTag(featureName, req.body, userName);
        res.status(201).header('location', `${featureName}/tags`).json(tag);
    }
    async updateTags(req, res) {
        const { featureName } = req.params;
        const { addedTags, removedTags } = req.body;
        const userName = (0, extract_user_1.extractUsername)(req);
        await Promise.all(addedTags.map((addedTag) => this.tagService.addTag(featureName, addedTag, userName)));
        await Promise.all(removedTags.map((removedTag) => this.tagService.removeTag(featureName, removedTag, userName)));
        const tags = await this.tagService.listTags(featureName);
        res.json({ version, tags });
    }
    // TODO
    async removeTag(req, res) {
        const { featureName, type, value } = req.params;
        const userName = (0, extract_user_1.extractUsername)(req);
        await this.tagService.removeTag(featureName, { type, value }, userName);
        res.status(200).end();
    }
    async validate(req, res) {
        const { name } = req.body;
        await this.service.validateName(name);
        res.status(200).end();
    }
    async createToggle(req, res) {
        const userName = (0, extract_user_1.extractUsername)(req);
        const toggle = req.body;
        const validatedToggle = await feature_schema_1.featureSchema.validateAsync(toggle);
        const { enabled, project, name, variants = [] } = validatedToggle;
        const createdFeature = await this.service.createFeatureToggle(project, validatedToggle, userName, true);
        const strategies = await Promise.all((toggle.strategies ?? []).map(async (s) => this.service.createStrategy(s, {
            projectId: project,
            featureName: name,
            environment: constants_1.DEFAULT_ENV,
        }, userName, req.user)));
        await this.service.updateEnabled(project, name, constants_1.DEFAULT_ENV, enabled, userName);
        await this.service.saveVariants(name, project, variants, userName);
        res.status(201).json({
            ...createdFeature,
            variants,
            enabled,
            strategies,
        });
    }
    async updateToggle(req, res) {
        const { featureName } = req.params;
        const userName = (0, extract_user_1.extractUsername)(req);
        const updatedFeature = req.body;
        updatedFeature.name = featureName;
        const projectId = await this.service.getProjectId(featureName);
        const value = await feature_schema_1.featureSchema.validateAsync(updatedFeature);
        await this.service.updateFeatureToggle(projectId, value, userName, featureName);
        await this.service.removeAllStrategiesForEnv(featureName);
        if (updatedFeature.strategies) {
            await Promise.all(updatedFeature.strategies.map(async (s) => this.service.createStrategy(s, { projectId, featureName, environment: constants_1.DEFAULT_ENV }, userName, req.user)));
        }
        await this.service.updateEnabled(projectId, featureName, constants_1.DEFAULT_ENV, updatedFeature.enabled, userName);
        await this.service.saveVariants(featureName, projectId, value.variants || [], userName);
        const feature = await this.service.storeFeatureUpdatedEventLegacy(featureName, userName);
        res.status(200).json(feature);
    }
    /**
     * @deprecated TODO: remove?
     *
     * Kept to keep backward compatibility
     */
    async toggle(req, res) {
        const userName = (0, extract_user_1.extractUsername)(req);
        const { featureName } = req.params;
        const projectId = await this.service.getProjectId(featureName);
        const feature = await this.service.toggle(projectId, featureName, constants_1.DEFAULT_ENV, userName);
        await this.service.storeFeatureUpdatedEventLegacy(featureName, userName);
        res.status(200).json(feature);
    }
    async toggleOn(req, res) {
        const { featureName } = req.params;
        const userName = (0, extract_user_1.extractUsername)(req);
        const projectId = await this.service.getProjectId(featureName);
        const feature = await this.service.updateEnabled(projectId, featureName, constants_1.DEFAULT_ENV, true, userName);
        await this.service.storeFeatureUpdatedEventLegacy(featureName, userName);
        res.json(feature);
    }
    async toggleOff(req, res) {
        const { featureName } = req.params;
        const userName = (0, extract_user_1.extractUsername)(req);
        const projectId = await this.service.getProjectId(featureName);
        const feature = await this.service.updateEnabled(projectId, featureName, constants_1.DEFAULT_ENV, false, userName);
        await this.service.storeFeatureUpdatedEventLegacy(featureName, userName);
        res.json(feature);
    }
    async staleOn(req, res) {
        const { featureName } = req.params;
        const userName = (0, extract_user_1.extractUsername)(req);
        await this.service.updateStale(featureName, true, userName);
        const feature = await this.service.getFeatureToggleLegacy(featureName);
        res.json(feature);
    }
    async staleOff(req, res) {
        const { featureName } = req.params;
        const userName = (0, extract_user_1.extractUsername)(req);
        await this.service.updateStale(featureName, false, userName);
        const feature = await this.service.getFeatureToggleLegacy(featureName);
        res.json(feature);
    }
    async archiveToggle(req, res) {
        const { featureName } = req.params;
        const userName = (0, extract_user_1.extractUsername)(req);
        await this.service.archiveToggle(featureName, userName);
        res.status(200).end();
    }
}
exports.default = FeatureController;
//# sourceMappingURL=feature.js.map