import { ApiTokenSchema, ApiTokensSchema } from '../../../openapi';
import { IUnleashConfig, IUnleashServices } from '../../../types';
import { IAuthRequest } from '../../unleash-types';
import Controller from '../../controller';
import { Response } from 'express';
interface ProjectTokenParam {
    token: string;
    projectId: string;
}
export declare class ProjectApiTokenController extends Controller {
    private apiTokenService;
    private accessService;
    private proxyService;
    private openApiService;
    private logger;
    constructor(config: IUnleashConfig, { apiTokenService, accessService, proxyService, openApiService, }: Pick<IUnleashServices, 'apiTokenService' | 'accessService' | 'proxyService' | 'openApiService'>);
    getProjectApiTokens(req: IAuthRequest, res: Response<ApiTokensSchema>): Promise<void>;
    createProjectApiToken(req: IAuthRequest, res: Response<ApiTokenSchema>): Promise<any>;
    deleteProjectApiToken(req: IAuthRequest<ProjectTokenParam>, res: Response): Promise<void>;
    private tokenEquals;
    private accessibleTokens;
}
export {};
