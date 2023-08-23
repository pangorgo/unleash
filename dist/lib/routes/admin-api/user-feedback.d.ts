import Controller from '../controller';
import { IUnleashConfig } from '../../types/option';
import { IUnleashServices } from '../../types/services';
declare class UserFeedbackController extends Controller {
    private logger;
    private userFeedbackService;
    private openApiService;
    constructor(config: IUnleashConfig, { userFeedbackService, openApiService, }: Pick<IUnleashServices, 'userFeedbackService' | 'openApiService'>);
    private createFeedback;
    private updateFeedback;
}
export default UserFeedbackController;
