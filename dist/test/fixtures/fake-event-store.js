"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const anyEventEmitter_1 = require("../../lib/util/anyEventEmitter");
class FakeEventStore {
    constructor() {
        this.eventEmitter = anyEventEmitter_1.sharedEventEmitter;
        this.eventEmitter.setMaxListeners(0);
        this.events = [];
    }
    getMaxRevisionId() {
        return Promise.resolve(1);
    }
    store(event) {
        this.events.push(event);
        this.eventEmitter.emit(event.type, event);
        return Promise.resolve();
    }
    batchStore(events) {
        events.forEach((event) => {
            this.events.push(event);
            this.eventEmitter.emit(event.type, event);
        });
        return Promise.resolve();
    }
    async getEvents() {
        return this.events;
    }
    async delete(key) {
        this.events.splice(this.events.findIndex((t) => t.id === key), 1);
    }
    async deleteAll() {
        this.events = [];
    }
    async count() {
        return Promise.resolve(this.events.length);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filteredCount(search) {
        return Promise.resolve(0);
    }
    destroy() { }
    async exists(key) {
        return this.events.some((e) => e.id === key);
    }
    async get(key) {
        return this.events.find((e) => e.id === key);
    }
    async getAll() {
        return this.events;
    }
    async searchEvents() {
        throw new Error('Method not implemented.');
    }
    async getForFeatures(features, environments, query) {
        return this.events.filter((event) => {
            return (event.type === query.type &&
                event.project === query.projectId &&
                features.includes(event.data.featureName) &&
                environments.includes(event.data.environment));
        });
    }
    async query(operations) {
        if (operations)
            return [];
        return [];
    }
    async queryCount(operations) {
        if (operations)
            return 0;
        return 0;
    }
    setMaxListeners(number) {
        return this.eventEmitter.setMaxListeners(number);
    }
    on(eventName, listener) {
        return this.eventEmitter.on(eventName, listener);
    }
    emit(eventName, ...args) {
        return this.eventEmitter.emit(eventName, ...args);
    }
    off(eventName, listener) {
        return this.eventEmitter.off(eventName, listener);
    }
    publishUnannouncedEvents() {
        throw new Error('Method not implemented.');
    }
}
module.exports = FakeEventStore;
exports.default = FakeEventStore;
//# sourceMappingURL=fake-event-store.js.map