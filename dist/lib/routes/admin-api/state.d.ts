import { Request, Response } from 'express';
import Controller from '../controller';
import { IUnleashConfig } from '../../types/option';
import { IUnleashServices } from '../../types/services';
import { IAuthRequest } from '../unleash-types';
import { ExportQueryParameters } from '../../openapi/spec/export-query-parameters';
declare class StateController extends Controller {
    private logger;
    private stateService;
    private openApiService;
    constructor(config: IUnleashConfig, { stateService, openApiService, }: Pick<IUnleashServices, 'stateService' | 'openApiService'>);
    import(req: IAuthRequest, res: Response): Promise<void>;
    export(req: Request<unknown, unknown, unknown, ExportQueryParameters>, res: Response): Promise<void>;
}
export default StateController;
