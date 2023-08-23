"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoritesService = void 0;
const types_1 = require("../types");
const util_1 = require("../util");
class FavoritesService {
    constructor({ favoriteFeaturesStore, favoriteProjectsStore, eventStore, }, config) {
        this.config = config;
        this.logger = config.getLogger('services/favorites-service.ts');
        this.favoriteFeaturesStore = favoriteFeaturesStore;
        this.favoriteProjectsStore = favoriteProjectsStore;
        this.eventStore = eventStore;
    }
    async favoriteFeature({ feature, user, }) {
        const data = await this.favoriteFeaturesStore.addFavoriteFeature({
            feature: feature,
            userId: user.id,
        });
        await this.eventStore.store({
            type: types_1.FEATURE_FAVORITED,
            createdBy: (0, util_1.extractUsernameFromUser)(user),
            data: {
                feature,
            },
        });
        return data;
    }
    async unfavoriteFeature({ feature, user, }) {
        const data = await this.favoriteFeaturesStore.delete({
            feature: feature,
            userId: user.id,
        });
        await this.eventStore.store({
            type: types_1.FEATURE_UNFAVORITED,
            createdBy: (0, util_1.extractUsernameFromUser)(user),
            data: {
                feature,
            },
        });
        return data;
    }
    async favoriteProject({ project, user, }) {
        const data = this.favoriteProjectsStore.addFavoriteProject({
            project,
            userId: user.id,
        });
        await this.eventStore.store({
            type: types_1.PROJECT_FAVORITED,
            createdBy: (0, util_1.extractUsernameFromUser)(user),
            data: {
                project,
            },
        });
        return data;
    }
    async unfavoriteProject({ project, user, }) {
        const data = this.favoriteProjectsStore.delete({
            project: project,
            userId: user.id,
        });
        await this.eventStore.store({
            type: types_1.PROJECT_UNFAVORITED,
            createdBy: (0, util_1.extractUsernameFromUser)(user),
            data: {
                project,
            },
        });
        return data;
    }
    async isFavoriteProject(favorite) {
        if (favorite.userId) {
            return this.favoriteProjectsStore.exists(favorite);
        }
        return Promise.resolve(false);
    }
}
exports.FavoritesService = FavoritesService;
//# sourceMappingURL=favorites-service.js.map