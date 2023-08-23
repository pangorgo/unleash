/// <reference types="node" />
import { URL } from 'url';
import User, { IUser } from '../types/user';
import { AccessService } from './access-service';
import ResetTokenService from './reset-token-service';
import { EmailService } from './email-service';
import { IUnleashConfig } from '../types/option';
import SessionService from './session-service';
import { IUnleashStores } from '../types/stores';
import { RoleName } from '../types/model';
import SettingService from './setting-service';
import { TokenUserSchema } from '../openapi/spec/token-user-schema';
export interface ICreateUser {
    name?: string;
    email?: string;
    username?: string;
    password?: string;
    rootRole: number | RoleName;
}
export interface IUpdateUser {
    id: number;
    name?: string;
    email?: string;
    rootRole?: number | RoleName;
}
export interface ILoginUserRequest {
    email: string;
    name?: string;
    rootRole?: number | RoleName;
    autoCreate?: boolean;
}
interface IUserWithRole extends IUser {
    rootRole: number;
}
declare class UserService {
    private logger;
    private store;
    private eventStore;
    private accessService;
    private resetTokenService;
    private sessionService;
    private emailService;
    private settingService;
    private passwordResetTimeouts;
    private baseUriPath;
    constructor(stores: Pick<IUnleashStores, 'userStore' | 'eventStore'>, { server, getLogger, authentication, }: Pick<IUnleashConfig, 'getLogger' | 'authentication' | 'server'>, services: {
        accessService: AccessService;
        resetTokenService: ResetTokenService;
        emailService: EmailService;
        sessionService: SessionService;
        settingService: SettingService;
    });
    validatePassword(password: string): boolean;
    initAdminUser(): Promise<void>;
    getAll(): Promise<IUserWithRole[]>;
    getUser(id: number): Promise<IUserWithRole>;
    search(query: string): Promise<IUser[]>;
    getByEmail(email: string): Promise<IUser>;
    createUser({ username, email, name, password, rootRole }: ICreateUser, updatedBy?: User): Promise<IUser>;
    private getCreatedBy;
    private mapUserToData;
    updateUser({ id, name, email, rootRole }: IUpdateUser, updatedBy?: User): Promise<IUser>;
    deleteUser(userId: number, updatedBy?: User): Promise<void>;
    loginUser(usernameOrEmail: string, password: string): Promise<IUser>;
    /**
     * Used to login users without specifying password. Used when integrating
     * with external identity providers.
     *
     * @param usernameOrEmail
     * @param autoCreateUser
     * @returns
     */
    loginUserWithoutPassword(email: string, autoCreateUser?: boolean): Promise<IUser>;
    loginUserSSO({ email, name, rootRole, autoCreate, }: ILoginUserRequest): Promise<IUser>;
    changePassword(userId: number, password: string): Promise<void>;
    changePasswordWithVerification(userId: number, newPassword: string, oldPassword: string): Promise<void>;
    getUserForToken(token: string): Promise<TokenUserSchema>;
    /**
     * If the password is a strong password will update password and delete all sessions for the user we're changing the password for
     * @param token - the token authenticating this request
     * @param password - new password
     */
    resetPassword(token: string, password: string): Promise<void>;
    createResetPasswordEmail(receiverEmail: string, user?: User): Promise<URL>;
}
export default UserService;
