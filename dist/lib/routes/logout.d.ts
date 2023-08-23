import { Response } from 'express';
import { IUnleashConfig } from '../types';
import Controller from './controller';
import { IAuthRequest } from './unleash-types';
import { IUnleashServices } from '../types';
declare class LogoutController extends Controller {
    private clearSiteDataOnLogout;
    private cookieName;
    private baseUri;
    private sessionService;
    constructor(config: IUnleashConfig, { sessionService }: Pick<IUnleashServices, 'sessionService'>);
    logout(req: IAuthRequest, res: Response): Promise<void>;
    private isReqLogoutWithoutCallback;
}
export default LogoutController;
