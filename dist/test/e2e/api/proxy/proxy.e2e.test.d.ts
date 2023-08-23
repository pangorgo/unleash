import { ApiTokenType, IApiToken, IApiTokenCreate } from '../../../../lib/types/models/api-token';
export declare const createApiToken: (type: ApiTokenType, overrides?: Partial<Omit<IApiTokenCreate, 'type' | 'secret'>>) => Promise<IApiToken>;
