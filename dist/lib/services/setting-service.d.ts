import { IUnleashConfig } from '../types/option';
import { IUnleashStores } from '../types/stores';
export default class SettingService {
    private config;
    private logger;
    private settingStore;
    private eventStore;
    constructor({ settingStore, eventStore, }: Pick<IUnleashStores, 'settingStore' | 'eventStore'>, config: IUnleashConfig);
    get<T>(id: string, defaultValue?: T): Promise<T>;
    insert(id: string, value: object, createdBy: string): Promise<void>;
    delete(id: string, createdBy: string): Promise<void>;
    deleteAll(): Promise<void>;
}
