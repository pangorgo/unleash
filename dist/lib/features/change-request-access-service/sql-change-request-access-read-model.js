"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeRequestAccessReadModel = void 0;
const types_1 = require("../../types");
class ChangeRequestAccessReadModel {
    constructor(db, accessService) {
        this.db = db;
        this.accessService = accessService;
    }
    async canBypassChangeRequest(project, environment, user) {
        const [canSkipChangeRequest, changeRequestEnabled] = await Promise.all([
            user
                ? this.accessService.hasPermission(user, types_1.SKIP_CHANGE_REQUEST, project, environment)
                : Promise.resolve(false),
            this.isChangeRequestsEnabled(project, environment),
        ]);
        return canSkipChangeRequest || !changeRequestEnabled;
    }
    async canBypassChangeRequestForProject(project, user) {
        const [canSkipChangeRequest, changeRequestEnabled] = await Promise.all([
            user
                ? this.accessService.hasPermission(user, types_1.SKIP_CHANGE_REQUEST, project)
                : Promise.resolve(false),
            this.isChangeRequestsEnabledForProject(project),
        ]);
        return canSkipChangeRequest || !changeRequestEnabled;
    }
    async isChangeRequestsEnabled(project, environment) {
        const result = await this.db.raw(`SELECT EXISTS(SELECT 1
                           FROM change_request_settings
                           WHERE environment = ?
                             and project = ?) AS present`, [environment, project]);
        const { present } = result.rows[0];
        return present;
    }
    async isChangeRequestsEnabledForProject(project) {
        const result = await this.db.raw(`SELECT EXISTS(SELECT 1
                           FROM change_request_settings
                           WHERE project = ?
                           ) AS present`, [project]);
        const { present } = result.rows[0];
        return present;
    }
}
exports.ChangeRequestAccessReadModel = ChangeRequestAccessReadModel;
//# sourceMappingURL=sql-change-request-access-read-model.js.map