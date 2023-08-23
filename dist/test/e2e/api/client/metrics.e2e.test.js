"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../../helpers/test-helper");
const client_metrics_json_1 = __importDefault(require("../../../examples/client-metrics.json"));
const database_init_1 = __importDefault(require("../../helpers/database-init"));
const no_logger_1 = __importDefault(require("../../../fixtures/no-logger"));
let app;
let db;
beforeAll(async () => {
    db = await (0, database_init_1.default)('metrics_api_client', no_logger_1.default);
    app = await (0, test_helper_1.setupApp)(db.stores);
});
afterAll(async () => {
    await app.destroy();
    await db.destroy();
});
test('should be possible to send metrics', async () => {
    return app.request
        .post('/api/client/metrics')
        .send(client_metrics_json_1.default)
        .expect(202);
});
test('should require valid send metrics', async () => {
    return app.request
        .post('/api/client/metrics')
        .send({
        appName: 'test',
    })
        .expect(400);
});
test('should accept empty client metrics', async () => {
    return app.request
        .post('/api/client/metrics')
        .send({
        appName: 'demo',
        instanceId: '1',
        bucket: {
            start: Date.now(),
            stop: Date.now(),
            toggles: {},
        },
    })
        .expect(202);
});
//# sourceMappingURL=metrics.e2e.test.js.map