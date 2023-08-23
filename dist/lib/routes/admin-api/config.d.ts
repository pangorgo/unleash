import { Response } from 'express';
import { AuthedRequest } from '../../types/core';
import { IUnleashServices } from '../../types/services';
import { IUnleashConfig } from '../../types/option';
import Controller from '../controller';
import { UiConfigSchema } from '../../openapi/spec/ui-config-schema';
import { IAuthRequest } from '../unleash-types';
import { SetUiConfigSchema } from '../../openapi/spec/set-ui-config-schema';
declare class ConfigController extends Controller {
    private versionService;
    private settingService;
    private proxyService;
    private emailService;
    private maintenanceService;
    private readonly openApiService;
    constructor(config: IUnleashConfig, { versionService, settingService, emailService, openApiService, proxyService, maintenanceService, }: Pick<IUnleashServices, 'versionService' | 'settingService' | 'emailService' | 'openApiService' | 'proxyService' | 'maintenanceService'>);
    getUiConfig(req: AuthedRequest, res: Response<UiConfigSchema>): Promise<void>;
    setUiConfig(req: IAuthRequest<void, void, SetUiConfigSchema>, res: Response<string>): Promise<void>;
}
export default ConfigController;
