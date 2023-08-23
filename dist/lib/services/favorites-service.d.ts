import { IUnleashConfig } from '../types/option';
import { IUnleashStores } from '../types/stores';
import { IFavoriteFeature, IFavoriteProject } from '../types/favorites';
import User from '../types/user';
import { IFavoriteProjectKey } from '../types/stores/favorite-projects';
export interface IFavoriteFeatureProps {
    feature: string;
    user: User;
}
export interface IFavoriteProjectProps {
    project: string;
    user: User;
}
export declare class FavoritesService {
    private config;
    private logger;
    private favoriteFeaturesStore;
    private favoriteProjectsStore;
    private eventStore;
    constructor({ favoriteFeaturesStore, favoriteProjectsStore, eventStore, }: Pick<IUnleashStores, 'favoriteFeaturesStore' | 'favoriteProjectsStore' | 'eventStore'>, config: IUnleashConfig);
    favoriteFeature({ feature, user, }: IFavoriteFeatureProps): Promise<IFavoriteFeature>;
    unfavoriteFeature({ feature, user, }: IFavoriteFeatureProps): Promise<void>;
    favoriteProject({ project, user, }: IFavoriteProjectProps): Promise<IFavoriteProject>;
    unfavoriteProject({ project, user, }: IFavoriteProjectProps): Promise<void>;
    isFavoriteProject(favorite: IFavoriteProjectKey): Promise<boolean>;
}
