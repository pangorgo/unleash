"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_init_1 = __importDefault(require("../../test/e2e/helpers/database-init"));
const no_logger_1 = __importDefault(require("../../test/fixtures/no-logger"));
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
let stores;
let db;
let segmentStore;
beforeAll(async () => {
    db = await (0, database_init_1.default)('segment_store_serial', no_logger_1.default);
    stores = db.stores;
    segmentStore = stores.segmentStore;
});
afterAll(async () => {
    await db.destroy();
});
describe('unexpected input handling for get segment', () => {
    test("gives a NotFoundError with the ID of the segment if it doesn't exist", async () => {
        const id = 123;
        try {
            await segmentStore.get(id);
        }
        catch (e) {
            expect(e instanceof notfound_error_1.default).toBeTruthy();
            expect(e.message).toEqual(expect.stringMatching(id.toString()));
        }
    });
});
//# sourceMappingURL=segment-store.test.js.map