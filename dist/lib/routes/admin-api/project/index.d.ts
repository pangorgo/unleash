import { Response } from 'express';
import Controller from '../../controller';
import { IArchivedQuery, IProjectParam, IUnleashConfig, IUnleashServices } from '../../../types';
import { ProjectOverviewSchema, ProjectsSchema } from '../../../openapi';
import { IAuthRequest } from '../../unleash-types';
import { Db } from '../../../db/db';
export default class ProjectApi extends Controller {
    private projectService;
    private settingService;
    private openApiService;
    constructor(config: IUnleashConfig, services: IUnleashServices, db: Db);
    getProjects(req: IAuthRequest, res: Response<ProjectsSchema>): Promise<void>;
    getProjectOverview(req: IAuthRequest<IProjectParam, unknown, unknown, IArchivedQuery>, res: Response<ProjectOverviewSchema>): Promise<void>;
}
