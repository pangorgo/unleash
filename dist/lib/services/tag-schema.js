"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const util_1 = require("../routes/util");
const openapi_1 = require("../../lib/openapi");
exports.tagSchema = joi_1.default.object()
    .keys({
    value: joi_1.default.string().min(openapi_1.TAG_MIN_LENGTH).max(openapi_1.TAG_MAX_LENGTH),
    type: util_1.customJoi
        .isUrlFriendly()
        .min(openapi_1.TAG_MIN_LENGTH)
        .max(openapi_1.TAG_MAX_LENGTH)
        .default('simple'),
})
    .options({
    allowUnknown: false,
    stripUnknown: true,
    abortEarly: false,
});
module.exports = { tagSchema: exports.tagSchema };
//# sourceMappingURL=tag-schema.js.map