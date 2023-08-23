"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetDb = exports.migrateDb = void 0;
const db_migrate_shared_1 = require("db-migrate-shared");
const db_migrate_1 = require("db-migrate");
const date_fns_1 = require("date-fns");
db_migrate_shared_1.log.setLogLevel('error');
async function migrateDb({ db }) {
    const custom = {
        ...db,
        connectionTimeoutMillis: (0, date_fns_1.secondsToMilliseconds)(10),
    };
    // disable Intellij/WebStorm from setting verbose CLI argument to db-migrator
    process.argv = process.argv.filter((it) => !it.includes('--verbose'));
    const dbm = (0, db_migrate_1.getInstance)(true, {
        cwd: __dirname,
        config: { custom },
        env: 'custom',
    });
    return dbm.up();
}
exports.migrateDb = migrateDb;
// This exists to ease testing
async function resetDb({ db }) {
    const custom = {
        ...db,
        connectionTimeoutMillis: (0, date_fns_1.secondsToMilliseconds)(10),
    };
    const dbm = (0, db_migrate_1.getInstance)(true, {
        cwd: __dirname,
        config: { custom },
        env: 'custom',
    });
    return dbm.reset();
}
exports.resetDb = resetDb;
//# sourceMappingURL=migrator.js.map