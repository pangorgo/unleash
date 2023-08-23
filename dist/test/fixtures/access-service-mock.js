"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
const access_service_1 = require("../../lib/services/access-service");
const no_logger_1 = __importDefault(require("./no-logger"));
class AccessServiceMock extends access_service_1.AccessService {
    constructor() {
        super({
            accessStore: undefined,
            accountStore: undefined,
            roleStore: undefined,
            environmentStore: undefined,
            groupStore: undefined,
        }, { getLogger: no_logger_1.default, flagResolver: undefined }, undefined);
    }
    hasPermission(user, permission, projectId) {
        throw new Error('Method not implemented.');
    }
    getPermissions() {
        throw new Error('Method not implemented.');
    }
    addUserToRole(userId, roleId) {
        throw new Error('Method not implemented.');
    }
    setUserRootRole(userId, roleId) {
        return Promise.resolve();
    }
    addPermissionToRole(roleId, permission, projectId) {
        throw new Error('Method not implemented.');
    }
    removePermissionFromRole(roleId, permission, projectId) {
        throw new Error('Method not implemented.');
    }
    getRoles() {
        throw new Error('Method not implemented.');
    }
    getRolesForProject(projectId) {
        throw new Error('Method not implemented.');
    }
    getRolesForUser(userId) {
        throw new Error('Method not implemented.');
    }
    getUsersForRole(roleId) {
        throw new Error('Method not implemented.');
    }
    getProjectRoleAccess(projectId) {
        throw new Error('Method not implemented.');
    }
    createDefaultProjectRoles(owner, projectId) {
        throw new Error('Method not implemented.');
    }
    removeDefaultProjectRoles(owner, projectId) {
        throw new Error('Method not implemented.');
    }
}
exports.default = AccessServiceMock;
//# sourceMappingURL=access-service-mock.js.map