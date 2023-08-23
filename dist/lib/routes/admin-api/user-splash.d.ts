import Controller from '../controller';
import { IUnleashConfig } from '../../types/option';
import { IUnleashServices } from '../../types/services';
declare class UserSplashController extends Controller {
    private logger;
    private userSplashService;
    private openApiService;
    constructor(config: IUnleashConfig, { userSplashService, openApiService, }: Pick<IUnleashServices, 'userSplashService' | 'openApiService'>);
    private updateSplashSettings;
}
export default UserSplashController;
