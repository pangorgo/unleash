import { Response } from 'express';
import Controller from '../controller';
import { IUnleashConfig, IUnleashServices } from '../../types';
import { IFeatureToggleQuery } from '../../types/model';
import { IAuthRequest } from '../unleash-types';
import { ClientFeaturesQuerySchema } from '../../openapi/spec/client-features-query-schema';
import { ClientFeatureSchema } from '../../openapi/spec/client-feature-schema';
import { ClientFeaturesSchema } from '../../openapi/spec/client-features-schema';
interface IMeta {
    revisionId: number;
    etag: string;
    queryHash: string;
}
export default class FeatureController extends Controller {
    private readonly logger;
    private featureToggleServiceV2;
    private segmentService;
    private clientSpecService;
    private openApiService;
    private configurationRevisionService;
    private featuresAndSegments;
    constructor({ featureToggleServiceV2, segmentService, clientSpecService, openApiService, configurationRevisionService, }: Pick<IUnleashServices, 'featureToggleServiceV2' | 'segmentService' | 'clientSpecService' | 'openApiService' | 'configurationRevisionService'>, config: IUnleashConfig);
    private resolveFeaturesAndSegments;
    private resolveQuery;
    private paramToArray;
    private prepQuery;
    getAll(req: IAuthRequest, res: Response<ClientFeaturesSchema>): Promise<void>;
    calculateMeta(query: IFeatureToggleQuery): Promise<IMeta>;
    getFeatureToggle(req: IAuthRequest<{
        featureName: string;
    }, ClientFeaturesQuerySchema>, res: Response<ClientFeatureSchema>): Promise<void>;
}
export {};
