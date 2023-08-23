import { Response } from 'express';
import Controller from '../../controller';
import { IUnleashConfig, IUnleashServices } from '../../../types';
import { IAuthRequest } from '../../unleash-types';
import { PatsSchema } from '../../../openapi/spec/pats-schema';
export default class PatController extends Controller {
    private patService;
    private openApiService;
    private logger;
    private flagResolver;
    constructor(config: IUnleashConfig, { openApiService, patService, }: Pick<IUnleashServices, 'openApiService' | 'patService'>);
    createPat(req: IAuthRequest, res: Response): Promise<void>;
    getPats(req: IAuthRequest, res: Response<PatsSchema>): Promise<void>;
    deletePat(req: IAuthRequest<{
        id: number;
    }>, res: Response): Promise<void>;
}
