"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../../helpers/test-helper");
const database_init_1 = __importDefault(require("../../helpers/database-init"));
const no_logger_1 = __importDefault(require("../../../fixtures/no-logger"));
const util_1 = require("../../../../lib/util");
const api_token_1 = require("../../../../lib/types/models/api-token");
let app;
let db;
let appErrorLogs = [];
beforeAll(async () => {
    db = await (0, database_init_1.default)(`proxy_concurrency`, no_logger_1.default);
    const baseLogger = (0, no_logger_1.default)();
    const appLogger = {
        ...baseLogger,
        error: (msg, ...args) => {
            appErrorLogs.push(msg);
            baseLogger.error(msg, ...args);
        },
    };
    app = await (0, test_helper_1.setupAppWithAuth)(db.stores, {
        frontendApiOrigins: ['https://example.com'],
        getLogger: () => appLogger,
    });
});
afterEach(() => {
    app.services.proxyService.stopAll();
    jest.clearAllMocks();
});
afterAll(async () => {
    await app.destroy();
    await db.destroy();
});
beforeEach(async () => {
    appErrorLogs = [];
});
/**
 * This test needs to run on a new instance of the application and a clean DB
 * which is why it should be the only test of this file
 */
test('multiple parallel calls to api/frontend should not create multiple instances', async () => {
    const frontendTokenDefault = await app.services.apiTokenService.createApiTokenWithProjects({
        type: api_token_1.ApiTokenType.FRONTEND,
        projects: ['default'],
        environment: 'default',
        tokenName: `test-token-${(0, util_1.randomId)()}`,
    });
    await Promise.all(Array.from(Array(15).keys()).map(() => app.request
        .get('/api/frontend')
        .set('Authorization', frontendTokenDefault.secret)
        .expect('Content-Type', /json/)
        .expect(200)));
    expect(appErrorLogs).toHaveLength(0);
});
//# sourceMappingURL=proxy.concurrency.e2e.test.js.map