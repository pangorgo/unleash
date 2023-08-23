"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationSchema = void 0;
exports.applicationSchema = {
    $id: '#/components/schemas/applicationSchema',
    type: 'object',
    description: "Data about an application that's connected to Unleash via an SDK.",
    additionalProperties: false,
    required: ['appName'],
    properties: {
        appName: {
            description: 'Name of the application',
            type: 'string',
            example: 'accounting',
        },
        sdkVersion: {
            description: 'Which SDK and version the application reporting uses. Typically represented as `<identifier>:<version>`',
            type: 'string',
            example: 'unleash-client-java:8.0.0',
        },
        strategies: {
            description: 'Which [strategies](https://docs.getunleash.io/topics/the-anatomy-of-unleash#activation-strategies) the application has loaded. Useful when trying to figure out if your [custom strategy](https://docs.getunleash.io/reference/custom-activation-strategies) has been loaded in the SDK',
            type: 'array',
            items: {
                type: 'string',
            },
            example: ['standard', 'gradualRollout', 'mySpecialCustomStrategy'],
        },
        description: {
            description: 'Extra information added about the application reporting the metrics. Only present if added via the Unleash Admin interface',
            type: 'string',
            example: 'Application for reporting page visits',
        },
        url: {
            description: 'A link to reference the application reporting the metrics. Could for instance be a GitHub link to the repository of the application',
            type: 'string',
            example: 'https://github.com/Unleash/unleash-client-proxy-js',
        },
        color: {
            description: `The CSS color that is used to color the application's entry in the application list`,
            type: 'string',
            example: 'red',
        },
        icon: {
            description: `An URL to an icon file to be used for the applications's entry in the application list`,
            type: 'string',
            example: 'https://github.com/favicon.ico',
        },
    },
    components: {},
};
//# sourceMappingURL=application-schema.js.map