"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mustache_1 = __importDefault(require("mustache"));
const addon_1 = __importDefault(require("./addon"));
const webhook_definition_1 = __importDefault(require("./webhook-definition"));
class Webhook extends addon_1.default {
    constructor(args) {
        super(webhook_definition_1.default, args);
    }
    async handleEvent(event, parameters) {
        const { url, bodyTemplate, contentType, authorization, customHeaders } = parameters;
        const context = {
            event,
        };
        let body;
        if (typeof bodyTemplate === 'string' && bodyTemplate.length > 1) {
            body = mustache_1.default.render(bodyTemplate, context);
        }
        else {
            body = JSON.stringify(event);
        }
        let extraHeaders = {};
        if (typeof customHeaders === 'string' && customHeaders.length > 1) {
            try {
                extraHeaders = JSON.parse(customHeaders);
            }
            catch (e) {
                this.logger.warn(`Could not parse the json in the customHeaders parameter. [${customHeaders}]`);
            }
        }
        const requestOpts = {
            method: 'POST',
            headers: {
                'Content-Type': contentType || 'application/json',
                Authorization: authorization || undefined,
                ...extraHeaders,
            },
            body,
        };
        const res = await this.fetchRetry(url, requestOpts);
        this.logger.info(`Handled event "${event.type}". Status code: ${res.status}`);
    }
}
exports.default = Webhook;
//# sourceMappingURL=webhook.js.map