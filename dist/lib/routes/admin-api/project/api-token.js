"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectApiTokenController = void 0;
const openapi_1 = require("../../../openapi");
const standard_responses_1 = require("../../../openapi/util/standard-responses");
const types_1 = require("../../../types");
const api_token_1 = require("../../../types/models/api-token");
const util_1 = require("../../../util");
const controller_1 = __importDefault(require("../../controller"));
const crypto_1 = require("crypto");
const api_token_schema_1 = require("../../../schema/api-token-schema");
const error_1 = require("../../../error");
const PATH = '/:projectId/api-tokens';
const PATH_TOKEN = `${PATH}/:token`;
class ProjectApiTokenController extends controller_1.default {
    constructor(config, { apiTokenService, accessService, proxyService, openApiService, }) {
        super(config);
        this.apiTokenService = apiTokenService;
        this.accessService = accessService;
        this.proxyService = proxyService;
        this.openApiService = openApiService;
        this.logger = config.getLogger('project-api-token-controller.js');
        this.route({
            method: 'get',
            path: PATH,
            handler: this.getProjectApiTokens,
            permission: types_1.READ_PROJECT_API_TOKEN,
            middleware: [
                openApiService.validPath({
                    tags: ['Projects'],
                    operationId: 'getProjectApiTokens',
                    summary: 'Get api tokens for project.',
                    description: 'Returns the [project API tokens](https://docs.getunleash.io/how-to/how-to-create-project-api-tokens) that have been created for this project.',
                    responses: {
                        200: (0, openapi_1.createResponseSchema)('apiTokensSchema'),
                        ...(0, standard_responses_1.getStandardResponses)(401, 403, 404),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: PATH,
            handler: this.createProjectApiToken,
            permission: types_1.CREATE_PROJECT_API_TOKEN,
            middleware: [
                openApiService.validPath({
                    tags: ['Projects'],
                    operationId: 'createProjectApiToken',
                    requestBody: (0, openapi_1.createRequestSchema)('createApiTokenSchema'),
                    summary: 'Create a project API token.',
                    description: 'Endpoint that allows creation of [project API tokens](https://docs.getunleash.io/reference/api-tokens-and-client-keys#api-token-visibility) for the specified project.',
                    responses: {
                        201: (0, openapi_1.resourceCreatedResponseSchema)('apiTokenSchema'),
                        ...(0, standard_responses_1.getStandardResponses)(400, 401, 403),
                    },
                }),
            ],
        });
        this.route({
            method: 'delete',
            path: PATH_TOKEN,
            handler: this.deleteProjectApiToken,
            acceptAnyContentType: true,
            permission: types_1.DELETE_PROJECT_API_TOKEN,
            middleware: [
                openApiService.validPath({
                    tags: ['Projects'],
                    operationId: 'deleteProjectApiToken',
                    summary: 'Delete a project API token.',
                    description: `This operation deletes the API token specified in the request URL. If the token doesn't exist, returns an OK response (status code 200).`,
                    responses: {
                        200: openapi_1.emptyResponse,
                        ...(0, standard_responses_1.getStandardResponses)(401, 403),
                    },
                }),
            ],
        });
    }
    async getProjectApiTokens(req, res) {
        const { user } = req;
        const { projectId } = req.params;
        const projectTokens = await this.accessibleTokens(user, projectId);
        this.openApiService.respondWithValidation(200, res, openapi_1.apiTokensSchema.$id, { tokens: (0, types_1.serializeDates)(projectTokens) });
    }
    async createProjectApiToken(req, res) {
        const createToken = await api_token_schema_1.createApiToken.validateAsync(req.body);
        const { projectId } = req.params;
        const permissionRequired = types_1.CREATE_PROJECT_API_TOKEN;
        const hasPermission = await this.accessService.hasPermission(req.user, permissionRequired, projectId);
        if (!hasPermission) {
            throw new error_1.OperationDeniedError(`You don't have the necessary access [${permissionRequired}] to perform this operation]`);
        }
        if (!createToken.project) {
            createToken.project = projectId;
        }
        if (createToken.projects.length === 1 &&
            createToken.projects[0] === projectId) {
            const token = await this.apiTokenService.createApiToken(createToken, (0, util_1.extractUsername)(req));
            this.openApiService.respondWithValidation(201, res, openapi_1.apiTokenSchema.$id, (0, types_1.serializeDates)(token), { location: `api-tokens` });
        }
        else {
            res.statusMessage =
                'Project level tokens can only be created for one project';
            res.status(400);
        }
    }
    async deleteProjectApiToken(req, res) {
        const { user } = req;
        const { projectId, token } = req.params;
        const storedToken = (await this.accessibleTokens(user, projectId)).find((currentToken) => this.tokenEquals(currentToken.secret, token));
        if (storedToken &&
            (storedToken.project === projectId ||
                (storedToken.projects.length === 1 &&
                    storedToken.project[0] === projectId))) {
            await this.apiTokenService.delete(token, (0, util_1.extractUsername)(req));
            await this.proxyService.deleteClientForProxyToken(token);
            res.status(200).end();
        }
    }
    tokenEquals(token1, token2) {
        return (token1.length === token2.length &&
            (0, crypto_1.timingSafeEqual)(Buffer.from(token1), Buffer.from(token2)));
    }
    async accessibleTokens(user, project) {
        const allTokens = await this.apiTokenService.getAllTokens();
        if (user.isAPI && user.permissions.includes(types_1.ADMIN)) {
            return allTokens;
        }
        return allTokens.filter((token) => token.type !== api_token_1.ApiTokenType.ADMIN &&
            (token.project === project || token.projects.includes(project)));
    }
}
exports.ProjectApiTokenController = ProjectApiTokenController;
//# sourceMappingURL=api-token.js.map