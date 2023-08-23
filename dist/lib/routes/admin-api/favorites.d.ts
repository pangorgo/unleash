import { Response } from 'express';
import Controller from '../controller';
import { IUnleashConfig, IUnleashServices } from '../../types';
import { IAuthRequest } from '../unleash-types';
export default class FavoritesController extends Controller {
    private favoritesService;
    private logger;
    private openApiService;
    constructor(config: IUnleashConfig, { favoritesService, openApiService, }: Pick<IUnleashServices, 'favoritesService' | 'openApiService'>);
    addFavoriteFeature(req: IAuthRequest<{
        featureName: string;
    }>, res: Response): Promise<void>;
    removeFavoriteFeature(req: IAuthRequest<{
        featureName: string;
    }>, res: Response): Promise<void>;
    addFavoriteProject(req: IAuthRequest<{
        projectId: string;
    }>, res: Response): Promise<void>;
    removeFavoriteProject(req: IAuthRequest<{
        projectId: string;
    }>, res: Response): Promise<void>;
}
