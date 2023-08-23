import { IUnleashConfig } from '../types';
import MaintenanceService from '../services/maintenance-service';
declare const maintenanceMiddleware: ({ getLogger }: Pick<IUnleashConfig, 'getLogger' | 'flagResolver'>, maintenanceService: MaintenanceService) => any;
export default maintenanceMiddleware;
