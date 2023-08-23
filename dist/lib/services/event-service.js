"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventService {
    constructor({ eventStore }, { getLogger }) {
        this.logger = getLogger('services/event-service.ts');
        this.eventStore = eventStore;
    }
    async getEvents() {
        let totalEvents = await this.eventStore.count();
        let events = await this.eventStore.getEvents();
        return {
            events,
            totalEvents,
        };
    }
    async searchEvents(search) {
        let totalEvents = await this.eventStore.filteredCount(search);
        let events = await this.eventStore.searchEvents(search);
        return {
            events,
            totalEvents,
        };
    }
}
exports.default = EventService;
//# sourceMappingURL=event-service.js.map