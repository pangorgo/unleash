"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const maintenanceMiddleware = ({ getLogger }, maintenanceService) => {
    const logger = getLogger('/middleware/maintenance-middleware.ts');
    logger.debug('Enabling Maintenance middleware');
    return async (req, res, next) => {
        const isProtectedPath = !req.path.includes('/maintenance');
        const writeMethod = ['POST', 'PUT', 'DELETE'].includes(req.method);
        if (isProtectedPath &&
            writeMethod &&
            (await maintenanceService.isMaintenanceMode())) {
            res.status(503).send({});
        }
        else {
            next();
        }
    };
};
exports.default = maintenanceMiddleware;
//# sourceMappingURL=maintenance-middleware.js.map