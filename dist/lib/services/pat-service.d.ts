import { IUnleashConfig, IUnleashStores } from '../types';
import { IPat } from '../types/models/pat';
import User from '../types/user';
export default class PatService {
    private config;
    private logger;
    private patStore;
    private eventStore;
    constructor({ patStore, eventStore, }: Pick<IUnleashStores, 'patStore' | 'eventStore'>, config: IUnleashConfig);
    createPat(pat: IPat, forUserId: number, editor: User): Promise<IPat>;
    getAll(userId: number): Promise<IPat[]>;
    deletePat(id: number, forUserId: number, editor: User): Promise<void>;
    validatePat({ description, expiresAt }: IPat, userId: number): Promise<void>;
    private generateSecretKey;
}
