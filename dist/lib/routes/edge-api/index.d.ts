import { Response } from 'express';
import Controller from '../controller';
import { IUnleashConfig, IUnleashServices } from '../../types';
import { IAuthRequest, RequestBody } from '../unleash-types';
import { ValidatedEdgeTokensSchema } from '../../openapi/spec/validated-edge-tokens-schema';
import { BulkMetricsSchema } from '../../openapi/spec/bulk-metrics-schema';
import { TokenStringListSchema } from '../../openapi';
export default class EdgeController extends Controller {
    private readonly logger;
    private edgeService;
    private openApiService;
    private metricsV2;
    private clientInstanceService;
    constructor(config: IUnleashConfig, { edgeService, openApiService, clientMetricsServiceV2, clientInstanceService, }: Pick<IUnleashServices, 'edgeService' | 'openApiService' | 'clientMetricsServiceV2' | 'clientInstanceService'>);
    getValidTokens(req: RequestBody<TokenStringListSchema>, res: Response<ValidatedEdgeTokensSchema>): Promise<void>;
    bulkMetrics(req: IAuthRequest<void, void, BulkMetricsSchema>, res: Response<void>): Promise<void>;
}
