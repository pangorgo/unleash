"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const permissions_1 = require("../types/permissions");
function findParam(name, { params, body }, defaultValue) {
    let found = params ? params[name] : undefined;
    if (found === undefined) {
        found = body ? body[name] : undefined;
    }
    return found || defaultValue;
}
const rbacMiddleware = (config, { featureToggleStore }, accessService) => {
    const logger = config.getLogger('/middleware/rbac-middleware.ts');
    logger.debug('Enabling RBAC middleware');
    return (req, res, next) => {
        req.checkRbac = async (permissions) => {
            const permissionsArray = Array.isArray(permissions)
                ? permissions
                : [permissions];
            const { user, params } = req;
            if (!user) {
                logger.error('RBAC requires a user to exist on the request.');
                return false;
            }
            if (user.isAPI) {
                return user.permissions.includes(permissions_1.ADMIN);
            }
            if (!user.id) {
                logger.error('RBAC requires the user to have a unique id.');
                return false;
            }
            let projectId = findParam('projectId', req) || findParam('project', req);
            let environment = findParam('environment', req) ||
                findParam('environmentId', req);
            // Temporary workaround to figure out projectId for feature toggle updates.
            // will be removed in Unleash v5.0
            if (!projectId &&
                permissionsArray.some((permission) => [permissions_1.DELETE_FEATURE, permissions_1.UPDATE_FEATURE].includes(permission))) {
                const { featureName } = params;
                projectId = await featureToggleStore.getProjectId(featureName);
            }
            else if (projectId === undefined &&
                permissionsArray.some((permission) => permission == permissions_1.CREATE_FEATURE ||
                    permission.endsWith('FEATURE_STRATEGY'))) {
                projectId = 'default';
            }
            return accessService.hasPermission(user, permissionsArray, projectId, environment);
        };
        return next();
    };
};
exports.default = rbacMiddleware;
//# sourceMappingURL=rbac-middleware.js.map