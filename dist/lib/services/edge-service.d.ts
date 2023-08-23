import { IUnleashStores, IUnleashConfig } from '../types';
import { ValidatedEdgeTokensSchema } from '../openapi/spec/validated-edge-tokens-schema';
export default class EdgeService {
    private logger;
    private apiTokenStore;
    constructor({ apiTokenStore }: Pick<IUnleashStores, 'apiTokenStore'>, { getLogger }: Pick<IUnleashConfig, 'getLogger'>);
    getValidTokens(tokens: string[]): Promise<ValidatedEdgeTokensSchema>;
}
