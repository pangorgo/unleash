"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const event_store_1 = __importDefault(require("./event-store"));
const no_logger_1 = __importDefault(require("../../test/fixtures/no-logger"));
beforeAll(() => {
    no_logger_1.default.setMuteError(true);
});
afterAll(() => {
    no_logger_1.default.setMuteError(false);
});
test('Trying to get events if db fails should yield empty list', async () => {
    const db = (0, knex_1.default)({
        client: 'pg',
    });
    const store = new event_store_1.default(db, no_logger_1.default);
    const events = await store.getEvents();
    expect(events.length).toBe(0);
});
test('Trying to get events by name if db fails should yield empty list', async () => {
    const db = (0, knex_1.default)({
        client: 'pg',
    });
    const store = new event_store_1.default(db, no_logger_1.default);
    const events = await store.searchEvents({ type: 'application-created' });
    expect(events).toBeTruthy();
    expect(events.length).toBe(0);
});
//# sourceMappingURL=event-store.test.js.map