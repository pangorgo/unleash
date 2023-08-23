import { Request, Response } from 'express';
import { IUnleashConfig } from '../../types/option';
import { IUnleashServices } from '../../types';
import Controller from '../controller';
import { ConstraintSchema } from '../../openapi';
export default class ConstraintController extends Controller {
    private featureService;
    private openApiService;
    private readonly logger;
    constructor(config: IUnleashConfig, { featureToggleServiceV2, openApiService, }: Pick<IUnleashServices, 'featureToggleServiceV2' | 'openApiService'>);
    validateConstraint(req: Request<void, void, ConstraintSchema>, res: Response): Promise<void>;
}
