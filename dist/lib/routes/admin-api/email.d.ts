import { IUnleashConfig } from '../../types/option';
import { IUnleashServices } from '../../types/services';
import { Request, Response } from 'express';
import Controller from '../controller';
export default class EmailController extends Controller {
    private emailService;
    private logger;
    constructor(config: IUnleashConfig, { emailService }: Pick<IUnleashServices, 'emailService'>);
    getHtmlPreview(req: Request, res: Response): Promise<void>;
    getTextPreview(req: Request, res: Response): Promise<void>;
}
