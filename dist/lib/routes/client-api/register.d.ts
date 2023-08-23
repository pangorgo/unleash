import { Response } from 'express';
import Controller from '../controller';
import { IUnleashServices } from '../../types';
import { IUnleashConfig } from '../../types/option';
import { Logger } from '../../logger';
import ClientInstanceService from '../../services/client-metrics/instance-service';
import { IAuthRequest } from '../../server-impl';
import { OpenApiService } from '../../services/openapi-service';
import { ClientApplicationSchema } from '../../openapi/spec/client-application-schema';
export default class RegisterController extends Controller {
    logger: Logger;
    clientInstanceService: ClientInstanceService;
    openApiService: OpenApiService;
    constructor({ clientInstanceService, openApiService, }: Pick<IUnleashServices, 'clientInstanceService' | 'openApiService'>, config: IUnleashConfig);
    private static resolveEnvironment;
    registerClientApplication(req: IAuthRequest<unknown, void, ClientApplicationSchema>, res: Response<void>): Promise<void>;
}
