"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mime = __importStar(require("mime"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const multer_1 = __importDefault(require("multer"));
const date_fns_1 = require("date-fns");
const controller_1 = __importDefault(require("../controller"));
const permissions_1 = require("../../types/permissions");
const extract_user_1 = require("../../util/extract-user");
const create_request_schema_1 = require("../../openapi/util/create-request-schema");
const create_response_schema_1 = require("../../openapi/util/create-response-schema");
const export_query_parameters_1 = require("../../openapi/spec/export-query-parameters");
const standard_responses_1 = require("../../openapi/util/standard-responses");
const upload = (0, multer_1.default)({ limits: { fileSize: 5242880 } });
const paramToBool = (param, def) => {
    if (typeof param === 'boolean') {
        return param;
    }
    if (param === null || param === undefined) {
        return def;
    }
    const nu = Number.parseInt(param, 10);
    if (Number.isNaN(nu)) {
        return param.toLowerCase() === 'true';
    }
    return Boolean(nu);
};
class StateController extends controller_1.default {
    constructor(config, { stateService, openApiService, }) {
        super(config);
        this.logger = config.getLogger('/admin-api/state.ts');
        this.stateService = stateService;
        this.openApiService = openApiService;
        this.fileupload('/import', upload.single('file'), this.import, permissions_1.ADMIN);
        this.route({
            method: 'post',
            path: '/import',
            permission: permissions_1.ADMIN,
            handler: this.import,
            middleware: [
                this.openApiService.validPath({
                    tags: ['Import/Export'],
                    operationId: 'import',
                    deprecated: true,
                    summary: 'Import state (deprecated)',
                    description: 'Imports state into the system. Deprecated in favor of /api/admin/features-batch/import',
                    responses: {
                        202: standard_responses_1.emptyResponse,
                    },
                    requestBody: (0, create_request_schema_1.createRequestSchema)('stateSchema'),
                }),
            ],
        });
        this.route({
            method: 'get',
            path: '/export',
            permission: permissions_1.ADMIN,
            handler: this.export,
            middleware: [
                this.openApiService.validPath({
                    tags: ['Import/Export'],
                    operationId: 'export',
                    deprecated: true,
                    summary: 'Export state (deprecated)',
                    description: 'Exports the current state of the system. Deprecated in favor of /api/admin/features-batch/export',
                    responses: {
                        200: (0, create_response_schema_1.createResponseSchema)('stateSchema'),
                    },
                    parameters: export_query_parameters_1.exportQueryParameters,
                }),
            ],
        });
    }
    async import(req, res) {
        const userName = (0, extract_user_1.extractUsername)(req);
        const { drop, keep } = req.query;
        // TODO: Should override request type so file is a type on request
        let data;
        // @ts-expect-error
        if (req.file) {
            // @ts-expect-error
            if (mime.getType(req.file.originalname) === 'text/yaml') {
                // @ts-expect-error
                data = js_yaml_1.default.load(req.file.buffer);
            }
            else {
                // @ts-expect-error
                data = JSON.parse(req.file.buffer);
            }
        }
        else {
            data = req.body;
        }
        await this.stateService.import({
            data,
            userName,
            dropBeforeImport: paramToBool(drop, false),
            keepExisting: paramToBool(keep, true),
        });
        res.sendStatus(202);
    }
    async export(req, res) {
        const { format } = req.query;
        const downloadFile = paramToBool(req.query.download, false);
        const includeStrategies = paramToBool(req.query.strategies, true);
        const includeFeatureToggles = paramToBool(req.query.featureToggles, true);
        const includeProjects = paramToBool(req.query.projects, true);
        const includeTags = paramToBool(req.query.tags, true);
        const includeEnvironments = paramToBool(req.query.environments, true);
        const data = await this.stateService.export({
            includeStrategies,
            includeFeatureToggles,
            includeProjects,
            includeTags,
            includeEnvironments,
        });
        const timestamp = (0, date_fns_1.format)(Date.now(), 'yyyy-MM-dd_HH-mm-ss');
        if (format === 'yaml') {
            if (downloadFile) {
                res.attachment(`export-${timestamp}.yml`);
            }
            res.type('yaml').send(js_yaml_1.default.dump(data, { skipInvalid: true }));
        }
        else {
            if (downloadFile) {
                res.attachment(`export-${timestamp}.json`);
            }
            res.json(data);
        }
    }
}
exports.default = StateController;
//# sourceMappingURL=state.js.map