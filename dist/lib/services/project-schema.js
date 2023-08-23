"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const util_1 = require("../routes/util");
exports.projectSchema = joi_1.default
    .object()
    .keys({
    id: util_1.nameType,
    name: joi_1.default.string().required(),
    description: joi_1.default.string().allow(null).allow('').optional(),
    mode: joi_1.default.string().valid('open', 'protected').default('open'),
    defaultStickiness: joi_1.default.string().default('default'),
    featureLimit: joi_1.default.number().allow(null).optional(),
})
    .options({ allowUnknown: false, stripUnknown: true });
//# sourceMappingURL=project-schema.js.map