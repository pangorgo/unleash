import { Request, Response } from 'express';
import Controller from '../controller';
import { IUnleashConfig, IUnleashServices } from '../../types';
import { IAuthRequest } from '../unleash-types';
import { AddonSchema } from '../../openapi/spec/addon-schema';
import { AddonsSchema } from '../../openapi/spec/addons-schema';
import { AddonCreateUpdateSchema } from 'lib/openapi/spec/addon-create-update-schema';
declare type AddonServices = Pick<IUnleashServices, 'addonService' | 'openApiService'>;
declare class AddonController extends Controller {
    private logger;
    private addonService;
    private openApiService;
    constructor(config: IUnleashConfig, { addonService, openApiService }: AddonServices);
    getAddons(req: Request, res: Response<AddonsSchema>): Promise<void>;
    getAddon(req: Request<{
        id: number;
    }, any, any, any>, res: Response<AddonSchema>): Promise<void>;
    updateAddon(req: IAuthRequest<{
        id: number;
    }, any, AddonCreateUpdateSchema, any>, res: Response<AddonSchema>): Promise<void>;
    createAddon(req: IAuthRequest<AddonCreateUpdateSchema, any, any, any>, res: Response<AddonSchema>): Promise<void>;
    deleteAddon(req: IAuthRequest<{
        id: number;
    }, any, any, any>, res: Response<void>): Promise<void>;
}
export default AddonController;
