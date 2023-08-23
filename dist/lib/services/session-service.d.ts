import { IUnleashStores } from '../types/stores';
import { IUnleashConfig } from '../types/option';
import { ISession } from '../types/stores/session-store';
export default class SessionService {
    private logger;
    private sessionStore;
    constructor({ sessionStore }: Pick<IUnleashStores, 'sessionStore'>, { getLogger }: Pick<IUnleashConfig, 'getLogger'>);
    getActiveSessions(): Promise<ISession[]>;
    getSessionsForUser(userId: number): Promise<ISession[]>;
    getSession(sid: string): Promise<ISession>;
    deleteSessionsForUser(userId: number): Promise<void>;
    deleteSession(sid: string): Promise<void>;
    insertSession({ sid, sess, }: Pick<ISession, 'sid' | 'sess'>): Promise<ISession>;
}
