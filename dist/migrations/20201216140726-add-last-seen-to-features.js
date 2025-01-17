"use strict";
exports.up = function (db, callback) {
    db.runSql('ALTER TABLE features ADD "last_seen_at" TIMESTAMP WITH TIME ZONE;', callback);
};
exports.down = function (db, cb) {
    return db.removeColumn('features', 'last_seen_at', cb);
};
//# sourceMappingURL=20201216140726-add-last-seen-to-features.js.map