import { Request, Response } from 'express';
import { IUnleashConfig } from '../../types/option';
import { IUnleashServices } from '../../types/services';
import Controller from '../controller';
import { IAuthRequest } from '../unleash-types';
import { TagsSchema } from '../../openapi/spec/tags-schema';
import { TagSchema } from '../../openapi/spec/tag-schema';
import { TagWithVersionSchema } from '../../openapi/spec/tag-with-version-schema';
declare class TagController extends Controller {
    private logger;
    private tagService;
    private featureTagService;
    private openApiService;
    private flagResolver;
    constructor(config: IUnleashConfig, { tagService, openApiService, featureTagService, }: Pick<IUnleashServices, 'tagService' | 'openApiService' | 'featureTagService'>);
    getTags(req: Request, res: Response<TagsSchema>): Promise<void>;
    getTagsByType(req: Request, res: Response<TagsSchema>): Promise<void>;
    getTag(req: Request<TagSchema>, res: Response<TagWithVersionSchema>): Promise<void>;
    createTag(req: IAuthRequest<unknown, unknown, TagSchema>, res: Response<TagWithVersionSchema>): Promise<void>;
    deleteTag(req: IAuthRequest<TagSchema>, res: Response): Promise<void>;
}
export default TagController;
