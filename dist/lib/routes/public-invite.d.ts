import { Response } from 'express';
import Controller from './controller';
import { IAuthRequest } from './unleash-types';
import { IUnleashConfig, IUnleashServices } from '../types';
import { UserSchema } from '../openapi/spec/user-schema';
import { CreateInvitedUserSchema } from '../openapi/spec/create-invited-user-schema';
interface TokenParam {
    token: string;
}
export declare class PublicInviteController extends Controller {
    private publicSignupTokenService;
    private openApiService;
    private logger;
    constructor(config: IUnleashConfig, { publicSignupTokenService, openApiService, }: Pick<IUnleashServices, 'publicSignupTokenService' | 'openApiService'>);
    validate(req: IAuthRequest<TokenParam, void>, res: Response): Promise<void>;
    addTokenUser(req: IAuthRequest<TokenParam, void, CreateInvitedUserSchema>, res: Response<UserSchema>): Promise<void>;
}
export {};
