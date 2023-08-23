"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_required_1 = __importDefault(require("../types/authentication-required"));
const api_user_1 = __importDefault(require("../types/api-user"));
const api_token_1 = require("../types/models/api-token");
function demoAuthentication(app, basePath = '', // eslint-disable-line
{ userService }, { authentication }) {
    app.post(`${basePath}/auth/demo/login`, async (req, res) => {
        const { email } = req.body;
        try {
            const user = await userService.loginUserWithoutPassword(email, true);
            // @ts-expect-error
            req.session.user = user;
            return res.status(200).json(user);
        }
        catch (e) {
            res.status(400)
                .json({ error: `Could not sign in with ${email}` })
                .end();
        }
    });
    app.use(`${basePath}/api/admin/`, (req, res, next) => {
        // @ts-expect-error
        if (req.session.user && req.session.user.email) {
            // @ts-expect-error
            req.user = req.session.user;
        }
        next();
    });
    app.use(`${basePath}/api/client`, (req, res, next) => {
        // @ts-expect-error
        if (!authentication.enableApiToken && !req.user) {
            // @ts-expect-error
            req.user = new api_user_1.default({
                tokenName: 'unauthed-default-client',
                permissions: [],
                environment: 'default',
                type: api_token_1.ApiTokenType.CLIENT,
                project: '*',
                secret: 'a',
            });
        }
        next();
    });
    app.use(`${basePath}/api`, (req, res, next) => {
        // @ts-expect-error
        if (req.user) {
            return next();
        }
        return res
            .status(401)
            .json(new authentication_required_1.default({
            path: `${basePath}/auth/demo/login`,
            type: 'demo',
            message: 'You have to identify yourself in order to use Unleash.',
        }))
            .end();
    });
}
exports.default = demoAuthentication;
//# sourceMappingURL=demo-authentication.js.map