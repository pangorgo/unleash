"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const no_auth_user_1 = __importDefault(require("../types/no-auth-user"));
// eslint-disable-next-line
function noneAuthentication(basePath = '', app) {
    app.use(`${basePath}/api/admin/`, (req, res, next) => {
        // @ts-expect-error
        if (!req.user) {
            // @ts-expect-error
            req.user = new no_auth_user_1.default();
        }
        next();
    });
}
exports.default = noneAuthentication;
//# sourceMappingURL=no-authentication.js.map