'use strict';
exports.up = function (db, callback) {
    db.runSql(`
            ALTER table public_signup_tokens
                ADD COLUMN IF NOT EXISTS enabled boolean DEFAULT true
       `, callback);
};
exports.down = function (db, callback) {
    db.runSql(`
            ALTER table public_signup_tokens
                DROP COLUMN enabled
        `, callback);
};
//# sourceMappingURL=20220927110212-add-enabled-to-public-signup-tokens.js.map