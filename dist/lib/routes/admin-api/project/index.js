"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../../controller"));
const types_1 = require("../../../types");
const project_features_1 = __importDefault(require("./project-features"));
const environments_1 = __importDefault(require("./environments"));
const health_report_1 = __importDefault(require("./health-report"));
const variants_1 = __importDefault(require("./variants"));
const openapi_1 = require("../../../openapi");
const standard_responses_1 = require("../../../openapi/util/standard-responses");
const api_token_1 = require("./api-token");
const project_archive_1 = __importDefault(require("./project-archive"));
const transaction_1 = require("../../../db/transaction");
class ProjectApi extends controller_1.default {
    constructor(config, services, db) {
        super(config);
        this.projectService = services.projectService;
        this.openApiService = services.openApiService;
        this.settingService = services.settingService;
        this.route({
            path: '',
            method: 'get',
            handler: this.getProjects,
            permission: types_1.NONE,
            middleware: [
                services.openApiService.validPath({
                    tags: ['Projects'],
                    operationId: 'getProjects',
                    summary: 'Get a list of all projects.',
                    description: 'This endpoint returns an list of all the projects in the Unleash instance.',
                    responses: {
                        200: (0, openapi_1.createResponseSchema)('projectsSchema'),
                        ...(0, standard_responses_1.getStandardResponses)(401, 403),
                    },
                }),
            ],
        });
        this.route({
            method: 'get',
            path: '/:projectId',
            handler: this.getProjectOverview,
            permission: types_1.NONE,
            middleware: [
                services.openApiService.validPath({
                    tags: ['Projects'],
                    operationId: 'getProjectOverview',
                    summary: 'Get an overview of a project.',
                    description: 'This endpoint returns an overview of the specified projects stats, project health, number of members, which environments are configured, and the features in the project.',
                    responses: {
                        200: (0, openapi_1.createResponseSchema)('projectOverviewSchema'),
                        ...(0, standard_responses_1.getStandardResponses)(401, 403, 404),
                    },
                }),
            ],
        });
        this.use('/', new project_features_1.default(config, services, (0, transaction_1.createKnexTransactionStarter)(db)).router);
        this.use('/', new environments_1.default(config, services).router);
        this.use('/', new health_report_1.default(config, services).router);
        this.use('/', new variants_1.default(config, services).router);
        this.use('/', new api_token_1.ProjectApiTokenController(config, services).router);
        this.use('/', new project_archive_1.default(config, services).router);
    }
    async getProjects(req, res) {
        const { user } = req;
        const projects = await this.projectService.getProjects({
            id: 'default',
        }, user.id);
        this.openApiService.respondWithValidation(200, res, openapi_1.projectsSchema.$id, { version: 1, projects: (0, types_1.serializeDates)(projects) });
    }
    async getProjectOverview(req, res) {
        const { projectId } = req.params;
        const { archived } = req.query;
        const { user } = req;
        const overview = await this.projectService.getProjectOverview(projectId, archived, user.id);
        this.openApiService.respondWithValidation(200, res, openapi_1.projectOverviewSchema.$id, (0, types_1.serializeDates)(overview));
    }
}
exports.default = ProjectApi;
//# sourceMappingURL=index.js.map