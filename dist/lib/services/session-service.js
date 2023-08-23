"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SessionService {
    constructor({ sessionStore }, { getLogger }) {
        this.logger = getLogger('lib/services/session-service.ts');
        this.sessionStore = sessionStore;
    }
    async getActiveSessions() {
        return this.sessionStore.getActiveSessions();
    }
    async getSessionsForUser(userId) {
        return this.sessionStore.getSessionsForUser(userId);
    }
    async getSession(sid) {
        return this.sessionStore.get(sid);
    }
    async deleteSessionsForUser(userId) {
        return this.sessionStore.deleteSessionsForUser(userId);
    }
    async deleteSession(sid) {
        return this.sessionStore.delete(sid);
    }
    async insertSession({ sid, sess, }) {
        return this.sessionStore.insertSession({ sid, sess });
    }
}
exports.default = SessionService;
module.exports = SessionService;
//# sourceMappingURL=session-service.js.map