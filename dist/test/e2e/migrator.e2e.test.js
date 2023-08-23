"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_config_1 = require("./helpers/database-config");
const test_config_1 = require("../config/test-config");
const db_migrate_1 = require("db-migrate");
const pg_1 = require("pg");
async function initSchema(db) {
    const client = new pg_1.Client(db);
    await client.connect();
    await client.query(`DROP SCHEMA IF EXISTS ${db.schema} CASCADE`);
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${db.schema}`);
    await client.end();
}
test('Up & down migrations work', async () => {
    jest.setTimeout(15000);
    const config = (0, test_config_1.createTestConfig)({
        db: {
            ...(0, database_config_1.getDbConfig)(),
            pool: { min: 1, max: 4 },
            schema: 'up_n_down_migrations_test',
            ssl: false,
        },
    });
    await initSchema(config.db);
    const e2e = {
        ...config.db,
        connectionTimeoutMillis: 2000,
    };
    const dbm = (0, db_migrate_1.getInstance)(true, {
        cwd: `${__dirname}/../../`,
        config: { e2e },
        env: 'e2e',
    });
    await dbm.up();
    await dbm.reset();
});
//# sourceMappingURL=migrator.e2e.test.js.map