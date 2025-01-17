'use strict';
exports.up = function (db, cb) {
    db.runSql(`ALTER TABLE api_tokens ADD COLUMN metadata JSONB NOT NULL DEFAULT '{}'::jsonb;`, cb);
};
exports.down = function (db, cb) {
    db.runSql('ALTER TABLE api_tokens DROP COLUMN metadata;', cb);
};
//# sourceMappingURL=20220816121136-add-metadata-to-api-keys.js.map