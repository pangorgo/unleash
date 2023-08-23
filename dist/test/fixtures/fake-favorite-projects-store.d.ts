import { IFavoriteProjectsStore } from '../../lib/types';
import { IFavoriteProjectKey } from '../../lib/types/stores/favorite-projects';
import { IFavoriteProject } from '../../lib/types/favorites';
export default class FakeFavoriteProjectsStore implements IFavoriteProjectsStore {
    addFavoriteProject(favorite: IFavoriteProjectKey): Promise<IFavoriteProject>;
    delete(key: IFavoriteProjectKey): Promise<void>;
    deleteAll(): Promise<void>;
    destroy(): void;
    exists(key: IFavoriteProjectKey): Promise<boolean>;
    get(key: IFavoriteProjectKey): Promise<IFavoriteProject>;
    getAll(query?: Object): Promise<IFavoriteProject[]>;
}
