import { IUnleashStores } from '../types/stores';
import { IUnleashConfig } from '../types/option';
import ApiUser from '../types/api-user';
import { IApiToken, ILegacyApiTokenCreate, IApiTokenCreate } from '../types/models/api-token';
export declare class ApiTokenService {
    private store;
    private environmentStore;
    private logger;
    private activeTokens;
    private eventStore;
    private lastSeenSecrets;
    constructor({ apiTokenStore, environmentStore, eventStore, }: Pick<IUnleashStores, 'apiTokenStore' | 'environmentStore' | 'eventStore'>, config: Pick<IUnleashConfig, 'getLogger' | 'authentication'>);
    fetchActiveTokens(): Promise<void>;
    getToken(secret: string): Promise<IApiToken>;
    updateLastSeen(): Promise<void>;
    getAllTokens(): Promise<IApiToken[]>;
    getAllActiveTokens(): Promise<IApiToken[]>;
    private initApiTokens;
    getUserForToken(secret: string): ApiUser | undefined;
    updateExpiry(secret: string, expiresAt: Date, updatedBy: string): Promise<IApiToken>;
    delete(secret: string, deletedBy: string): Promise<void>;
    /**
     * @deprecated This may be removed in a future release, prefer createApiTokenWithProjects
     */
    createApiToken(newToken: Omit<ILegacyApiTokenCreate, 'secret'>, createdBy?: string): Promise<IApiToken>;
    createApiTokenWithProjects(newToken: Omit<IApiTokenCreate, 'secret'>, createdBy?: string): Promise<IApiToken>;
    createMigratedProxyApiToken(newToken: Omit<IApiTokenCreate, 'secret'>): Promise<IApiToken>;
    private insertNewApiToken;
    private findInvalidProject;
    private generateSecretKey;
}
