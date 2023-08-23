"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addon_1 = __importDefault(require("./addon"));
const datadog_definition_1 = __importDefault(require("./datadog-definition"));
const feature_event_formatter_md_1 = require("./feature-event-formatter-md");
class DatadogAddon extends addon_1.default {
    constructor(config) {
        super(datadog_definition_1.default, config);
        this.msgFormatter = new feature_event_formatter_md_1.FeatureEventFormatterMd(config.unleashUrl, feature_event_formatter_md_1.LinkStyle.MD);
    }
    async handleEvent(event, parameters) {
        const { url = 'https://api.datadoghq.com/api/v1/events', apiKey, sourceTypeName, customHeaders, } = parameters;
        const text = this.msgFormatter.format(event);
        const { tags: eventTags } = event;
        const tags = eventTags && eventTags.map((tag) => `${tag.type}:${tag.value}`);
        const body = {
            text: `%%% \n ${text} \n %%% `,
            title: 'Unleash notification update',
            tags,
        };
        if (sourceTypeName) {
            body.source_type_name = sourceTypeName;
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
                'Content-Type': 'application/json',
                'DD-API-KEY': apiKey,
                ...extraHeaders,
            },
            body: JSON.stringify(body),
        };
        const res = await this.fetchRetry(url, requestOpts);
        this.logger.info(`Handled event ${event.type}. Status codes=${res.status}`);
    }
}
exports.default = DatadogAddon;
//# sourceMappingURL=datadog.js.map