"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStrategySchema = void 0;
exports.createStrategySchema = {
    $id: '#/components/schemas/createStrategySchema',
    type: 'object',
    description: 'The data required to create a strategy type. Refer to the docs on [custom strategy types](https://docs.getunleash.io/reference/custom-activation-strategies) for more information.',
    required: ['name', 'parameters'],
    properties: {
        name: {
            type: 'string',
            description: 'The name of the strategy type. Must be unique.',
            example: 'my-custom-strategy',
        },
        description: {
            type: 'string',
            description: 'A description of the strategy type.',
            example: 'Enable the feature for users who have not logged in before.',
        },
        parameters: {
            type: 'array',
            description: 'The parameter list lets you pass arguments to your custom activation strategy. These will be made available to your custom strategy implementation.',
            items: {
                type: 'object',
                required: ['name', 'type'],
                properties: {
                    name: {
                        type: 'string',
                        description: 'The name of the parameter',
                        example: 'Rollout percentage',
                    },
                    type: {
                        type: 'string',
                        description: 'The [type of the parameter](https://docs.getunleash.io/reference/custom-activation-strategies#parameter-types)',
                        enum: [
                            'string',
                            'percentage',
                            'list',
                            'number',
                            'boolean',
                        ],
                        example: 'percentage',
                    },
                    description: {
                        type: 'string',
                        description: 'A description of this strategy parameter. Use this to indicate to the users what the parameter does.',
                        example: 'How many percent of users should see this feature?',
                    },
                    required: {
                        type: 'boolean',
                        description: 'Whether this parameter must be configured when using the strategy. Defaults to `false`',
                        example: false,
                    },
                },
            },
        },
    },
    components: {},
};
//# sourceMappingURL=create-strategy-schema.js.map