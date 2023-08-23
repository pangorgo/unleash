"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../types/events");
const dataDogDefinition = {
    name: 'datadog',
    displayName: 'Datadog',
    description: 'Allows Unleash to post updates to Datadog.',
    documentationUrl: 'https://docs.getunleash.io/docs/addons/datadog',
    parameters: [
        {
            name: 'url',
            displayName: 'Datadog Events URL',
            description: 'Default url: https://api.datadoghq.com/api/v1/events. Needs to be changed if your not using the US1 site.',
            type: 'url',
            required: false,
            sensitive: false,
        },
        {
            name: 'apiKey',
            displayName: 'Datadog API key',
            placeholder: 'j96c23b0f12a6b3434a8d710110bd862',
            description: '(Required) API key from Datadog',
            type: 'text',
            required: true,
            sensitive: true,
        },
        {
            name: 'sourceTypeName',
            displayName: 'Datadog Source Type Name',
            description: '(Optional) source_type_name parameter to be included in Datadog events.',
            type: 'text',
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
        events_1.FEATURE_PROJECT_CHANGE,
        events_1.FEATURE_VARIANTS_UPDATED,
        events_1.FEATURE_POTENTIALLY_STALE_ON,
    ],
    tagTypes: [
        {
            name: 'datadog',
            description: 'All Datadog tags added to a specific feature are sent to datadog event stream.',
            icon: 'D',
        },
    ],
};
exports.default = dataDogDefinition;
//# sourceMappingURL=datadog-definition.js.map