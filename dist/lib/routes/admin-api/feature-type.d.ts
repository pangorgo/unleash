import { Request, Response } from 'express';
import { IUnleashServices } from '../../types/services';
import { IUnleashConfig } from '../../types/option';
import { FeatureTypesSchema } from '../../openapi/spec/feature-types-schema';
import Controller from '../controller';
import { FeatureTypeSchema, UpdateFeatureTypeLifetimeSchema } from '../../openapi';
import { IAuthRequest } from '../unleash-types';
export declare class FeatureTypeController extends Controller {
    private featureTypeService;
    private openApiService;
    private logger;
    private flagResolver;
    constructor(config: IUnleashConfig, { featureTypeService, openApiService, }: Pick<IUnleashServices, 'featureTypeService' | 'openApiService'>);
    getAllFeatureTypes(req: Request, res: Response<FeatureTypesSchema>): Promise<void>;
    updateLifetime(req: IAuthRequest<{
        id: string;
    }, unknown, UpdateFeatureTypeLifetimeSchema>, res: Response<FeatureTypeSchema>): Promise<void>;
}
