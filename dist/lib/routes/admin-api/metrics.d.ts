import { Request, Response } from 'express';
import Controller from '../controller';
import { IUnleashConfig } from '../../types/option';
import { IUnleashServices } from '../../types/services';
import { ApplicationSchema } from '../../openapi/spec/application-schema';
import { ApplicationsSchema } from '../../openapi/spec/applications-schema';
import { CreateApplicationSchema } from '../../openapi/spec/create-application-schema';
declare class MetricsController extends Controller {
    private logger;
    private clientInstanceService;
    constructor(config: IUnleashConfig, { clientInstanceService, openApiService, }: Pick<IUnleashServices, 'clientInstanceService' | 'openApiService'>);
    deprecated(req: Request, res: Response): Promise<void>;
    deleteApplication(req: Request<{
        appName: string;
    }>, res: Response): Promise<void>;
    createApplication(req: Request<{
        appName: string;
    }, unknown, CreateApplicationSchema>, res: Response): Promise<void>;
    getApplications(req: Request, res: Response<ApplicationsSchema>): Promise<void>;
    getApplication(req: Request, res: Response<ApplicationSchema>): Promise<void>;
}
export default MetricsController;
