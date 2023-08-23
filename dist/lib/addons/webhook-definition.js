"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../types/events");
const webhookDefinition = {
    name: 'webhook',
    displayName: 'Webhook',
    description: 'A Webhook is a generic way to post messages from Unleash to third party services.',
    documentationUrl: 'https://docs.getunleash.io/docs/addons/webhook',
    parameters: [
        {
            name: 'url',
            displayName: 'Webhook URL',
            description: '(Required) Unleash will perform a HTTP Post to the specified URL (one retry if first attempt fails)',
            type: 'url',
            required: true,
            sensitive: true,
        },
        {
            name: 'contentType',
            displayName: 'Content-Type',
            placeholder: 'application/json',
            description: '(Optional) The Content-Type header to use. Defaults to "application/json".',
            type: 'text',
            required: false,
            sensitive: false,
        },
        {
            name: 'authorization',
            displayName: 'Authorization',
            placeholder: '',
            description: '(Optional) The Authorization header to use. Not used if left blank.',
            type: 'text',
            required: false,
            sensitive: true,
        },
        {
            name: 'bodyTemplate',
            displayName: 'Body template',
            placeholder: `{
  "event": "{{event.type}}",
  "createdBy": "{{event.createdBy}}",
  "featureToggle": "{{event.data.name}}",
  "timestamp": "{{event.data.createdAt}}"
}`,
            description: "(Optional) You may format the body using a mustache template. If you don't specify anything, the format will similar to the events format (https://docs.getunleash.io/reference/api/legacy/unleash/admin/events)",
            type: 'textfield',
            required: false,
            sensitive: false,
        },
        {
            name: 'customHeaders',
            displayName: 'Extra HTTP Headers',
            placeholder: `{
                "ISTIO_USER_KEY": "hunter2",
                "SOME_OTHER_CUSTOM_HTTP_HEADER": "SOMEVALUE"
            }`,
            description: `(Optional) Used to add extra HTTP Headers to the request the plugin fires off. Format here needs to be a valid json object of key value pairs where both key and value are strings`,
            required: false,
            sensitive: true,
            type: 'textfield',
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
        events_1.FEATURE_TAGGED,
        events_1.FEATURE_UNTAGGED,
        events_1.CHANGE_REQUEST_CREATED,
        events_1.CHANGE_REQUEST_DISCARDED,
        events_1.CHANGE_ADDED,
        events_1.CHANGE_DISCARDED,
        events_1.CHANGE_REQUEST_APPROVED,
        events_1.CHANGE_REQUEST_APPROVAL_ADDED,
        events_1.CHANGE_REQUEST_CANCELLED,
        events_1.CHANGE_REQUEST_SENT_TO_REVIEW,
        events_1.CHANGE_REQUEST_APPLIED,
        events_1.FEATURE_POTENTIALLY_STALE_ON,
    ],
};
exports.default = webhookDefinition;
//# sourceMappingURL=webhook-definition.js.map