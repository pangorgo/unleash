import { Request, Response } from 'express';
import Controller from '../../controller';
import { IUnleashServices } from '../../../types/services';
import { IUnleashConfig } from '../../../types/option';
import { IProjectParam } from '../../../types/model';
import { HealthReportSchema } from '../../../openapi/spec/health-report-schema';
export default class ProjectHealthReport extends Controller {
    private projectHealthService;
    private openApiService;
    private logger;
    constructor(config: IUnleashConfig, { projectHealthService, openApiService, }: Pick<IUnleashServices, 'projectHealthService' | 'openApiService'>);
    getProjectHealthReport(req: Request<IProjectParam>, res: Response<HealthReportSchema>): Promise<void>;
}
