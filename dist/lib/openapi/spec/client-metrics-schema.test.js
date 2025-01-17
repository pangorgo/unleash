"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../validate");
test('clientMetricsSchema full', () => {
    const data = {
        appName: 'a',
        instanceId: 'some-id',
        environment: 'some-env',
        bucket: {
            start: Date.now(),
            stop: Date.now(),
            toggles: {
                someToggle: {
                    yes: 52,
                    no: 2,
                    variants: { someVariant: 52, newVariant: 33 },
                },
            },
        },
    };
    expect((0, validate_1.validateSchema)('#/components/schemas/clientMetricsSchema', data)).toBeUndefined();
});
test('clientMetricsSchema should ignore additional properties without failing when required fields are there', () => {
    expect((0, validate_1.validateSchema)('#/components/schemas/clientMetricsSchema', {
        appName: 'a',
        someParam: 'some-value',
        bucket: {
            start: Date.now(),
            stop: Date.now(),
            toggles: {
                someToggle: {
                    yes: 52,
                    variants: {},
                    someOtherParam: 'some-other-value',
                },
            },
        },
    })).toBeUndefined();
});
test('clientMetricsSchema should fail when required field is missing', () => {
    expect((0, validate_1.validateSchema)('#/components/schemas/clientMetricsSchema', {
        appName: 'a',
        bucket: {
            start: Date.now(),
            toggles: {
                someToggle: {
                    yes: 52,
                    variants: {},
                    someOtherParam: 'some-other-value',
                },
            },
        },
    })).toMatchSnapshot();
});
//# sourceMappingURL=client-metrics-schema.test.js.map