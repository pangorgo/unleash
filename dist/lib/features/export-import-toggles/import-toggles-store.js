"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportTogglesStore = void 0;
const T = {
    featureStrategies: 'feature_strategies',
    features: 'features',
    featureTag: 'feature_tag',
};
class ImportTogglesStore {
    constructor(db) {
        this.db = db;
    }
    async getDisplayPermissions(names) {
        const rows = await this.db
            .from('permissions')
            .whereIn('permission', names);
        return rows.map((row) => ({
            name: row.permission,
            displayName: row.display_name,
        }));
    }
    async deleteStrategiesForFeatures(featureNames, environment) {
        return this.db(T.featureStrategies)
            .where({ environment })
            .whereIn('feature_name', featureNames)
            .del();
    }
    async strategiesExistForFeatures(featureNames, environment) {
        if (featureNames.length === 0)
            return true;
        const result = await this.db.raw('SELECT EXISTS (SELECT 1 FROM feature_strategies WHERE environment = ? and feature_name in  (' +
            featureNames.map(() => '?').join(',') +
            ')) AS present', [environment, ...featureNames]);
        const { present } = result.rows[0];
        return present;
    }
    async getArchivedFeatures(featureNames) {
        const rows = await this.db(T.features)
            .select('name')
            .whereNot('archived_at', null)
            .whereIn('name', featureNames);
        return rows.map((row) => row.name);
    }
    async getExistingFeatures(featureNames) {
        const rows = await this.db(T.features).whereIn('name', featureNames);
        return rows.map((row) => row.name);
    }
    async getFeaturesInOtherProjects(featureNames, project) {
        const rows = await this.db(T.features)
            .select(['name', 'project'])
            .whereNot('project', project)
            .whereIn('name', featureNames);
        return rows.map((row) => ({ name: row.name, project: row.project }));
    }
    async deleteTagsForFeatures(features) {
        return this.db(T.featureTag).whereIn('feature_name', features).del();
    }
}
exports.ImportTogglesStore = ImportTogglesStore;
//# sourceMappingURL=import-toggles-store.js.map