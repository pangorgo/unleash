import { Response } from 'express';
import Controller from '../controller';
import { IUnleashConfig, IUnleashServices } from '../../types';
import ClientInstanceService from '../../services/client-metrics/instance-service';
import { Logger } from '../../logger';
import { IAuthRequest } from '../unleash-types';
import ClientMetricsServiceV2 from '../../services/client-metrics/metrics-service-v2';
import { OpenApiService } from '../../services/openapi-service';
export default class ClientMetricsController extends Controller {
    logger: Logger;
    clientInstanceService: ClientInstanceService;
    openApiService: OpenApiService;
    metricsV2: ClientMetricsServiceV2;
    constructor({ clientInstanceService, clientMetricsServiceV2, openApiService, }: Pick<IUnleashServices, 'clientInstanceService' | 'clientMetricsServiceV2' | 'openApiService'>, config: IUnleashConfig);
    registerMetrics(req: IAuthRequest, res: Response): Promise<void>;
}
