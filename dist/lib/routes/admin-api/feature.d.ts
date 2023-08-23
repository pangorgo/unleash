import { Request, Response } from 'express';
import Controller from '../controller';
import { IUnleashConfig } from '../../types/option';
import { IUnleashServices } from '../../types';
import { IFeatureToggleQuery } from '../../types/model';
import { IAuthRequest } from '../unleash-types';
import { FeaturesSchema } from '../../openapi/spec/features-schema';
import { TagSchema } from '../../openapi/spec/tag-schema';
import { TagsSchema } from '../../openapi/spec/tags-schema';
import { UpdateTagsSchema } from '../../openapi/spec/update-tags-schema';
import { ValidateFeatureSchema } from '../../openapi/spec/validate-feature-schema';
declare class FeatureController extends Controller {
    private tagService;
    private openApiService;
    private service;
    constructor(config: IUnleashConfig, { featureTagService, featureToggleServiceV2, openApiService, }: Pick<IUnleashServices, 'featureTagService' | 'featureToggleServiceV2' | 'openApiService'>);
    paramToArray(param: any): any;
    prepQuery({ tag, project, namePrefix, }: any): Promise<IFeatureToggleQuery>;
    getAllToggles(req: IAuthRequest, res: Response<FeaturesSchema>): Promise<void>;
    getToggle(req: Request<{
        featureName: string;
    }, any, any, any>, res: Response): Promise<void>;
    listTags(req: Request<{
        featureName: string;
    }, any, any, any>, res: Response<TagsSchema>): Promise<void>;
    addTag(req: IAuthRequest<{
        featureName: string;
    }, Response<TagSchema>, TagSchema, any>, res: Response<TagSchema>): Promise<void>;
    updateTags(req: IAuthRequest<{
        featureName: string;
    }, Response<TagsSchema>, UpdateTagsSchema, any>, res: Response<TagsSchema>): Promise<void>;
    removeTag(req: IAuthRequest<{
        featureName: string;
        type: string;
        value: string;
    }>, res: Response<void>): Promise<void>;
    validate(req: Request<any, any, ValidateFeatureSchema, any>, res: Response<void>): Promise<void>;
    createToggle(req: IAuthRequest, res: Response): Promise<void>;
    updateToggle(req: IAuthRequest, res: Response): Promise<void>;
    /**
     * @deprecated TODO: remove?
     *
     * Kept to keep backward compatibility
     */
    toggle(req: IAuthRequest, res: Response): Promise<void>;
    toggleOn(req: IAuthRequest, res: Response): Promise<void>;
    toggleOff(req: IAuthRequest, res: Response): Promise<void>;
    staleOn(req: IAuthRequest, res: Response): Promise<void>;
    staleOff(req: IAuthRequest, res: Response): Promise<void>;
    archiveToggle(req: IAuthRequest, res: Response): Promise<void>;
}
export default FeatureController;
