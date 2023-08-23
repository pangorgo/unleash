import { Response } from 'express';
import { IUnleashConfig } from '../../../types/option';
import { IProjectParam, IUnleashServices } from '../../../types';
import { IAuthRequest } from '../../unleash-types';
import { BatchFeaturesSchema } from '../../../openapi';
import Controller from '../../controller';
export default class ProjectArchiveController extends Controller {
    private readonly logger;
    private featureService;
    private openApiService;
    private flagResolver;
    constructor(config: IUnleashConfig, { featureToggleServiceV2, openApiService, }: Pick<IUnleashServices, 'featureToggleServiceV2' | 'openApiService'>);
    deleteFeatures(req: IAuthRequest<IProjectParam, any, BatchFeaturesSchema>, res: Response<void>): Promise<void>;
    reviveFeatures(req: IAuthRequest<IProjectParam, any, BatchFeaturesSchema>, res: Response<void>): Promise<void>;
    archiveFeatures(req: IAuthRequest<IProjectParam, void, BatchFeaturesSchema>, res: Response): Promise<void>;
}
