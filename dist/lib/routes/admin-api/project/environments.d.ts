import { Request, Response } from 'express';
import Controller from '../../controller';
import { IUnleashConfig, IUnleashServices } from '../../../types';
import { CreateFeatureStrategySchema, ProjectEnvironmentSchema } from '../../../openapi';
interface IProjectEnvironmentParams {
    projectId: string;
    environment: string;
}
export default class EnvironmentsController extends Controller {
    private logger;
    private environmentService;
    private openApiService;
    constructor(config: IUnleashConfig, { environmentService, openApiService, }: Pick<IUnleashServices, 'environmentService' | 'openApiService'>);
    addEnvironmentToProject(req: Request<Omit<IProjectEnvironmentParams, 'environment'>, void, ProjectEnvironmentSchema>, res: Response): Promise<void>;
    removeEnvironmentFromProject(req: Request<IProjectEnvironmentParams>, res: Response<void>): Promise<void>;
    addDefaultStrategyToProjectEnvironment(req: Request<IProjectEnvironmentParams, CreateFeatureStrategySchema>, res: Response<CreateFeatureStrategySchema>): Promise<void>;
}
export {};
