import { Request, Response } from 'express';
import { IUnleashConfig } from '../types/option';
import { IUnleashServices } from '../types/services';
import Controller from './controller';
import { HealthCheckSchema } from '../openapi/spec/health-check-schema';
export declare class HealthCheckController extends Controller {
    private logger;
    private openApiService;
    constructor(config: IUnleashConfig, { openApiService }: Pick<IUnleashServices, 'openApiService'>);
    getHealth(_: Request, res: Response<HealthCheckSchema>): Promise<void>;
}
