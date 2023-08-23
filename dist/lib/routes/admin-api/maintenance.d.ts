import { IUnleashConfig, IUnleashServices } from '../../types';
import { Request, Response } from 'express';
import Controller from '../controller';
import { IAuthRequest } from '../unleash-types';
import { MaintenanceSchema } from '../../openapi/spec/maintenance-schema';
import { ToggleMaintenanceSchema } from 'lib/openapi/spec/toggle-maintenance-schema';
export default class MaintenanceController extends Controller {
    private maintenanceService;
    private openApiService;
    private logger;
    constructor(config: IUnleashConfig, { maintenanceService, openApiService, }: Pick<IUnleashServices, 'maintenanceService' | 'openApiService'>);
    toggleMaintenance(req: IAuthRequest<unknown, unknown, ToggleMaintenanceSchema>, res: Response<MaintenanceSchema>): Promise<void>;
    getMaintenance(req: Request, res: Response): Promise<void>;
}
