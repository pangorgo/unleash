"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountTypes = void 0;
const joi_1 = __importStar(require("joi"));
const generateImageUrl_1 = require("../util/generateImageUrl");
exports.AccountTypes = ['User', 'Service Account'];
class User {
    constructor({ id, name, email, username, imageUrl, seenAt, loginAttempts, createdAt, isService, }) {
        this.isAPI = false;
        this.accountType = 'User';
        if (!id) {
            throw new joi_1.ValidationError('Id is required', [], undefined);
        }
        joi_1.default.assert(email, joi_1.default.string().email(), 'Email');
        joi_1.default.assert(username, joi_1.default.string(), 'Username');
        joi_1.default.assert(name, joi_1.default.string(), 'Name');
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.imageUrl = imageUrl || this.generateImageUrl();
        this.seenAt = seenAt;
        this.loginAttempts = loginAttempts;
        this.createdAt = createdAt;
        this.accountType = isService ? 'Service Account' : 'User';
    }
    generateImageUrl() {
        return (0, generateImageUrl_1.generateImageUrl)(this);
    }
}
exports.default = User;
module.exports = User;
//# sourceMappingURL=user.js.map