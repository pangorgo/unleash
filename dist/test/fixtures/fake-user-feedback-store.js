"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FakeUserFeedbackStore {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delete(key) {
        return Promise.resolve(undefined);
    }
    deleteAll() {
        return Promise.resolve(undefined);
    }
    destroy() { }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exists(key) {
        return Promise.resolve(false);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    get(key) {
        return Promise.resolve(undefined);
    }
    getAll() {
        return Promise.resolve([]);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAllUserFeedback(userId) {
        return Promise.resolve([]);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getFeedback(userId, feedbackId) {
        return Promise.resolve(undefined);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateFeedback(feedback) {
        return Promise.resolve(undefined);
    }
}
exports.default = FakeUserFeedbackStore;
//# sourceMappingURL=fake-user-feedback-store.js.map