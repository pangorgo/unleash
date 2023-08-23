"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FakeSegmentStore {
    count() {
        return Promise.resolve(0);
    }
    create() {
        throw new Error('Method not implemented.');
    }
    async delete() {
        return;
    }
    async deleteAll() {
        return;
    }
    async exists() {
        return false;
    }
    get() {
        throw new Error('Method not implemented.');
    }
    async getAll() {
        return [];
    }
    async getActive() {
        return [];
    }
    async getActiveForClient() {
        return [];
    }
    async getByStrategy() {
        return [];
    }
    update() {
        throw new Error('Method not implemented.');
    }
    addToStrategy() {
        throw new Error('Method not implemented.');
    }
    removeFromStrategy() {
        throw new Error('Method not implemented.');
    }
    async getAllFeatureStrategySegments() {
        return [];
    }
    async existsByName() {
        throw new Error('Method not implemented.');
    }
    destroy() { }
}
exports.default = FakeSegmentStore;
//# sourceMappingURL=fake-segment-store.js.map