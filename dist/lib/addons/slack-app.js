"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_api_1 = require("@slack/web-api");
const addon_1 = __importDefault(require("./addon"));
const slack_app_definition_1 = __importDefault(require("./slack-app-definition"));
const SCHEDULE_MESSAGE_DELAY_IN_SECONDS = 10;
const feature_event_formatter_md_1 = require("./feature-event-formatter-md");
class SlackAppAddon extends addon_1.default {
    constructor(args) {
        super(slack_app_definition_1.default, args);
        this.msgFormatter = new feature_event_formatter_md_1.FeatureEventFormatterMd(args.unleashUrl, feature_event_formatter_md_1.LinkStyle.SLACK);
    }
    async handleEvent(event, parameters) {
        try {
            const { accessToken, defaultChannels } = parameters;
            if (!accessToken) {
                this.logger.warn('No access token provided.');
                return;
            }
            const taggedChannels = this.findTaggedChannels(event);
            const eventChannels = taggedChannels.length
                ? taggedChannels
                : this.getDefaultChannels(defaultChannels);
            if (!eventChannels.length) {
                this.logger.debug(`No Slack channels found for event ${event.type}.`);
                return;
            }
            this.logger.debug(`Found candidate channels: ${eventChannels}.`);
            if (!this.slackClient || this.accessToken !== accessToken) {
                const client = new web_api_1.WebClient(accessToken);
                client.on(web_api_1.WebClientEvent.RATE_LIMITED, (numSeconds) => {
                    this.logger.debug(`Rate limit reached for event ${event.type}. Retry scheduled after ${numSeconds} seconds`);
                });
                this.slackClient = client;
                this.accessToken = accessToken;
            }
            const text = this.msgFormatter.format(event);
            const url = this.msgFormatter.featureLink(event);
            const requests = eventChannels.map((name) => {
                const now = Math.floor(new Date().getTime() / 1000);
                const postAt = now + SCHEDULE_MESSAGE_DELAY_IN_SECONDS;
                return this.slackClient.chat.scheduleMessage({
                    channel: name,
                    text,
                    blocks: [
                        {
                            type: 'section',
                            text: {
                                type: 'mrkdwn',
                                text,
                            },
                        },
                        {
                            type: 'actions',
                            elements: [
                                {
                                    type: 'button',
                                    url,
                                    text: {
                                        type: 'plain_text',
                                        text: 'Open in Unleash',
                                    },
                                    value: 'featureToggle',
                                    style: 'primary',
                                },
                            ],
                        },
                    ],
                    post_at: postAt,
                });
            });
            const results = await Promise.allSettled(requests);
            results
                .filter(({ status }) => status === 'rejected')
                .map(({ reason }) => this.logError(event, reason));
            this.logger.info(`Handled event ${event.type} dispatching ${results.filter(({ status }) => status === 'fulfilled')
                .length} out of ${requests.length} messages successfully.`);
        }
        catch (error) {
            this.logError(event, error);
        }
    }
    findTaggedChannels({ tags }) {
        if (tags) {
            return tags
                .filter((tag) => tag.type === 'slack')
                .map((t) => t.value);
        }
        return [];
    }
    getDefaultChannels(defaultChannels) {
        if (defaultChannels) {
            return defaultChannels.split(',').map((c) => c.trim());
        }
        return [];
    }
    logError(event, error) {
        if (!('code' in error)) {
            this.logger.warn(`Error handling event ${event.type}.`, error);
            return;
        }
        if (error.code === web_api_1.ErrorCode.PlatformError) {
            const { data } = error;
            this.logger.warn(`Error handling event ${event.type}. A platform error occurred: ${data}`, error);
        }
        else if (error.code === web_api_1.ErrorCode.RequestError) {
            const { original } = error;
            this.logger.warn(`Error handling event ${event.type}. A request error occurred: ${original}`, error);
        }
        else if (error.code === web_api_1.ErrorCode.RateLimitedError) {
            const { retryAfter } = error;
            this.logger.warn(`Error handling event ${event.type}. A rate limit error occurred: retry after ${retryAfter} seconds`, error);
        }
        else if (error.code === web_api_1.ErrorCode.HTTPError) {
            const { statusCode } = error;
            this.logger.warn(`Error handling event ${event.type}. An HTTP error occurred: status code ${statusCode}`, error);
        }
        else {
            this.logger.warn(`Error handling event ${event.type}.`, error);
        }
    }
}
exports.default = SlackAppAddon;
module.exports = SlackAppAddon;
//# sourceMappingURL=slack-app.js.map