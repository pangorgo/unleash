"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notfound_error_1 = __importDefault(require("../../lib/error/notfound-error"));
class FakeFeatureToggleStore {
    constructor() {
        this.features = [];
    }
    async archive(featureName) {
        const feature = this.features.find((f) => f.name === featureName);
        if (feature) {
            feature.archived = true;
            return feature;
        }
        throw new notfound_error_1.default(`Could not find feature toggle with name ${featureName}`);
    }
    async batchArchive(featureNames) {
        const features = this.features.filter((feature) => featureNames.includes(feature.name));
        for (const feature of features) {
            feature.archived = true;
        }
        return features;
    }
    async batchStale(featureNames, stale) {
        const features = this.features.filter((feature) => featureNames.includes(feature.name));
        for (const feature of features) {
            feature.stale = stale;
        }
        return features;
    }
    async batchDelete(featureNames) {
        this.features = this.features.filter((feature) => !featureNames.includes(feature.name));
        return Promise.resolve();
    }
    async batchRevive(featureNames) {
        const features = this.features.filter((f) => featureNames.includes(f.name));
        for (const feature of features) {
            feature.archived = false;
        }
        return features;
    }
    async count(query) {
        return this.features.filter(this.getFilterQuery(query)).length;
    }
    async getAllByNames(names) {
        return this.features.filter((f) => names.includes(f.name));
    }
    async getProjectId(name) {
        return this.get(name).then((f) => f.project);
    }
    getFilterQuery(query) {
        return (f) => {
            let projectMatch = true;
            if (query.project) {
                projectMatch = f.project === query.project;
            }
            let archiveMatch = true;
            if (query.archived) {
                archiveMatch = f.archived === query.archived;
            }
            let staleMatch = true;
            if (query.stale) {
                staleMatch = f.stale === query.stale;
            }
            return projectMatch && archiveMatch && staleMatch;
        };
    }
    async create(project, data) {
        const inserted = { ...data, project };
        this.features.push(inserted);
        return inserted;
    }
    async delete(key) {
        this.features.splice(this.features.findIndex((f) => f.name === key), 1);
    }
    async deleteAll() {
        this.features = [];
    }
    destroy() { }
    async exists(key) {
        return this.features.some((f) => f.name === key);
    }
    async get(key) {
        const feature = this.features.find((f) => f.name === key);
        if (feature) {
            return feature;
        }
        throw new notfound_error_1.default(`Could not find feature with name ${key}`);
    }
    async getAll() {
        return this.features.filter((f) => !f.archived);
    }
    async getFeatureMetadata(name) {
        return this.get(name);
    }
    async getBy(query) {
        return this.features.filter(this.getFilterQuery(query));
    }
    async revive(featureName) {
        const revive = this.features.find((f) => f.name === featureName);
        if (revive) {
            revive.archived = false;
        }
        return this.update(revive.project, revive);
    }
    async update(project, data) {
        const exists = await this.exists(data.name);
        if (exists) {
            const id = this.features.findIndex((f) => f.name === data.name);
            const old = this.features.find((f) => f.name === data.name);
            const updated = { ...old, ...data };
            this.features.splice(id, 1);
            this.features.push(updated);
            return updated;
        }
        throw new notfound_error_1.default('Could not find feature to update');
    }
    async setLastSeen(data) {
        const envArrays = data.reduce((acc, feature) => {
            const { environment, featureName } = feature;
            if (!acc[environment]) {
                acc[environment] = [];
            }
            acc[environment].push(featureName);
            return acc;
        }, {});
        for (const env of Object.keys(envArrays)) {
            const toggleNames = envArrays[env];
            if (toggleNames && Array.isArray(toggleNames)) {
                toggleNames.forEach((t) => {
                    const toUpdate = this.features.find((f) => f.name === t);
                    if (toUpdate) {
                        toUpdate.lastSeenAt = new Date();
                    }
                });
            }
        }
    }
    async getVariants(featureName) {
        const feature = await this.get(featureName);
        return feature.variants;
    }
    async getAllVariants() {
        let features = await this.getAll();
        let variants = features.flatMap((feature) => ({
            featureName: feature.name,
            environment: 'development',
            variants: feature.variants,
            enabled: true,
        }));
        return Promise.resolve(variants);
    }
    getVariantsForEnv(featureName, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    environment_name) {
        return this.getVariants(featureName);
    }
    async saveVariants(project, featureName, newVariants) {
        const feature = await this.get(featureName);
        feature.variants = newVariants;
        return feature;
    }
    async saveVariantsOnEnv(featureName, environment, newVariants) {
        await this.saveVariants('default', featureName, newVariants);
        return Promise.resolve(newVariants);
    }
    async countByDate(queryModifiers) {
        return this.features.filter((feature) => {
            if (feature.archived === queryModifiers.archived) {
                return true;
            }
            if (feature.project === queryModifiers.project) {
                return true;
            }
            if (new Date(feature[queryModifiers.dateAccessor]).getTime() >=
                new Date(queryModifiers.date).getTime()) {
                return true;
            }
            const featureDate = new Date(feature[queryModifiers.dateAccessor]).getTime();
            if (featureDate >= new Date(queryModifiers.range[0]).getTime() &&
                featureDate <= new Date(queryModifiers.range[1]).getTime()) {
                return true;
            }
        }).length;
    }
    dropAllVariants() {
        this.features.forEach((feature) => (feature.variants = []));
        return Promise.resolve();
    }
    updatePotentiallyStaleFeatures() {
        throw new Error('Method not implemented.');
    }
    isPotentiallyStale() {
        throw new Error('Method not implemented.');
    }
}
exports.default = FakeFeatureToggleStore;
//# sourceMappingURL=fake-feature-toggle-store.js.map