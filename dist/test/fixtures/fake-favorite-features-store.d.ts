import { IFavoriteFeaturesStore } from '../../lib/types';
import { IFavoriteFeatureKey } from '../../lib/types/stores/favorite-features';
import { IFavoriteFeature } from '../../lib/types/favorites';
export default class FakeFavoriteFeaturesStore implements IFavoriteFeaturesStore {
    addFavoriteFeature(favorite: IFavoriteFeatureKey): Promise<IFavoriteFeature>;
    delete(key: IFavoriteFeatureKey): Promise<void>;
    deleteAll(): Promise<void>;
    destroy(): void;
    exists(key: IFavoriteFeatureKey): Promise<boolean>;
    get(key: IFavoriteFeatureKey): Promise<IFavoriteFeature>;
    getAll(query?: Object): Promise<IFavoriteFeature[]>;
}
