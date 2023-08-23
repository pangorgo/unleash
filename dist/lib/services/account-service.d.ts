import { IUser } from '../types/user';
import { IUnleashConfig } from '../types/option';
import { IUnleashStores } from '../types/stores';
import { AccessService } from './access-service';
import { IAdminCount } from 'lib/types/stores/account-store';
interface IUserWithRole extends IUser {
    rootRole: number;
}
export declare class AccountService {
    private logger;
    private store;
    private accessService;
    private seenTimer;
    private lastSeenSecrets;
    constructor(stores: Pick<IUnleashStores, 'accountStore' | 'eventStore'>, { getLogger }: Pick<IUnleashConfig, 'getLogger'>, services: {
        accessService: AccessService;
    });
    getAll(): Promise<IUserWithRole[]>;
    getAccountByPersonalAccessToken(secret: string): Promise<IUser>;
    getAdminCount(): Promise<IAdminCount>;
    updateLastSeen(): Promise<void>;
    addPATSeen(secret: string): void;
    destroy(): void;
}
export {};
