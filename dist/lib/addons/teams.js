"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addon_1 = __importDefault(require("./addon"));
const teams_definition_1 = __importDefault(require("./teams-definition"));
const feature_event_formatter_md_1 = require("./feature-event-formatter-md");
class TeamsAddon extends addon_1.default {
    constructor(args) {
        super(teams_definition_1.default, args);
        this.msgFormatter = new feature_event_formatter_md_1.FeatureEventFormatterMd(args.unleashUrl);
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async handleEvent(event, parameters) {
        const { url, customHeaders } = parameters;
        const { createdBy } = event;
        const text = this.msgFormatter.format(event);
        const featureLink = this.msgFormatter.featureLink(event);
        const body = {
            themeColor: '0076D7',
            summary: 'Message',
            sections: [
                {
                    activityTitle: text,
                    activitySubtitle: 'Unleash notification update',
                    facts: [
                        {
                            name: 'User',
                            value: createdBy,
                        },
                        {
                            name: 'Action',
                            value: event.type,
                        },
                    ],
                },
            ],
            potentialAction: [
                {
                    '@type': 'OpenUri',
                    name: 'Go to feature',
                    targets: [
                        {
                            os: 'default',
                            uri: featureLink,
                        },
                    ],
                },
            ],
        };
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
            headers: { 'Content-Type': 'application/json', ...extraHeaders },
            body: JSON.stringify(body),
        };
        const res = await this.fetchRetry(url, requestOpts);
        this.logger.info(`Handled event ${event.type}. Status codes=${res.status}`);
    }
}
exports.default = TeamsAddon;
//# sourceMappingURL=teams.js.map