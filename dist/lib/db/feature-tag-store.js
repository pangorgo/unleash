"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const metrics_helper_1 = __importDefault(require("../util/metrics-helper"));
const metric_events_1 = require("../metric-events");
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
const COLUMNS = ['feature_name', 'tag_type', 'tag_value'];
const TABLE = 'feature_tag';
class FeatureTagStore {
    constructor(db, eventBus, getLogger) {
        this.db = db;
        this.logger = getLogger('feature-tag-store.ts');
        this.timer = (action) => metrics_helper_1.default.wrapTimer(eventBus, metric_events_1.DB_TIME, {
            store: 'feature-toggle',
            action,
        });
    }
    async delete({ featureName, tagType, tagValue, }) {
        await this.db(TABLE)
            .where({
            feature_name: featureName,
            tag_type: tagType,
            tag_value: tagValue,
        })
            .del();
    }
    destroy() { }
    async exists({ featureName, tagType, tagValue, }) {
        const result = await this.db.raw(`SELECT EXISTS (SELECT 1 FROM ${TABLE} WHERE feature_name = ? AND tag_type = ? AND tag_value = ?) AS present`, [featureName, tagType, tagValue]);
        const { present } = result.rows[0];
        return present;
    }
    async get({ featureName, tagType, tagValue, }) {
        const row = await this.db(TABLE)
            .where({
            feature_name: featureName,
            tag_type: tagType,
            tag_value: tagValue,
        })
            .first();
        return {
            featureName: row.feature_name,
            tagType: row.tag_type,
            tagValue: row.tag_value,
        };
    }
    async getAll() {
        const rows = await this.db(TABLE).select(COLUMNS);
        return rows.map((row) => ({
            featureName: row.feature_name,
            tagType: row.tag_type,
            tagValue: row.tag_value,
        }));
    }
    async getAllTagsForFeature(featureName) {
        const stopTimer = this.timer('getAllForFeature');
        if (await this.featureExists(featureName)) {
            const rows = await this.db
                .select(COLUMNS)
                .from(TABLE)
                .where({ feature_name: featureName });
            stopTimer();
            return rows.map(this.featureTagRowToTag);
        }
        else {
            throw new notfound_error_1.default(`Could not find feature with name ${featureName}`);
        }
    }
    async getAllFeaturesForTag(tagValue) {
        const rows = await this.db
            .select('feature_name')
            .from(TABLE)
            .where({ tag_value: tagValue });
        return rows.map(({ feature_name }) => feature_name);
    }
    async featureExists(featureName) {
        const result = await this.db.raw('SELECT EXISTS (SELECT 1 FROM features WHERE name = ?) AS present', [featureName]);
        const { present } = result.rows[0];
        return present;
    }
    async getAllByFeatures(features) {
        const query = this.db
            .select(COLUMNS)
            .from(TABLE)
            .whereIn('feature_name', features)
            .orderBy('feature_name', 'asc');
        const rows = await query;
        return rows.map((row) => ({
            featureName: row.feature_name,
            tagType: row.tag_type,
            tagValue: row.tag_value,
        }));
    }
    async tagFeature(featureName, tag) {
        const stopTimer = this.timer('tagFeature');
        await this.db(TABLE)
            .insert(this.featureAndTagToRow(featureName, tag))
            .onConflict(COLUMNS)
            .merge();
        stopTimer();
        return tag;
    }
    async untagFeatures(featureTags) {
        const stopTimer = this.timer('untagFeatures');
        try {
            await this.db(TABLE)
                .whereIn(COLUMNS, featureTags.map(this.featureTagArray))
                .delete();
        }
        catch (err) {
            this.logger.error(err);
        }
        stopTimer();
    }
    /**
     * Only gets tags for active feature toggles.
     */
    async getAllFeatureTags() {
        const rows = await this.db(TABLE)
            .select(COLUMNS)
            .whereIn('feature_name', this.db('features').where({ archived: false }).select(['name']));
        return rows.map((row) => ({
            featureName: row.feature_name,
            tagType: row.tag_type,
            tagValue: row.tag_value,
        }));
    }
    async deleteAll() {
        const stopTimer = this.timer('deleteAll');
        await this.db(TABLE).del();
        stopTimer();
    }
    async tagFeatures(featureTags) {
        if (featureTags.length !== 0) {
            const rows = await this.db(TABLE)
                .insert(featureTags.map(this.featureTagToRow))
                .returning(COLUMNS)
                .onConflict(COLUMNS)
                .ignore();
            if (rows) {
                return rows.map(this.rowToFeatureAndTag);
            }
        }
        return [];
    }
    async untagFeature(featureName, tag) {
        const stopTimer = this.timer('untagFeature');
        try {
            await this.db(TABLE)
                .where(this.featureAndTagToRow(featureName, tag))
                .delete();
        }
        catch (err) {
            this.logger.error(err);
        }
        stopTimer();
    }
    featureTagRowToTag(row) {
        return {
            value: row.tag_value,
            type: row.tag_type,
        };
    }
    rowToFeatureAndTag(row) {
        return {
            featureName: row.feature_name,
            tag: {
                type: row.tag_type,
                value: row.tag_value,
            },
        };
    }
    featureTagToRow({ featureName, tagType, tagValue, }) {
        return {
            feature_name: featureName,
            tag_type: tagType,
            tag_value: tagValue,
        };
    }
    featureTagArray({ featureName, tagType, tagValue }) {
        return [featureName, tagType, tagValue];
    }
    featureAndTagToRow(featureName, { type, value }) {
        return {
            feature_name: featureName,
            tag_type: type,
            tag_value: value,
        };
    }
}
module.exports = FeatureTagStore;
exports.default = FeatureTagStore;
//# sourceMappingURL=feature-tag-store.js.map