"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const migrator_1 = require("../../../migrator");
const db_1 = require("../../../lib/db");
const db_pool_1 = require("../../../lib/db/db-pool");
const database_config_1 = require("./database-config");
const test_config_1 = require("../../config/test-config");
const database_json_1 = __importDefault(require("./database.json"));
const no_logger_1 = __importDefault(require("../../fixtures/no-logger"));
const constants_1 = require("../../../lib/util/constants");
// require('db-migrate-shared').log.silence(false);
// because of migrator bug
delete process.env.DATABASE_URL;
// because of db-migrate bug (https://github.com/Unleash/unleash/issues/171)
process.setMaxListeners(0);
async function resetDatabase(knex) {
    return Promise.all([
        knex.table('environments').del(),
        knex.table('strategies').del(),
        knex.table('features').del(),
        knex.table('client_applications').del(),
        knex.table('client_instances').del(),
        knex.table('context_fields').del(),
        knex.table('users').del(),
        knex.table('projects').del(),
        knex.table('tags').del(),
        knex.table('tag_types').del(),
        knex.table('addons').del(),
        knex.table('users').del(),
        knex.table('reset_tokens').del(),
        // knex.table('settings').del(),
    ]);
}
function createStrategies(store) {
    return database_json_1.default.strategies.map((s) => store.createStrategy(s));
}
function createContextFields(store) {
    return database_json_1.default.contextFields.map((c) => store.create(c));
}
function createProjects(store) {
    return database_json_1.default.projects.map((i) => store.create(i));
}
function createTagTypes(store) {
    return database_json_1.default.tag_types.map((t) => store.createTagType(t));
}
async function connectProject(store) {
    await store.connectProject(constants_1.DEFAULT_ENV, 'default');
}
async function createEnvironments(store) {
    await Promise.all(database_json_1.default.environments.map(async (e) => store.create(e)));
}
async function setupDatabase(stores) {
    await createEnvironments(stores.environmentStore);
    await Promise.all(createStrategies(stores.strategyStore));
    await Promise.all(createContextFields(stores.contextFieldStore));
    await Promise.all(createProjects(stores.projectStore));
    await Promise.all(createTagTypes(stores.tagTypeStore));
    await connectProject(stores.featureEnvironmentStore);
}
async function init(databaseSchema = 'test', getLogger = no_logger_1.default, configOverride = {}) {
    const config = (0, test_config_1.createTestConfig)({
        db: {
            ...(0, database_config_1.getDbConfig)(),
            pool: { min: 1, max: 4 },
            schema: databaseSchema,
            ssl: false,
        },
        ...configOverride,
        getLogger,
    });
    const db = (0, db_pool_1.createDb)(config);
    await db.raw(`DROP SCHEMA IF EXISTS ${config.db.schema} CASCADE`);
    await db.raw(`CREATE SCHEMA IF NOT EXISTS ${config.db.schema}`);
    await (0, migrator_1.migrateDb)(config);
    await db.destroy();
    const testDb = (0, db_pool_1.createDb)(config);
    const stores = await (0, db_1.createStores)(config, testDb);
    stores.eventStore.setMaxListeners(0);
    await resetDatabase(testDb);
    await setupDatabase(stores);
    return {
        rawDatabase: testDb,
        stores,
        reset: async () => {
            await resetDatabase(testDb);
            await setupDatabase(stores);
        },
        destroy: async () => {
            const { clientInstanceStore } = stores;
            return new Promise((resolve, reject) => {
                clientInstanceStore.destroy();
                testDb.destroy((error) => (error ? reject(error) : resolve()));
            });
        },
    };
}
exports.default = init;
module.exports = init;
//# sourceMappingURL=database-init.js.map