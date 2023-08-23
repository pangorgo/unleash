"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiService = void 0;
const express_openapi_1 = __importDefault(require("@unleash/express-openapi"));
const openapi_1 = require("../openapi");
const validate_1 = require("../openapi/validate");
const bad_data_error_1 = require("../error/bad-data-error");
class OpenApiService {
    constructor(config) {
        this.config = config;
        this.flagResolver = config.flagResolver;
        this.logger = config.getLogger('openapi-service.ts');
        this.api = (0, express_openapi_1.default)(this.docsPath(), (0, openapi_1.createOpenApiSchema)(config.server), { coerce: true, extendRefs: true });
    }
    validPath(op) {
        return this.api.validPath(op);
    }
    useDocs(app) {
        app.use(this.api);
        app.use(this.docsPath(), this.api.swaggerui);
    }
    docsPath() {
        const { baseUriPath = '' } = this.config.server ?? {};
        return `${baseUriPath}/docs/openapi`;
    }
    registerCustomSchemas(schemas) {
        Object.entries(schemas).forEach(([name, schema]) => {
            this.api.schema(name, (0, openapi_1.removeJsonSchemaProps)(schema));
        });
    }
    useErrorHandler(app) {
        app.use((err, req, res, next) => {
            if (err && err.status && err.validationErrors) {
                const apiError = (0, bad_data_error_1.fromOpenApiValidationErrors)(req.body, err.validationErrors);
                res.status(apiError.statusCode).json(apiError);
            }
            else {
                next(err);
            }
        });
    }
    respondWithValidation(status, res, schema, data, headers = {}) {
        const errors = (0, validate_1.validateSchema)(schema, data);
        if (errors) {
            this.logger.debug('Invalid response:', JSON.stringify(errors, null, 4));
            if (this.flagResolver.isEnabled('strictSchemaValidation')) {
                throw new Error(JSON.stringify(errors, null, 4));
            }
        }
        Object.entries(headers).forEach(([header, value]) => res.header(header, value));
        res.status(status).json(data);
    }
}
exports.OpenApiService = OpenApiService;
//# sourceMappingURL=openapi-service.js.map