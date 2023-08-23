"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_init_1 = __importDefault(require("../helpers/database-init"));
const no_logger_1 = __importDefault(require("../../fixtures/no-logger"));
const test_helper_1 = require("../helpers/test-helper");
let stores;
let app;
let db;
let featureToggleClientStore;
beforeAll(async () => {
    no_logger_1.default.setMuteError(true);
    db = await (0, database_init_1.default)('feature_toggle_client_store_serial', no_logger_1.default);
    app = await (0, test_helper_1.setupApp)(db.stores);
    stores = db.stores;
    featureToggleClientStore = stores.featureToggleClientStore;
});
afterAll(async () => {
    await app.destroy();
    await db.destroy();
});
test('should be able to fetch client toggles', async () => {
    const response = await app.request
        .post('/api/admin/state/import?drop=true')
        .attach('file', 'src/test/examples/exported-segments.json');
    expect(response.status).toBe(202);
    const clientToggles = await featureToggleClientStore.getClient();
    expect(clientToggles).toHaveLength(1);
});
//# sourceMappingURL=feature-toggle-client-store.e2e.test.js.map