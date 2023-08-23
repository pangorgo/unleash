"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
test('clientRegisterSchema should allow empty ("") instanceId', () => {
    const { value } = schema_1.clientRegisterSchema.validate({
        appName: 'test',
        instanceId: '',
        strategies: ['default'],
        started: Date.now(),
        interval: 100,
    });
    //@ts-ignore
    expect(value.instanceId).toBe('default');
});
test('clientRegisterSchema should allow string dates', () => {
    const date = new Date();
    const { value } = schema_1.clientRegisterSchema.validate({
        appName: 'test',
        strategies: ['default'],
        started: date.toISOString(),
        interval: 100,
    });
    expect(value.started).toStrictEqual(date);
});
test('clientRegisterSchema should allow undefined instanceId', () => {
    const { value } = schema_1.clientRegisterSchema.validate({
        appName: 'test',
        strategies: ['default'],
        started: Date.now(),
        interval: 100,
    });
    expect(value.instanceId).toBe('default');
});
test('clientRegisterSchema should allow null instanceId', () => {
    const { value } = schema_1.clientRegisterSchema.validate({
        appName: 'test',
        instanceId: null,
        strategies: ['default'],
        started: Date.now(),
        interval: 100,
    });
    expect(value.instanceId).toBe('default');
});
test('clientRegisterSchema should use instanceId', () => {
    const { value } = schema_1.clientRegisterSchema.validate({
        appName: 'test',
        instanceId: 'some',
        strategies: ['default'],
        started: Date.now(),
        interval: 100,
    });
    expect(value.instanceId).toBe('some');
});
test('clientMetricsSchema should allow null instanceId', () => {
    const { value } = schema_1.clientMetricsSchema.validate({
        appName: 'test',
        instanceId: null,
        bucket: {
            started: Date.now(),
            stopped: Date.now(),
        },
    });
    expect(value.instanceId).toBe('default');
});
test('clientMetricsSchema should allow empty ("") instanceId', () => {
    const { value } = schema_1.clientMetricsSchema.validate({
        appName: 'test',
        instanceId: '',
        bucket: {
            started: Date.now(),
            stopped: Date.now(),
        },
    });
    expect(value.instanceId).toBe('default');
});
test('clientMetricsSchema should allow undefined instanceId', () => {
    const { value } = schema_1.clientMetricsSchema.validate({
        appName: 'test',
        bucket: {
            started: Date.now(),
            stopped: Date.now(),
        },
    });
    expect(value.instanceId).toBe('default');
});
test('clientMetricsSchema should use instanceId', () => {
    const { value } = schema_1.clientMetricsSchema.validate({
        appName: 'test',
        instanceId: 'some',
        bucket: {
            started: Date.now(),
            stopped: Date.now(),
        },
    });
    expect(value.instanceId).toBe('some');
});
//# sourceMappingURL=schema.test.js.map