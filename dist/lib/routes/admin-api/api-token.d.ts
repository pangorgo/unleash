import { Response } from 'express';
import Controller from '../controller';
import { IAuthRequest } from '../unleash-types';
import { IUnleashConfig } from '../../types/option';
import { ApiTokenType } from '../../types/models/api-token';
import { IUnleashServices } from '../../types';
import { ApiTokensSchema } from '../../openapi/spec/api-tokens-schema';
import { ApiTokenSchema } from '../../openapi/spec/api-token-schema';
import { UpdateApiTokenSchema } from '../../openapi/spec/update-api-token-schema';
interface TokenParam {
    token: string;
}
interface TokenNameParam {
    name: string;
}
export declare const tokenTypeToCreatePermission: (tokenType: ApiTokenType) => string;
export declare class ApiTokenController extends Controller {
    private apiTokenService;
    private accessService;
    private proxyService;
    private openApiService;
    private logger;
    constructor(config: IUnleashConfig, { apiTokenService, accessService, proxyService, openApiService, }: Pick<IUnleashServices, 'apiTokenService' | 'accessService' | 'proxyService' | 'openApiService'>);
    getAllApiTokens(req: IAuthRequest, res: Response<ApiTokensSchema>): Promise<void>;
    getApiTokensByName(req: IAuthRequest<TokenNameParam>, res: Response<ApiTokensSchema>): Promise<void>;
    createApiToken(req: IAuthRequest, res: Response<ApiTokenSchema>): Promise<any>;
    updateApiToken(req: IAuthRequest<TokenParam, void, UpdateApiTokenSchema>, res: Response): Promise<any>;
    deleteApiToken(req: IAuthRequest<TokenParam>, res: Response): Promise<void>;
    private accessibleTokensByName;
    private accessibleTokens;
}
export {};
