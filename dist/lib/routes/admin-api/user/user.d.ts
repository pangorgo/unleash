import { Response } from 'express';
import { IAuthRequest } from '../../unleash-types';
import Controller from '../../controller';
import { IUnleashConfig } from '../../../types/option';
import { IUnleashServices } from '../../../types/services';
import { MeSchema } from '../../../openapi/spec/me-schema';
import { PasswordSchema } from '../../../openapi/spec/password-schema';
import { ProfileSchema } from '../../../openapi/spec/profile-schema';
declare class UserController extends Controller {
    private accessService;
    private userService;
    private userFeedbackService;
    private userSplashService;
    private openApiService;
    private projectService;
    constructor(config: IUnleashConfig, { accessService, userService, userFeedbackService, userSplashService, openApiService, projectService, }: Pick<IUnleashServices, 'accessService' | 'userService' | 'userFeedbackService' | 'userSplashService' | 'openApiService' | 'projectService'>);
    getMe(req: IAuthRequest, res: Response<MeSchema>): Promise<void>;
    getProfile(req: IAuthRequest, res: Response<ProfileSchema>): Promise<void>;
    changeMyPassword(req: IAuthRequest<unknown, unknown, PasswordSchema>, res: Response): Promise<void>;
}
export default UserController;
