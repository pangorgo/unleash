'use strict';
exports.up = function (db, cb) {
    db.runSql(`
        ALTER TABLE events ADD COLUMN IF NOT EXISTS tags json DEFAULT '[]'
    `, cb);
};
exports.down = function (db, cb) {
    db.runSql(`
        ALTER TABLE events DROP COLUMN IF EXISTS tags;
    `, cb);
};
//# sourceMappingURL=20210127094440-add-tags-column-to-events.js.map