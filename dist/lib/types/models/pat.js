"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Pat {
    constructor({ id, userId, expiresAt, seenAt, createdAt, secret, description, }) {
        this.id = id;
        this.secret = secret;
        this.userId = userId;
        this.expiresAt = expiresAt;
        this.seenAt = seenAt;
        this.createdAt = createdAt;
        this.description = description;
    }
}
exports.default = Pat;
//# sourceMappingURL=pat.js.map