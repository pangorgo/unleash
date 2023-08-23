"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const serve_favicon_1 = __importDefault(require("serve-favicon"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const errorhandler_1 = __importDefault(require("errorhandler"));
const response_time_metrics_1 = require("./middleware/response-time-metrics");
const cors_origin_middleware_1 = require("./middleware/cors-origin-middleware");
const rbac_middleware_1 = __importDefault(require("./middleware/rbac-middleware"));
const api_token_middleware_1 = __importDefault(require("./middleware/api-token-middleware"));
const option_1 = require("./types/option");
const routes_1 = __importDefault(require("./routes"));
const request_logger_1 = __importDefault(require("./middleware/request-logger"));
const demo_authentication_1 = __importDefault(require("./middleware/demo-authentication"));
const oss_authentication_1 = __importDefault(require("./middleware/oss-authentication"));
const no_authentication_1 = __importDefault(require("./middleware/no-authentication"));
const secure_headers_1 = __importDefault(require("./middleware/secure-headers"));
const load_index_html_1 = require("./util/load-index-html");
const findPublicFolder_1 = require("./util/findPublicFolder");
const conditional_middleware_1 = require("./middleware/conditional-middleware");
const pat_middleware_1 = __importDefault(require("./middleware/pat-middleware"));
const maintenance_middleware_1 = __importDefault(require("./middleware/maintenance-middleware"));
const unless_middleware_1 = require("./middleware/unless-middleware");
const catch_all_error_handler_1 = require("./middleware/catch-all-error-handler");
const notfound_error_1 = __importDefault(require("./error/notfound-error"));
async function getApp(config, stores, services, unleashSession, db) {
    const app = (0, express_1.default)();
    const baseUriPath = config.server.baseUriPath || '';
    const publicFolder = config.publicFolder || (0, findPublicFolder_1.findPublicFolder)();
    let indexHTML = await (0, load_index_html_1.loadIndexHTML)(config, publicFolder);
    app.set('trust proxy', true);
    app.disable('x-powered-by');
    app.set('port', config.server.port);
    app.locals.baseUriPath = baseUriPath;
    if (config.server.serverMetrics && config.eventBus) {
        app.use((0, response_time_metrics_1.responseTimeMetrics)(config.eventBus, config.flagResolver, services.instanceStatsService));
    }
    app.use((0, request_logger_1.default)(config));
    if (typeof config.preHook === 'function') {
        config.preHook(app, config, services, db);
    }
    app.use((0, compression_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.use((req, res, next) => {
        req.url = req.url.replace(/\/+/g, '/');
        next();
    });
    app.use(`${baseUriPath}/api/admin/features-batch`, express_1.default.json({ strict: false, limit: '500kB' }));
    app.use((0, unless_middleware_1.unless)(`${baseUriPath}/api/admin/features-batch`, express_1.default.json({ strict: false })));
    if (unleashSession) {
        app.use(unleashSession);
    }
    app.use((0, secure_headers_1.default)(config));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, serve_favicon_1.default)(path_1.default.join(publicFolder, 'favicon.ico')));
    app.use(baseUriPath, (0, serve_favicon_1.default)(path_1.default.join(publicFolder, 'favicon.ico')));
    app.use(baseUriPath, express_1.default.static(publicFolder, { index: false }));
    if (config.enableOAS) {
        app.use(`${baseUriPath}/oas`, express_1.default.static('docs/api/oas'));
    }
    if (config.enableOAS && services.openApiService) {
        services.openApiService.useDocs(app);
    }
    // Support CORS preflight requests for the frontend endpoints.
    // Preflight requests should not have Authorization headers,
    // so this must be handled before the API token middleware.
    app.options(`${baseUriPath}/api/frontend*`, (0, conditional_middleware_1.conditionalMiddleware)(() => config.flagResolver.isEnabled('embedProxy'), (0, cors_origin_middleware_1.corsOriginMiddleware)(services, config)));
    app.use(baseUriPath, (0, pat_middleware_1.default)(config, services));
    switch (config.authentication.type) {
        case option_1.IAuthType.OPEN_SOURCE: {
            app.use(baseUriPath, (0, api_token_middleware_1.default)(config, services));
            (0, oss_authentication_1.default)(app, config.getLogger, config.server.baseUriPath);
            break;
        }
        case option_1.IAuthType.ENTERPRISE: {
            app.use(baseUriPath, (0, api_token_middleware_1.default)(config, services));
            config.authentication.customAuthHandler(app, config, services);
            break;
        }
        case option_1.IAuthType.HOSTED: {
            app.use(baseUriPath, (0, api_token_middleware_1.default)(config, services));
            config.authentication.customAuthHandler(app, config, services);
            break;
        }
        case option_1.IAuthType.DEMO: {
            app.use(baseUriPath, (0, api_token_middleware_1.default)(config, services));
            (0, demo_authentication_1.default)(app, config.server.baseUriPath, services, config);
            break;
        }
        case option_1.IAuthType.CUSTOM: {
            app.use(baseUriPath, (0, api_token_middleware_1.default)(config, services));
            config.authentication.customAuthHandler(app, config, services);
            break;
        }
        case option_1.IAuthType.NONE: {
            (0, no_authentication_1.default)(baseUriPath, app);
            break;
        }
        default: {
            app.use(baseUriPath, (0, api_token_middleware_1.default)(config, services));
            (0, demo_authentication_1.default)(app, config.server.baseUriPath, services, config);
            break;
        }
    }
    app.use(baseUriPath, (0, rbac_middleware_1.default)(config, stores, services.accessService));
    app.use(`${baseUriPath}/api/admin`, (0, maintenance_middleware_1.default)(config, services.maintenanceService));
    if (typeof config.preRouterHook === 'function') {
        config.preRouterHook(app, config, services, stores, db);
    }
    // Setup API routes
    app.use(`${baseUriPath}/`, new routes_1.default(config, services, db).router);
    if (services.openApiService) {
        services.openApiService.useErrorHandler(app);
    }
    if (process.env.NODE_ENV !== 'production') {
        app.use((0, errorhandler_1.default)());
    }
    else {
        app.use((0, catch_all_error_handler_1.catchAllErrorHandler)(config.getLogger));
    }
    app.get(`${baseUriPath}`, (req, res) => {
        res.send(indexHTML);
    });
    // handle all API 404s
    app.use(`${baseUriPath}/api`, (req, res) => {
        const error = new notfound_error_1.default(`The path you were looking for (${baseUriPath}/api${req.path}) is not available.`);
        res.status(error.statusCode).send(error);
        return;
    });
    app.get(`${baseUriPath}/*`, (req, res) => {
        res.send(indexHTML);
    });
    return app;
}
exports.default = getApp;
//# sourceMappingURL=app.js.map