import { IUnleashStores } from '../types/stores';
import { IUnleashConfig } from '../types/option';
import User from '../types/user';
import { IUserSplash } from '../types/stores/user-splash-store';
export default class UserSplashService {
    private userSplashStore;
    private logger;
    constructor({ userSplashStore }: Pick<IUnleashStores, 'userSplashStore'>, { getLogger }: Pick<IUnleashConfig, 'getLogger'>);
    getAllUserSplashes(user: User): Promise<Record<string, boolean>>;
    getSplash(user_id: number, splash_id: string): Promise<IUserSplash>;
    updateSplash(splash: IUserSplash): Promise<IUserSplash>;
}
