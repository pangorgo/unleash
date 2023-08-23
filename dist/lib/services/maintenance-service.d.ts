import { IUnleashConfig, IUnleashStores } from '../types';
import SettingService from './setting-service';
import { MaintenanceSchema } from '../openapi/spec/maintenance-schema';
import { SchedulerService } from './scheduler-service';
export default class MaintenanceService {
    private config;
    private logger;
    private patStore;
    private eventStore;
    private settingService;
    private schedulerService;
    constructor({ patStore, eventStore, }: Pick<IUnleashStores, 'patStore' | 'eventStore'>, config: IUnleashConfig, settingService: SettingService, schedulerService: SchedulerService);
    isMaintenanceMode(): Promise<boolean>;
    getMaintenanceSetting(): Promise<MaintenanceSchema>;
    toggleMaintenanceMode(setting: MaintenanceSchema, user: string): Promise<void>;
}
