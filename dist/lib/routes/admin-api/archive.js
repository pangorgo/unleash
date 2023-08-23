"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../controller"));
const extract_user_1 = require("../../util/extract-user");
const permissions_1 = require("../../types/permissions");
const features_schema_1 = require("../../openapi/spec/features-schema");
const serialize_dates_1 = require("../../types/serialize-dates");
const create_response_schema_1 = require("../../openapi/util/create-response-schema");
const standard_responses_1 = require("../../openapi/util/standard-responses");
class ArchiveController extends controller_1.default {
    constructor(config, { featureToggleServiceV2, openApiService, }) {
        super(config);
        this.featureService = featureToggleServiceV2;
        this.openApiService = openApiService;
        this.route({
            method: 'get',
            path: '/features',
            handler: this.getArchivedFeatures,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    tags: ['Archive'],
                    summary: 'Get archived features',
                    description: 'Retrieve a list of all [archived feature toggles](https://docs.getunleash.io/reference/archived-toggles).',
                    operationId: 'getArchivedFeatures',
                    responses: {
                        200: (0, create_response_schema_1.createResponseSchema)('featuresSchema'),
                        ...(0, standard_responses_1.getStandardResponses)(401, 403),
                    },
                    deprecated: true,
                }),
            ],
        });
        this.route({
            method: 'get',
            path: '/features/:projectId',
            handler: this.getArchivedFeaturesByProjectId,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    tags: ['Archive'],
                    operationId: 'getArchivedFeaturesByProjectId',
                    summary: 'Get archived features in project',
                    description: 'Retrieves a list of archived features that belong to the provided project.',
                    responses: {
                        200: (0, create_response_schema_1.createResponseSchema)('featuresSchema'),
                        ...(0, standard_responses_1.getStandardResponses)(401, 403),
                    },
                    deprecated: true,
                }),
            ],
        });
        this.route({
            method: 'delete',
            path: '/:featureName',
            acceptAnyContentType: true,
            handler: this.deleteFeature,
            permission: permissions_1.DELETE_FEATURE,
            middleware: [
                openApiService.validPath({
                    tags: ['Archive'],
                    description: 'This endpoint archives the specified feature.',
                    summary: 'Archives a feature',
                    operationId: 'deleteFeature',
                    responses: {
                        200: standard_responses_1.emptyResponse,
                        ...(0, standard_responses_1.getStandardResponses)(401, 403),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: '/revive/:featureName',
            acceptAnyContentType: true,
            handler: this.reviveFeature,
            permission: permissions_1.UPDATE_FEATURE,
            middleware: [
                openApiService.validPath({
                    tags: ['Archive'],
                    description: 'This endpoint revives the specified feature from archive.',
                    summary: 'Revives a feature',
                    operationId: 'reviveFeature',
                    responses: {
                        200: standard_responses_1.emptyResponse,
                        ...(0, standard_responses_1.getStandardResponses)(400, 401, 403),
                    },
                }),
            ],
        });
    }
    async getArchivedFeatures(req, res) {
        const features = await this.featureService.getMetadataForAllFeatures(true);
        this.openApiService.respondWithValidation(200, res, features_schema_1.featuresSchema.$id, { version: 2, features: (0, serialize_dates_1.serializeDates)(features) });
    }
    async getArchivedFeaturesByProjectId(req, res) {
        const { projectId } = req.params;
        const features = await this.featureService.getMetadataForAllFeaturesByProjectId(true, projectId);
        this.openApiService.respondWithValidation(200, res, features_schema_1.featuresSchema.$id, { version: 2, features: (0, serialize_dates_1.serializeDates)(features) });
    }
    async deleteFeature(req, res) {
        const { featureName } = req.params;
        const user = (0, extract_user_1.extractUsername)(req);
        await this.featureService.deleteFeature(featureName, user);
        res.status(200).end();
    }
    async reviveFeature(req, res) {
        const userName = (0, extract_user_1.extractUsername)(req);
        const { featureName } = req.params;
        await this.featureService.reviveToggle(featureName, userName);
        res.status(200).end();
    }
}
exports.default = ArchiveController;
module.exports = ArchiveController;
//# sourceMappingURL=archive.js.map