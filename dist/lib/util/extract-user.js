"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractUsername = exports.extractUsernameFromUser = void 0;
function extractUsernameFromUser(user) {
    return user ? user.email || user.username : 'unknown';
}
exports.extractUsernameFromUser = extractUsernameFromUser;
function extractUsername(req) {
    return extractUsernameFromUser(req.user);
}
exports.extractUsername = extractUsername;
//# sourceMappingURL=extract-user.js.map