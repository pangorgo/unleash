import { IUnleashConfig, IUnleashStores } from '../types';
import { PublicSignupTokenSchema } from '../openapi/spec/public-signup-token-schema';
import { PublicSignupTokenCreateSchema } from '../openapi/spec/public-signup-token-create-schema';
import { CreateInvitedUserSchema } from 'lib/openapi/spec/create-invited-user-schema';
import UserService from './user-service';
import { IUser } from '../types/user';
export declare class PublicSignupTokenService {
    private store;
    private roleStore;
    private eventStore;
    private userService;
    private logger;
    private timer;
    private readonly unleashBase;
    constructor({ publicSignupTokenStore, roleStore, eventStore, }: Pick<IUnleashStores, 'publicSignupTokenStore' | 'roleStore' | 'eventStore'>, config: Pick<IUnleashConfig, 'getLogger' | 'authentication' | 'server'>, userService: UserService);
    private getUrl;
    get(secret: string): Promise<PublicSignupTokenSchema>;
    getAllTokens(): Promise<PublicSignupTokenSchema[]>;
    getAllActiveTokens(): Promise<PublicSignupTokenSchema[]>;
    validate(secret: string): Promise<boolean>;
    update(secret: string, { expiresAt, enabled }: {
        expiresAt?: Date;
        enabled?: boolean;
    }, createdBy: string): Promise<PublicSignupTokenSchema>;
    addTokenUser(secret: string, createUser: CreateInvitedUserSchema): Promise<IUser>;
    createNewPublicSignupToken(tokenCreate: PublicSignupTokenCreateSchema, createdBy: string): Promise<PublicSignupTokenSchema>;
    private generateSecretKey;
    private getMinimumDate;
    destroy(): void;
}
