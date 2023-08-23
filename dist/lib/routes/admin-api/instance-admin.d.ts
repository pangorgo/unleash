import { Response } from 'express';
import { AuthedRequest } from '../../types/core';
import { IUnleashServices } from '../../types/services';
import { IUnleashConfig } from '../../types/option';
import Controller from '../controller';
import { UiConfigSchema } from '../../openapi/spec/ui-config-schema';
import { InstanceStats, InstanceStatsSigned } from '../../services/instance-stats-service';
declare class InstanceAdminController extends Controller {
    private instanceStatsService;
    private openApiService;
    private jsonCsvParser;
    constructor(config: IUnleashConfig, { instanceStatsService, openApiService, }: Pick<IUnleashServices, 'instanceStatsService' | 'openApiService'>);
    instanceStatsExample(): InstanceStatsSigned;
    getStatistics(req: AuthedRequest, res: Response<InstanceStats>): Promise<void>;
    getStatisticsCSV(req: AuthedRequest, res: Response<UiConfigSchema>): Promise<void>;
}
export default InstanceAdminController;
