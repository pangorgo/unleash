"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventAnnouncer {
    constructor({ eventStore }, { getLogger }) {
        this.logger = getLogger('services/event-service.ts');
        this.eventStore = eventStore;
    }
    async publishUnannouncedEvents() {
        return this.eventStore.publishUnannouncedEvents();
    }
}
exports.default = EventAnnouncer;
//# sourceMappingURL=event-announcer-service.js.map