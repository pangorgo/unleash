"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_init_1 = __importDefault(require("../helpers/database-init"));
const no_logger_1 = __importDefault(require("../../fixtures/no-logger"));
let stores;
let db;
let featureTypeStore;
beforeAll(async () => {
    db = await (0, database_init_1.default)('feature_type_store_serial', no_logger_1.default);
    stores = db.stores;
    featureTypeStore = stores.featureTypeStore;
});
afterAll(async () => {
    await db.destroy();
});
test('should have 5 default types', async () => {
    const types = await featureTypeStore.getAll();
    expect(types.length).toBe(5);
    expect(types[0].name).toBe('Release');
});
test('should be possible to get by name', async () => {
    const type = await featureTypeStore.getByName('Experiment');
    expect(type.name).toBe('Experiment');
});
test('should be possible to get by id', async () => {
    expect(await featureTypeStore.exists('unknown')).toEqual(false);
    expect(await featureTypeStore.exists('operational')).toEqual(true);
});
test('should be possible to delete by id', async () => {
    const types = await featureTypeStore.getAll();
    const deleteType = types.pop();
    await featureTypeStore.delete(deleteType.id);
    const typesAfterDelete = await featureTypeStore.getAll();
    expect(typesAfterDelete.length).toBe(4);
});
describe('update lifetimes', () => {
    test.each([null, 5])('it sets lifetimeDays to %s', async (newLifetime) => {
        const featureTypes = await featureTypeStore.getAll();
        for (const type of featureTypes) {
            const updated = await featureTypeStore.updateLifetime(type.id, newLifetime);
            expect(updated?.lifetimeDays).toBe(newLifetime);
            expect(updated).toMatchObject(await featureTypeStore.get(type.id));
        }
    });
    test("It returns undefined if you try to update a feature type that doesn't exist", async () => {
        expect(await featureTypeStore.updateLifetime('bogus-type', 40)).toBeUndefined();
    });
});
//# sourceMappingURL=feature-type-store.e2e.test.js.map