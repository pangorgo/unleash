import { Request, Response } from 'express';
import { IUnleashConfig } from '../../types/option';
import { IUnleashServices } from '../../types/services';
import Controller from '../../routes/controller';
import { PlaygroundResponseSchema } from '../../openapi/spec/playground-response-schema';
import { PlaygroundRequestSchema } from '../../openapi/spec/playground-request-schema';
import { AdvancedPlaygroundRequestSchema } from '../../openapi/spec/advanced-playground-request-schema';
import { AdvancedPlaygroundResponseSchema } from '../../openapi/spec/advanced-playground-response-schema';
export default class PlaygroundController extends Controller {
    private openApiService;
    private playgroundService;
    private flagResolver;
    constructor(config: IUnleashConfig, { openApiService, playgroundService, }: Pick<IUnleashServices, 'openApiService' | 'playgroundService'>);
    evaluateContext(req: Request<any, any, PlaygroundRequestSchema>, res: Response<PlaygroundResponseSchema>): Promise<void>;
    evaluateAdvancedContext(req: Request<any, any, AdvancedPlaygroundRequestSchema>, res: Response<AdvancedPlaygroundResponseSchema>): Promise<void>;
}
