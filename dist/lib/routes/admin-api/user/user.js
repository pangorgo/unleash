"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../../controller"));
const option_1 = require("../../../types/option");
const permissions_1 = require("../../../types/permissions");
const create_request_schema_1 = require("../../../openapi/util/create-request-schema");
const create_response_schema_1 = require("../../../openapi/util/create-response-schema");
const me_schema_1 = require("../../../openapi/spec/me-schema");
const serialize_dates_1 = require("../../../types/serialize-dates");
const standard_responses_1 = require("../../../openapi/util/standard-responses");
const profile_schema_1 = require("../../../openapi/spec/profile-schema");
class UserController extends controller_1.default {
    constructor(config, { accessService, userService, userFeedbackService, userSplashService, openApiService, projectService, }) {
        super(config);
        this.accessService = accessService;
        this.userService = userService;
        this.userFeedbackService = userFeedbackService;
        this.userSplashService = userSplashService;
        this.openApiService = openApiService;
        this.projectService = projectService;
        this.route({
            method: 'get',
            path: '',
            handler: this.getMe,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    tags: ['Users'],
                    operationId: 'getMe',
                    summary: 'Get your own user details',
                    description: 'Detailed information about the current user, user permissions and user feedback',
                    responses: {
                        200: (0, create_response_schema_1.createResponseSchema)('meSchema'),
                        ...(0, standard_responses_1.getStandardResponses)(401),
                    },
                }),
            ],
        });
        this.route({
            method: 'get',
            path: '/profile',
            handler: this.getProfile,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    tags: ['Users'],
                    operationId: 'getProfile',
                    summary: 'Get your own user profile',
                    description: 'Detailed information about the current user root role and project membership',
                    responses: {
                        200: (0, create_response_schema_1.createResponseSchema)('profileSchema'),
                        ...(0, standard_responses_1.getStandardResponses)(401),
                    },
                }),
            ],
        });
        this.route({
            method: 'post',
            path: '/change-password',
            handler: this.changeMyPassword,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    tags: ['Users'],
                    operationId: 'changeMyPassword',
                    summary: 'Change your own password',
                    description: 'Requires specifying old password and confirming new password',
                    requestBody: (0, create_request_schema_1.createRequestSchema)('passwordSchema'),
                    responses: {
                        200: standard_responses_1.emptyResponse,
                        400: {
                            description: 'Old and new password do not match',
                        },
                        401: {
                            description: 'Old password is incorrect or user is not authenticated',
                        },
                    },
                }),
            ],
        });
    }
    async getMe(req, res) {
        res.setHeader('cache-control', 'no-store');
        const { user } = req;
        let permissions;
        if (this.config.authentication.type === option_1.IAuthType.NONE) {
            permissions = [{ permission: permissions_1.ADMIN }];
        }
        else {
            permissions = await this.accessService.getPermissionsForUser(user);
        }
        const feedback = await this.userFeedbackService.getAllUserFeedback(user);
        const splash = await this.userSplashService.getAllUserSplashes(user);
        const responseData = {
            user: (0, serialize_dates_1.serializeDates)(user),
            permissions,
            feedback: (0, serialize_dates_1.serializeDates)(feedback),
            splash,
        };
        this.openApiService.respondWithValidation(200, res, me_schema_1.meSchema.$id, responseData);
    }
    async getProfile(req, res) {
        const { user } = req;
        const projects = await this.projectService.getProjectsByUser(user.id);
        const roles = await this.accessService.getUserRootRoles(user.id);
        const { project, ...rootRole } = roles[0];
        const responseData = {
            projects,
            rootRole,
            features: [],
        };
        this.openApiService.respondWithValidation(200, res, profile_schema_1.profileSchema.$id, responseData);
    }
    async changeMyPassword(req, res) {
        const { user } = req;
        const { password, confirmPassword, oldPassword } = req.body;
        if (password === confirmPassword && oldPassword != null) {
            this.userService.validatePassword(password);
            await this.userService.changePasswordWithVerification(user.id, password, oldPassword);
            res.status(200).end();
        }
        else {
            res.status(400).end();
        }
    }
}
module.exports = UserController;
exports.default = UserController;
//# sourceMappingURL=user.js.map