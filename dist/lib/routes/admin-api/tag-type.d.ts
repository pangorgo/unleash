import { Request, Response } from 'express';
import Controller from '../controller';
import { IUnleashConfig } from '../../types/option';
import { IUnleashServices } from '../../types/services';
import { IAuthRequest } from '../unleash-types';
import { TagTypesSchema } from '../../openapi/spec/tag-types-schema';
import { ValidateTagTypeSchema } from '../../openapi/spec/validate-tag-type-schema';
import { TagTypeSchema } from '../../openapi/spec/tag-type-schema';
import { UpdateTagTypeSchema } from '../../openapi/spec/update-tag-type-schema';
declare class TagTypeController extends Controller {
    private logger;
    private tagTypeService;
    private openApiService;
    constructor(config: IUnleashConfig, { tagTypeService, openApiService, }: Pick<IUnleashServices, 'tagTypeService' | 'openApiService'>);
    getTagTypes(req: Request, res: Response<TagTypesSchema>): Promise<void>;
    validateTagType(req: Request<unknown, unknown, TagTypeSchema>, res: Response<ValidateTagTypeSchema>): Promise<void>;
    createTagType(req: IAuthRequest<unknown, unknown, TagTypeSchema>, res: Response): Promise<void>;
    updateTagType(req: IAuthRequest<{
        name: string;
    }, unknown, UpdateTagTypeSchema>, res: Response): Promise<void>;
    getTagType(req: Request, res: Response): Promise<void>;
    deleteTagType(req: IAuthRequest, res: Response): Promise<void>;
}
export default TagTypeController;
