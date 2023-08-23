import { Request, Response } from 'express';
import { IUnleashConfig } from '../../types/option';
import { IUnleashServices } from '../../types';
import Controller from '../controller';
import { IAuthRequest } from '../unleash-types';
import { FeaturesSchema } from '../../openapi/spec/features-schema';
export default class ArchiveController extends Controller {
    private featureService;
    private openApiService;
    constructor(config: IUnleashConfig, { featureToggleServiceV2, openApiService, }: Pick<IUnleashServices, 'featureToggleServiceV2' | 'openApiService'>);
    getArchivedFeatures(req: Request, res: Response<FeaturesSchema>): Promise<void>;
    getArchivedFeaturesByProjectId(req: Request<{
        projectId: string;
    }, any, any, any>, res: Response<FeaturesSchema>): Promise<void>;
    deleteFeature(req: IAuthRequest<{
        featureName: string;
    }>, res: Response<void>): Promise<void>;
    reviveFeature(req: IAuthRequest<{
        featureName: string;
    }>, res: Response<void>): Promise<void>;
}
