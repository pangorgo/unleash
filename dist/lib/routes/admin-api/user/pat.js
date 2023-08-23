"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../../controller"));
const create_request_schema_1 = require("../../../openapi/util/create-request-schema");
const create_response_schema_1 = require("../../../openapi/util/create-response-schema");
const standard_responses_1 = require("../../../openapi/util/standard-responses");
const standard_responses_2 = require("../../../openapi/util/standard-responses");
const permissions_1 = require("../../../types/permissions");
const serialize_dates_1 = require("../../../types/serialize-dates");
const pat_schema_1 = require("../../../openapi/spec/pat-schema");
const pats_schema_1 = require("../../../openapi/spec/pats-schema");
class PatController extends controller_1.default {
    constructor(config, { openApiService, patService, }) {
        super(config);
        this.logger = config.getLogger('lib/routes/auth/pat-controller.ts');
        this.flagResolver = config.flagResolver;
        this.openApiService = openApiService;
        this.patService = patService;
        this.route({
            method: 'get',
            path: '',
            handler: this.getPats,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    tags: ['Personal access tokens'],
                    operationId: 'getPats',
                    summary: 'Get all Personal Access Tokens for the current user.',
                    description: 'Returns all of the [Personal Access Tokens](https://docs.getunleash.io/how-to/how-to-create-personal-access-tokens) belonging to the current user.',
                    responses: {
                        200: (0, create_response_schema_1.createResponseSchema)('patsSchema'),
                        ...(0, standard_responses_1.getStandardResponses)(401, 403, 404),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: '',
            handler: this.createPat,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    tags: ['Personal access tokens'],
                    operationId: 'createPat',
                    summary: 'Create a new Personal Access Token.',
                    description: 'Creates a new [Personal Access Token](https://docs.getunleash.io/how-to/how-to-create-personal-access-tokens) for the current user.',
                    requestBody: (0, create_request_schema_1.createRequestSchema)('patSchema'),
                    responses: {
                        201: (0, create_response_schema_1.resourceCreatedResponseSchema)('patSchema'),
                        ...(0, standard_responses_1.getStandardResponses)(401, 403, 404),
                    },
                }),
            ],
        });
        this.route({
            method: 'delete',
            path: '/:id',
            acceptAnyContentType: true,
            handler: this.deletePat,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    tags: ['Personal access tokens'],
                    operationId: 'deletePat',
                    summary: 'Delete a Personal Access Token.',
                    description: 'This endpoint allows for deleting a [Personal Access Token](https://docs.getunleash.io/how-to/how-to-create-personal-access-tokens) belonging to the current user.',
                    responses: {
                        200: standard_responses_2.emptyResponse,
                        ...(0, standard_responses_1.getStandardResponses)(401, 403, 404),
                    },
                }),
            ],
        });
    }
    async createPat(req, res) {
        if (this.flagResolver.isEnabled('personalAccessTokensKillSwitch')) {
            res.status(404).send({ message: 'PAT is disabled' });
            return;
        }
        const pat = req.body;
        const createdPat = await this.patService.createPat(pat, req.user.id, req.user);
        this.openApiService.respondWithValidation(201, res, pat_schema_1.patSchema.$id, (0, serialize_dates_1.serializeDates)(createdPat));
    }
    async getPats(req, res) {
        if (this.flagResolver.isEnabled('personalAccessTokensKillSwitch')) {
            res.status(404).send({ message: 'PAT is disabled' });
            return;
        }
        const pats = await this.patService.getAll(req.user.id);
        this.openApiService.respondWithValidation(200, res, pats_schema_1.patsSchema.$id, {
            pats: (0, serialize_dates_1.serializeDates)(pats),
        });
    }
    async deletePat(req, res) {
        const { id } = req.params;
        await this.patService.deletePat(id, req.user.id, req.user);
        res.status(200).end();
    }
}
exports.default = PatController;
//# sourceMappingURL=pat.js.map