"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../controller"));
const extract_user_1 = require("../../util/extract-user");
const permissions_1 = require("../../types/permissions");
const create_request_schema_1 = require("../../openapi/util/create-request-schema");
const create_response_schema_1 = require("../../openapi/util/create-response-schema");
const addon_schema_1 = require("../../openapi/spec/addon-schema");
const serialize_dates_1 = require("../../types/serialize-dates");
const addons_schema_1 = require("../../openapi/spec/addons-schema");
const standard_responses_1 = require("../../openapi/util/standard-responses");
const PATH = '/';
class AddonController extends controller_1.default {
    constructor(config, { addonService, openApiService }) {
        super(config);
        this.logger = config.getLogger('/admin-api/addon.ts');
        this.addonService = addonService;
        this.openApiService = openApiService;
        this.route({
            method: 'get',
            path: '',
            permission: permissions_1.NONE,
            handler: this.getAddons,
            middleware: [
                openApiService.validPath({
                    summary: 'Get all addons and providers',
                    description: 'Retrieve all addons and providers that are defined on this Unleash instance.',
                    tags: ['Addons'],
                    operationId: 'getAddons',
                    responses: {
                        ...(0, standard_responses_1.getStandardResponses)(401),
                        200: (0, create_response_schema_1.createResponseSchema)('addonsSchema'),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: '',
            handler: this.createAddon,
            permission: permissions_1.CREATE_ADDON,
            middleware: [
                openApiService.validPath({
                    summary: 'Create a new addon',
                    description: 'Create an addon instance. The addon must use one of the providers available on this Unleash instance.',
                    tags: ['Addons'],
                    operationId: 'createAddon',
                    requestBody: (0, create_request_schema_1.createRequestSchema)('addonCreateUpdateSchema'),
                    responses: {
                        200: (0, create_response_schema_1.createResponseSchema)('addonSchema'),
                        ...(0, standard_responses_1.getStandardResponses)(400, 401, 403, 413, 415),
                    },
                }),
            ],
        });
        this.route({
            method: 'get',
            path: `${PATH}:id`,
            handler: this.getAddon,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    summary: 'Get a specific addon',
                    description: 'Retrieve information about the addon whose ID matches the ID in the request URL.',
                    tags: ['Addons'],
                    operationId: 'getAddon',
                    responses: {
                        200: (0, create_response_schema_1.createResponseSchema)('addonSchema'),
                        ...(0, standard_responses_1.getStandardResponses)(401),
                    },
                }),
            ],
        });
        this.route({
            method: 'put',
            path: `${PATH}:id`,
            handler: this.updateAddon,
            permission: permissions_1.UPDATE_ADDON,
            middleware: [
                openApiService.validPath({
                    summary: 'Update an addon',
                    description: `Update the addon with a specific ID. Any fields in the update object will be updated. Properties that are not included in the update object will not be affected. To empty a property, pass \`null\` as that property's value.

Note: passing \`null\` as a value for the description property will set it to an empty string.`,
                    tags: ['Addons'],
                    operationId: 'updateAddon',
                    requestBody: (0, create_request_schema_1.createRequestSchema)('addonCreateUpdateSchema'),
                    responses: {
                        200: (0, create_response_schema_1.createResponseSchema)('addonSchema'),
                        ...(0, standard_responses_1.getStandardResponses)(400, 401, 403, 404, 413, 415),
                    },
                }),
            ],
        });
        this.route({
            method: 'delete',
            path: `${PATH}:id`,
            handler: this.deleteAddon,
            acceptAnyContentType: true,
            permission: permissions_1.DELETE_ADDON,
            middleware: [
                openApiService.validPath({
                    summary: 'Delete an addon',
                    description: 'Delete the addon specified by the ID in the request path.',
                    tags: ['Addons'],
                    operationId: 'deleteAddon',
                    responses: {
                        200: standard_responses_1.emptyResponse,
                        ...(0, standard_responses_1.getStandardResponses)(401, 403, 404),
                    },
                }),
            ],
        });
    }
    async getAddons(req, res) {
        const addons = await this.addonService.getAddons();
        const providers = this.addonService.getProviderDefinitions();
        this.openApiService.respondWithValidation(200, res, addons_schema_1.addonsSchema.$id, {
            addons: (0, serialize_dates_1.serializeDates)(addons),
            providers: (0, serialize_dates_1.serializeDates)(providers),
        });
    }
    async getAddon(req, res) {
        const { id } = req.params;
        const addon = await this.addonService.getAddon(id);
        this.openApiService.respondWithValidation(200, res, addon_schema_1.addonSchema.$id, (0, serialize_dates_1.serializeDates)(addon));
    }
    async updateAddon(req, res) {
        const { id } = req.params;
        const createdBy = (0, extract_user_1.extractUsername)(req);
        const data = req.body;
        const addon = await this.addonService.updateAddon(id, data, createdBy);
        this.openApiService.respondWithValidation(200, res, addon_schema_1.addonSchema.$id, (0, serialize_dates_1.serializeDates)(addon));
    }
    async createAddon(req, res) {
        const createdBy = (0, extract_user_1.extractUsername)(req);
        const data = req.body;
        const addon = await this.addonService.createAddon(data, createdBy);
        this.openApiService.respondWithValidation(201, res, addon_schema_1.addonSchema.$id, (0, serialize_dates_1.serializeDates)(addon));
    }
    async deleteAddon(req, res) {
        const { id } = req.params;
        const username = (0, extract_user_1.extractUsername)(req);
        await this.addonService.removeAddon(id, username);
        res.status(200).end();
    }
}
exports.default = AddonController;
module.exports = AddonController;
//# sourceMappingURL=addon.js.map