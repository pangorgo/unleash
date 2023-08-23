"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addon_1 = __importDefault(require("./addon"));
const slack_definition_1 = __importDefault(require("./slack-definition"));
const feature_event_formatter_md_1 = require("./feature-event-formatter-md");
class SlackAddon extends addon_1.default {
    constructor(args) {
        super(slack_definition_1.default, args);
        this.msgFormatter = new feature_event_formatter_md_1.FeatureEventFormatterMd(args.unleashUrl, feature_event_formatter_md_1.LinkStyle.SLACK);
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async handleEvent(event, parameters) {
        const { url, defaultChannel, username = 'Unleash', emojiIcon = ':unleash:', customHeaders, } = parameters;
        const slackChannels = this.findSlackChannels(event);
        if (slackChannels.length === 0) {
            slackChannels.push(defaultChannel);
        }
        const text = this.msgFormatter.format(event);
        const featureLink = this.msgFormatter.featureLink(event);
        const requests = slackChannels.map((channel) => {
            const body = {
                username,
                icon_emoji: emojiIcon,
                text,
                channel: `#${channel}`,
                attachments: [
                    {
                        actions: [
                            {
                                name: 'featureToggle',
                                text: 'Open in Unleash',
                                type: 'button',
                                value: 'featureToggle',
                                style: 'primary',
                                url: featureLink,
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
                headers: {
                    'Content-Type': 'application/json',
                    ...extraHeaders,
                },
                body: JSON.stringify(body),
            };
            return this.fetchRetry(url, requestOpts);
        });
        const results = await Promise.all(requests);
        const codes = results.map((res) => res.status).join(', ');
        this.logger.info(`Handled event ${event.type}. Status codes=${codes}`);
    }
    findSlackChannels({ tags }) {
        if (tags) {
            return tags
                .filter((tag) => tag.type === 'slack')
                .map((t) => t.value);
        }
        return [];
    }
}
exports.default = SlackAddon;
module.exports = SlackAddon;
//# sourceMappingURL=slack.js.map