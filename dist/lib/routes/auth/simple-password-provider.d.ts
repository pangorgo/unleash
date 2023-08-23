import { Response } from 'express';
import { IUnleashConfig } from '../../server-impl';
import { IUnleashServices } from '../../types';
import Controller from '../controller';
import { IAuthRequest } from '../unleash-types';
import { UserSchema } from '../../openapi/spec/user-schema';
import { LoginSchema } from '../../openapi/spec/login-schema';
export declare class SimplePasswordProvider extends Controller {
    private logger;
    private openApiService;
    private userService;
    constructor(config: IUnleashConfig, { userService, openApiService, }: Pick<IUnleashServices, 'userService' | 'openApiService'>);
    login(req: IAuthRequest<void, void, LoginSchema>, res: Response<UserSchema>): Promise<void>;
}
