import { Request, Response } from 'express';
import Controller from '../controller';
import { IUnleashConfig } from '../../types/option';
import { IUnleashServices } from '../../types/services';
import { IAuthRequest } from '../unleash-types';
import { ContextFieldSchema } from '../../openapi/spec/context-field-schema';
import { ContextFieldsSchema } from '../../openapi/spec/context-fields-schema';
import { NameSchema } from '../../openapi/spec/name-schema';
import { ContextFieldStrategiesSchema } from '../../openapi/spec/context-field-strategies-schema';
import { UpdateContextFieldSchema } from 'lib/openapi/spec/update-context-field-schema';
import { CreateContextFieldSchema } from 'lib/openapi/spec/create-context-field-schema';
interface ContextParam {
    contextField: string;
}
export declare class ContextController extends Controller {
    private contextService;
    private openApiService;
    private logger;
    constructor(config: IUnleashConfig, { contextService, openApiService, }: Pick<IUnleashServices, 'contextService' | 'openApiService'>);
    getContextFields(req: Request, res: Response<ContextFieldsSchema>): Promise<void>;
    getContextField(req: Request<ContextParam>, res: Response<ContextFieldSchema>): Promise<void>;
    createContextField(req: IAuthRequest<void, void, CreateContextFieldSchema>, res: Response<ContextFieldSchema>): Promise<void>;
    updateContextField(req: IAuthRequest<ContextParam, void, UpdateContextFieldSchema>, res: Response): Promise<void>;
    deleteContextField(req: IAuthRequest<ContextParam>, res: Response): Promise<void>;
    validate(req: Request<void, void, NameSchema>, res: Response): Promise<void>;
    getStrategiesByContextField(req: IAuthRequest<{
        contextField: string;
    }>, res: Response<ContextFieldStrategiesSchema>): Promise<void>;
}
export {};
