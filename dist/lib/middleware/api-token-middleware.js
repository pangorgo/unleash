"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NO_TOKEN_WHERE_TOKEN_WAS_REQUIRED = exports.TOKEN_TYPE_ERROR_MESSAGE = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const api_token_1 = require("../types/models/api-token");
const isClientApi = ({ path }) => {
    return path && path.indexOf('/api/client') > -1;
};
const isProxyApi = ({ path }) => {
    if (!path) {
        return;
    }
    // Handle all our current proxy paths which will redirect to the new
    // embedded proxy endpoint
    return (path.indexOf('/api/proxy') > -1 ||
        path.indexOf('/api/development/proxy') > -1 ||
        path.indexOf('/api/production/proxy') > -1 ||
        path.indexOf('/api/frontend') > -1);
};
exports.TOKEN_TYPE_ERROR_MESSAGE = 'invalid token: expected a different token type for this endpoint';
exports.NO_TOKEN_WHERE_TOKEN_WAS_REQUIRED = 'This endpoint requires an API token. Please add an authorization header to your request with a valid token';
const apiAccessMiddleware = ({ getLogger, authentication, flagResolver, }, { apiTokenService }) => {
    const logger = getLogger('/middleware/api-token.ts');
    logger.debug('Enabling api-token middleware');
    if (!authentication.enableApiToken) {
        return (req, res, next) => next();
    }
    return (req, res, next) => {
        if (req.user) {
            return next();
        }
        try {
            const apiToken = req.header('authorization');
            if (!apiToken?.startsWith('user:')) {
                const apiUser = apiTokenService.getUserForToken(apiToken);
                const { CLIENT, FRONTEND } = api_token_1.ApiTokenType;
                if (apiUser) {
                    if ((apiUser.type === CLIENT && !isClientApi(req)) ||
                        (apiUser.type === FRONTEND && !isProxyApi(req)) ||
                        (apiUser.type === FRONTEND &&
                            !flagResolver.isEnabled('embedProxy'))) {
                        res.status(403).send({
                            message: exports.TOKEN_TYPE_ERROR_MESSAGE,
                        });
                        return;
                    }
                    req.user = apiUser;
                }
                else if (isClientApi(req) || isProxyApi(req)) {
                    // If we're here, we know that api token middleware was enabled, otherwise we'd returned a no-op middleware
                    // We explicitly only protect client and proxy apis, since admin apis are protected by our permission checker
                    // Reject with 401
                    res.status(401).send({
                        message: exports.NO_TOKEN_WHERE_TOKEN_WAS_REQUIRED,
                    });
                    return;
                }
            }
        }
        catch (error) {
            logger.warn(error);
        }
        next();
    };
};
exports.default = apiAccessMiddleware;
//# sourceMappingURL=api-token-middleware.js.map