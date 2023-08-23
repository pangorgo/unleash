import { IUnleashConfig } from '../types/option';
export declare const TOKEN_TYPE_ERROR_MESSAGE = "invalid token: expected a different token type for this endpoint";
export declare const NO_TOKEN_WHERE_TOKEN_WAS_REQUIRED = "This endpoint requires an API token. Please add an authorization header to your request with a valid token";
declare const apiAccessMiddleware: ({ getLogger, authentication, flagResolver, }: Pick<IUnleashConfig, 'getLogger' | 'authentication' | 'flagResolver'>, { apiTokenService }: any) => any;
export default apiAccessMiddleware;
