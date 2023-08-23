"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unleash_error_1 = require("./unleash-error");
class ProjectWithoutOwnerError extends unleash_error_1.UnleashError {
    constructor() {
        super('A project must have at least one owner');
        this.statusCode = 409;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            details: [
                {
                    description: this.message,
                    message: this.message,
                    validationErrors: [],
                },
            ],
        };
    }
}
exports.default = ProjectWithoutOwnerError;
//# sourceMappingURL=project-without-owner-error.js.map