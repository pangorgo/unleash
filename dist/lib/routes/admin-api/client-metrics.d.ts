import { Request, Response } from 'express';
import Controller from '../controller';
import { IUnleashConfig } from '../../types/option';
import { IUnleashServices } from '../../types';
import { FeatureUsageSchema } from '../../openapi/spec/feature-usage-schema';
import { FeatureMetricsSchema } from '../../openapi/spec/feature-metrics-schema';
interface IName {
    name: string;
}
interface IHoursBack {
    hoursBack: number;
}
declare class ClientMetricsController extends Controller {
    private logger;
    private metrics;
    private openApiService;
    private static HOURS_BACK_MIN;
    private static HOURS_BACK_MAX;
    constructor(config: IUnleashConfig, { clientMetricsServiceV2, openApiService, }: Pick<IUnleashServices, 'clientMetricsServiceV2' | 'openApiService'>);
    getRawToggleMetrics(req: Request<any, IName, IHoursBack, any>, res: Response<FeatureMetricsSchema>): Promise<void>;
    getToggleMetricsSummary(req: Request<IName>, res: Response<FeatureUsageSchema>): Promise<void>;
    private parseHoursBackQueryParam;
}
export default ClientMetricsController;
