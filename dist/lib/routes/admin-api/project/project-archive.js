"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../../types");
const extract_user_1 = require("../../../util/extract-user");
const permissions_1 = require("../../../types/permissions");
const standard_responses_1 = require("../../../openapi/util/standard-responses");
const openapi_1 = require("../../../openapi");
const controller_1 = __importDefault(require("../../controller"));
const PATH = '/:projectId';
const PATH_ARCHIVE = `${PATH}/archive`;
const PATH_DELETE = `${PATH}/delete`;
const PATH_REVIVE = `${PATH}/revive`;
class ProjectArchiveController extends controller_1.default {
    constructor(config, { featureToggleServiceV2, openApiService, }) {
        super(config);
        this.logger = config.getLogger('/admin-api/archive.js');
        this.featureService = featureToggleServiceV2;
        this.openApiService = openApiService;
        this.flagResolver = config.flagResolver;
        this.route({
            method: 'post',
            path: PATH_DELETE,
            acceptAnyContentType: true,
            handler: this.deleteFeatures,
            permission: permissions_1.DELETE_FEATURE,
            middleware: [
                openApiService.validPath({
                    tags: ['Archive'],
                    operationId: 'deleteFeatures',
                    description: 'This endpoint deletes the specified features, that are in archive.',
                    summary: 'Deletes a list of features',
                    requestBody: (0, openapi_1.createRequestSchema)('batchFeaturesSchema'),
                    responses: {
                        200: standard_responses_1.emptyResponse,
                        ...(0, standard_responses_1.getStandardResponses)(400, 401, 403),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: PATH_REVIVE,
            acceptAnyContentType: true,
            handler: this.reviveFeatures,
            permission: types_1.UPDATE_FEATURE,
            middleware: [
                openApiService.validPath({
                    tags: ['Archive'],
                    operationId: 'reviveFeatures',
                    description: 'This endpoint revives the specified features.',
                    summary: 'Revives a list of features',
                    requestBody: (0, openapi_1.createRequestSchema)('batchFeaturesSchema'),
                    responses: {
                        200: standard_responses_1.emptyResponse,
                        ...(0, standard_responses_1.getStandardResponses)(400, 401, 403),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: PATH_ARCHIVE,
            handler: this.archiveFeatures,
            permission: permissions_1.DELETE_FEATURE,
            middleware: [
                openApiService.validPath({
                    tags: ['Features'],
                    operationId: 'archiveFeatures',
                    description: "This endpoint archives the specified features. Any features that are already archived or that don't exist are ignored. All existing features (whether already archived or not) that are provided must belong to the specified project.",
                    summary: 'Archives a list of features',
                    requestBody: (0, openapi_1.createRequestSchema)('batchFeaturesSchema'),
                    responses: {
                        202: standard_responses_1.emptyResponse,
                        ...(0, standard_responses_1.getStandardResponses)(400, 401, 403, 415),
                    },
                }),
            ],
        });
    }
    async deleteFeatures(req, res) {
        const { projectId } = req.params;
        const { features } = req.body;
        const user = (0, extract_user_1.extractUsername)(req);
        await this.featureService.deleteFeatures(features, projectId, user);
        res.status(200).end();
    }
    async reviveFeatures(req, res) {
        const { projectId } = req.params;
        const { features } = req.body;
        const user = (0, extract_user_1.extractUsername)(req);
        await this.featureService.reviveFeatures(features, projectId, user);
        res.status(200).end();
    }
    async archiveFeatures(req, res) {
        const { features } = req.body;
        const { projectId } = req.params;
        const userName = (0, extract_user_1.extractUsername)(req);
        await this.featureService.archiveToggles(features, userName, projectId);
        res.status(202).end();
    }
}
exports.default = ProjectArchiveController;
module.exports = ProjectArchiveController;
//# sourceMappingURL=project-archive.js.map