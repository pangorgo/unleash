"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
const events_1 = require("../types/events");
const tag_schema_1 = require("./tag-schema");
const error_1 = require("../../lib/error");
class FeatureTagService {
    constructor({ tagStore, featureTagStore, eventStore, featureToggleStore, }, { getLogger }) {
        this.logger = getLogger('/services/feature-tag-service.ts');
        this.tagStore = tagStore;
        this.featureTagStore = featureTagStore;
        this.featureToggleStore = featureToggleStore;
        this.eventStore = eventStore;
    }
    async listTags(featureName) {
        return this.featureTagStore.getAllTagsForFeature(featureName);
    }
    async listFeatures(tagValue) {
        return this.featureTagStore.getAllFeaturesForTag(tagValue);
    }
    // TODO: add project Id
    async addTag(featureName, tag, userName) {
        const featureToggle = await this.featureToggleStore.get(featureName);
        const validatedTag = await tag_schema_1.tagSchema.validateAsync(tag);
        await this.createTagIfNeeded(validatedTag, userName);
        await this.featureTagStore.tagFeature(featureName, validatedTag);
        await this.eventStore.store({
            type: events_1.FEATURE_TAGGED,
            createdBy: userName,
            featureName,
            project: featureToggle.project,
            data: validatedTag,
        });
        return validatedTag;
    }
    async updateTags(featureNames, addedTags, removedTags, userName) {
        const featureToggles = await this.featureToggleStore.getAllByNames(featureNames);
        await Promise.all(addedTags.map((tag) => this.createTagIfNeeded(tag, userName)));
        const createdFeatureTags = featureNames.flatMap((featureName) => addedTags.map((addedTag) => ({
            featureName,
            tagType: addedTag.type,
            tagValue: addedTag.value,
        })));
        await this.featureTagStore.tagFeatures(createdFeatureTags);
        const removedFeatureTags = featureNames.flatMap((featureName) => removedTags.map((addedTag) => ({
            featureName,
            tagType: addedTag.type,
            tagValue: addedTag.value,
        })));
        await this.featureTagStore.untagFeatures(removedFeatureTags);
        const creationEvents = featureToggles.flatMap((featureToggle) => addedTags.map((addedTag) => ({
            type: events_1.FEATURE_TAGGED,
            createdBy: userName,
            featureName: featureToggle.name,
            project: featureToggle.project,
            data: addedTag,
        })));
        const removalEvents = featureToggles.flatMap((featureToggle) => removedTags.map((removedTag) => ({
            type: events_1.FEATURE_UNTAGGED,
            createdBy: userName,
            featureName: featureToggle.name,
            project: featureToggle.project,
            data: removedTag,
        })));
        await this.eventStore.batchStore([...creationEvents, ...removalEvents]);
    }
    async createTagIfNeeded(tag, userName) {
        try {
            await this.tagStore.getTag(tag.type, tag.value);
        }
        catch (error) {
            if (error instanceof notfound_error_1.default) {
                try {
                    await this.tagStore.createTag(tag);
                    await this.eventStore.store({
                        type: events_1.TAG_CREATED,
                        createdBy: userName,
                        data: tag,
                    });
                }
                catch (err) {
                    if (err.code === error_1.FOREIGN_KEY_VIOLATION) {
                        throw new error_1.BadDataError(`Tag type '${tag.type}' does not exist`);
                    }
                }
            }
        }
    }
    // TODO: add project Id
    async removeTag(featureName, tag, userName) {
        const featureToggle = await this.featureToggleStore.get(featureName);
        await this.featureTagStore.untagFeature(featureName, tag);
        await this.eventStore.store({
            type: events_1.FEATURE_UNTAGGED,
            createdBy: userName,
            featureName,
            project: featureToggle.project,
            data: tag,
        });
    }
}
exports.default = FeatureTagService;
//# sourceMappingURL=feature-tag-service.js.map