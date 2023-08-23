import { Request, Response } from 'express';
import Controller from '../controller';
import { IUnleashConfig, IUnleashServices } from '../../types';
import { IAuthRequest } from '../unleash-types';
import { IUser } from '../../server-impl';
import { UserSchema } from '../../openapi/spec/user-schema';
import { UsersSchema } from '../../openapi/spec/users-schema';
import { UsersSearchSchema } from '../../openapi/spec/users-search-schema';
import { CreateUserSchema } from '../../openapi/spec/create-user-schema';
import { UpdateUserSchema } from '../../openapi/spec/update-user-schema';
import { PasswordSchema } from '../../openapi/spec/password-schema';
import { IdSchema } from '../../openapi/spec/id-schema';
import { ResetPasswordSchema } from '../../openapi/spec/reset-password-schema';
import { UsersGroupsBaseSchema } from '../../openapi/spec/users-groups-base-schema';
import { AdminCountSchema } from '../../openapi/spec/admin-count-schema';
import { CreateUserResponseSchema } from '../../openapi/spec/create-user-response-schema';
export default class UserAdminController extends Controller {
    private flagResolver;
    private userService;
    private accountService;
    private accessService;
    private readonly logger;
    private emailService;
    private resetTokenService;
    private settingService;
    private openApiService;
    private groupService;
    readonly unleashUrl: string;
    constructor(config: IUnleashConfig, { userService, accountService, accessService, emailService, resetTokenService, settingService, openApiService, groupService, }: Pick<IUnleashServices, 'userService' | 'accountService' | 'accessService' | 'emailService' | 'resetTokenService' | 'settingService' | 'openApiService' | 'groupService'>);
    resetUserPassword(req: IAuthRequest<unknown, ResetPasswordSchema, IdSchema>, res: Response<ResetPasswordSchema>): Promise<void>;
    getUsers(req: Request, res: Response<UsersSchema>): Promise<void>;
    anonymiseUsers(users: IUser[]): IUser[];
    searchUsers(req: Request, res: Response<UsersSearchSchema>): Promise<void>;
    getBaseUsersAndGroups(req: Request, res: Response<UsersGroupsBaseSchema>): Promise<void>;
    getUser(req: Request, res: Response<UserSchema>): Promise<void>;
    createUser(req: IAuthRequest<unknown, unknown, CreateUserSchema>, res: Response<CreateUserResponseSchema>): Promise<void>;
    updateUser(req: IAuthRequest<{
        id: string;
    }, CreateUserResponseSchema, UpdateUserSchema>, res: Response<CreateUserResponseSchema>): Promise<void>;
    deleteUser(req: IAuthRequest, res: Response): Promise<void>;
    validateUserPassword(req: IAuthRequest<unknown, unknown, PasswordSchema>, res: Response): Promise<void>;
    changeUserPassword(req: IAuthRequest<{
        id: string;
    }, unknown, PasswordSchema>, res: Response): Promise<void>;
    getAdminCount(req: Request, res: Response<AdminCountSchema>): Promise<void>;
}
