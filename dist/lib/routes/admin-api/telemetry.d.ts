import { Response } from 'express';
import { OpenApiService } from 'lib/services';
import { IAuthRequest } from '../unleash-types';
import { IUnleashConfig } from '../../types/option';
import Controller from '../controller';
import { IUnleashServices } from 'lib/types';
import { TelemetrySettingsSchema } from '../../openapi/spec/telemetry-settings-schema';
declare class TelemetryController extends Controller {
    config: IUnleashConfig;
    openApiService: OpenApiService;
    constructor(config: IUnleashConfig, { openApiService }: Pick<IUnleashServices, 'openApiService'>);
    getTelemetrySettings(req: IAuthRequest, res: Response<TelemetrySettingsSchema>): Promise<void>;
}
export default TelemetryController;
