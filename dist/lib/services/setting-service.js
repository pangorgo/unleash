"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../types/events");
class SettingService {
    constructor({ settingStore, eventStore, }, config) {
        this.config = config;
        this.logger = config.getLogger('services/setting-service.ts');
        this.settingStore = settingStore;
        this.eventStore = eventStore;
    }
    async get(id, defaultValue) {
        const value = await this.settingStore.get(id);
        return value || defaultValue;
    }
    async insert(id, value, createdBy) {
        const exists = await this.settingStore.exists(id);
        if (exists) {
            await this.settingStore.updateRow(id, value);
            await this.eventStore.store(new events_1.SettingUpdatedEvent({
                createdBy,
                data: { id },
            }));
        }
        else {
            await this.settingStore.insert(id, value);
            await this.eventStore.store(new events_1.SettingCreatedEvent({
                createdBy,
                data: { id },
            }));
        }
    }
    async delete(id, createdBy) {
        await this.settingStore.delete(id);
        await this.eventStore.store(new events_1.SettingDeletedEvent({
            createdBy,
            data: {
                id,
            },
        }));
    }
    async deleteAll() {
        await this.settingStore.deleteAll();
    }
}
exports.default = SettingService;
//# sourceMappingURL=setting-service.js.map