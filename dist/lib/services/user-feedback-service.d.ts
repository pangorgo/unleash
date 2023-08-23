import { IUnleashStores } from '../types/stores';
import { IUnleashConfig } from '../types/option';
import User from '../types/user';
import { IUserFeedback } from '../types/stores/user-feedback-store';
export default class UserFeedbackService {
    private userFeedbackStore;
    private logger;
    constructor({ userFeedbackStore }: Pick<IUnleashStores, 'userFeedbackStore'>, { getLogger }: Pick<IUnleashConfig, 'getLogger'>);
    getAllUserFeedback(user: User): Promise<IUserFeedback[]>;
    getFeedback(user_id: number, feedback_id: string): Promise<IUserFeedback>;
    updateFeedback(feedback: IUserFeedback): Promise<IUserFeedback>;
}
