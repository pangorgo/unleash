"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../../controller"));
const types_1 = require("../../../types");
const openapi_1 = require("../../../openapi");
const PREFIX = '/:projectId/environments';
class EnvironmentsController extends controller_1.default {
    constructor(config, { environmentService, openApiService, }) {
        super(config);
        this.logger = config.getLogger('admin-api/project/environments.ts');
        this.environmentService = environmentService;
        this.openApiService = openApiService;
        this.route({
            method: 'post',
            path: PREFIX,
            handler: this.addEnvironmentToProject,
            permission: types_1.UPDATE_PROJECT,
            middleware: [
                openApiService.validPath({
                    tags: ['Projects'],
                    operationId: 'addEnvironmentToProject',
                    summary: 'Add an environment to a project.',
                    description: 'This endpoint adds the provided environment to the specified project, with optional support for enabling and disabling change requests for the environment and project.',
                    requestBody: (0, openapi_1.createRequestSchema)('projectEnvironmentSchema'),
                    responses: {
                        200: openapi_1.emptyResponse,
                        ...(0, openapi_1.getStandardResponses)(401, 403, 409),
                    },
                }),
            ],
        });
        this.route({
            method: 'delete',
            path: `${PREFIX}/:environment`,
            acceptAnyContentType: true,
            handler: this.removeEnvironmentFromProject,
            permission: types_1.UPDATE_PROJECT,
            middleware: [
                openApiService.validPath({
                    tags: ['Projects'],
                    operationId: 'removeEnvironmentFromProject',
                    summary: 'Remove an environment from a project.',
                    description: 'This endpoint removes the specified environment from the project.',
                    responses: {
                        200: openapi_1.emptyResponse,
                        ...(0, openapi_1.getStandardResponses)(400, 401, 403),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: `${PREFIX}/:environment/default-strategy`,
            handler: this.addDefaultStrategyToProjectEnvironment,
            permission: types_1.UPDATE_PROJECT,
            middleware: [
                openApiService.validPath({
                    tags: ['Projects'],
                    operationId: 'addDefaultStrategyToProjectEnvironment',
                    summary: 'Set environment-default strategy',
                    description: 'Adds a default strategy for this environment. Unleash will use this strategy by default when enabling a toggle. Use the wild card "*" for `:environment` to add to all environments. ',
                    requestBody: (0, openapi_1.createRequestSchema)('createFeatureStrategySchema'),
                    responses: {
                        200: (0, openapi_1.createResponseSchema)('createFeatureStrategySchema'),
                        ...(0, openapi_1.getStandardResponses)(400),
                    },
                }),
            ],
        });
    }
    async addEnvironmentToProject(req, res) {
        const { projectId } = req.params;
        const { environment } = req.body;
        await this.environmentService.addEnvironmentToProject(environment, projectId);
        res.status(200).end();
    }
    async removeEnvironmentFromProject(req, res) {
        const { projectId, environment } = req.params;
        await this.environmentService.removeEnvironmentFromProject(environment, projectId);
        res.status(200).end();
    }
    async addDefaultStrategyToProjectEnvironment(req, res) {
        const { projectId, environment } = req.params;
        const strategy = req.body;
        const saved = await this.environmentService.addDefaultStrategy(environment, projectId, strategy);
        this.openApiService.respondWithValidation(200, res, openapi_1.createFeatureStrategySchema.$id, (0, types_1.serializeDates)(saved));
    }
}
exports.default = EnvironmentsController;
//# sourceMappingURL=environments.js.map