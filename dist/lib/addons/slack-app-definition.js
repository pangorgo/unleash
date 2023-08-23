"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../types/events");
const slackAppDefinition = {
    name: 'slack-app',
    displayName: 'Slack App',
    description: 'The Unleash Slack App posts messages to your Slack workspace. You can decide which channels to post to by configuring your feature toggles with "slack" tags. For example, if you\'d like the bot to post messages to the #general channel, you should configure your feature toggle with the "slack:general" tag.',
    documentationUrl: 'https://docs.getunleash.io/docs/addons/slack-app',
    alerts: [
        {
            type: 'info',
            text: `The Unleash Slack App bot has access to public channels by default. If you want the bot to post messages to private channels, you'll need to invite it to those channels.`,
        },
        {
            type: 'warning',
            text: `Please ensure you have the Unleash Slack App installed in your Slack workspace if you haven't installed it already.`,
        },
    ],
    installation: {
        url: 'https://unleash-slack-app.vercel.app/install',
        title: 'Slack App installation',
        helpText: 'After installing the Unleash Slack app in your Slack workspace, paste the access token into the appropriate field below in order to configure this addon.',
    },
    parameters: [
        {
            name: 'accessToken',
            displayName: 'Access token',
            description: '(Required)',
            type: 'text',
            required: true,
            sensitive: true,
        },
        {
            name: 'defaultChannels',
            displayName: 'Default channels',
            description: 'A comma-separated list of channels to post to if no tagged channels are found (e.g. a toggle without tags, or an event with no tags associated).',
            type: 'text',
            required: false,
            sensitive: false,
        },
    ],
    events: [
        events_1.FEATURE_CREATED,
        events_1.FEATURE_UPDATED,
        events_1.FEATURE_ARCHIVED,
        events_1.FEATURE_REVIVED,
        events_1.FEATURE_STALE_ON,
        events_1.FEATURE_STALE_OFF,
        events_1.FEATURE_ENVIRONMENT_ENABLED,
        events_1.FEATURE_ENVIRONMENT_DISABLED,
        events_1.FEATURE_STRATEGY_REMOVE,
        events_1.FEATURE_STRATEGY_UPDATE,
        events_1.FEATURE_STRATEGY_ADD,
        events_1.FEATURE_METADATA_UPDATED,
        events_1.FEATURE_VARIANTS_UPDATED,
        events_1.FEATURE_PROJECT_CHANGE,
        events_1.FEATURE_POTENTIALLY_STALE_ON,
    ],
    tagTypes: [
        {
            name: 'slack',
            description: 'Slack tag used by the slack-addon to specify the slack channel.',
            icon: 'S',
        },
    ],
};
exports.default = slackAppDefinition;
//# sourceMappingURL=slack-app-definition.js.map