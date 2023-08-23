"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const name_exists_error_1 = __importDefault(require("../error/name-exists-error"));
const tag_type_schema_1 = require("./tag-type-schema");
const events_1 = require("../types/events");
class TagTypeService {
    constructor({ tagTypeStore, eventStore, }, { getLogger }) {
        this.tagTypeStore = tagTypeStore;
        this.eventStore = eventStore;
        this.logger = getLogger('services/tag-type-service.js');
    }
    async getAll() {
        return this.tagTypeStore.getAll();
    }
    async getTagType(name) {
        return this.tagTypeStore.get(name);
    }
    async createTagType(newTagType, userName) {
        const data = (await tag_type_schema_1.tagTypeSchema.validateAsync(newTagType));
        await this.validateUnique(data.name);
        await this.tagTypeStore.createTagType(data);
        await this.eventStore.store({
            type: events_1.TAG_TYPE_CREATED,
            createdBy: userName || 'unleash-system',
            data,
        });
        return data;
    }
    async validateUnique(name) {
        const exists = await this.tagTypeStore.exists(name);
        if (exists) {
            throw new name_exists_error_1.default(`There already exists a tag-type with the name ${name}`);
        }
        return Promise.resolve(true);
    }
    async validate(tagType) {
        await tag_type_schema_1.tagTypeSchema.validateAsync(tagType);
        if (tagType && tagType.name) {
            await this.validateUnique(tagType.name);
        }
    }
    async deleteTagType(name, userName) {
        await this.tagTypeStore.delete(name);
        await this.eventStore.store({
            type: events_1.TAG_TYPE_DELETED,
            createdBy: userName || 'unleash-system',
            data: { name },
        });
    }
    async updateTagType(updatedTagType, userName) {
        const data = await tag_type_schema_1.tagTypeSchema.validateAsync(updatedTagType);
        await this.tagTypeStore.updateTagType(data);
        await this.eventStore.store({
            type: events_1.TAG_TYPE_UPDATED,
            createdBy: userName || 'unleash-system',
            data,
        });
        return data;
    }
}
exports.default = TagTypeService;
module.exports = TagTypeService;
//# sourceMappingURL=tag-type-service.js.map