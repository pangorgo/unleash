"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FakeUserSplashStore {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAllUserSplashes(userId) {
        return Promise.resolve([]);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getSplash(userId, splashId) {
        return Promise.resolve(undefined);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateSplash(splash) {
        return Promise.resolve(undefined);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exists(key) {
        return Promise.resolve(false);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    get(key) {
        return Promise.resolve(undefined);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAll() {
        return Promise.resolve([]);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delete(key) {
        return Promise.resolve(undefined);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteAll() {
        return Promise.resolve(undefined);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    destroy() { }
}
exports.default = FakeUserSplashStore;
//# sourceMappingURL=fake-user-splash-store.js.map