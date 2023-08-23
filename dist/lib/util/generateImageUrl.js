"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImageUrl = void 0;
const gravatar_url_1 = __importDefault(require("gravatar-url"));
const generateImageUrl = (user) => (0, gravatar_url_1.default)(user.email || user.username || String(user.id), {
    size: 42,
    default: 'retro',
});
exports.generateImageUrl = generateImageUrl;
//# sourceMappingURL=generateImageUrl.js.map