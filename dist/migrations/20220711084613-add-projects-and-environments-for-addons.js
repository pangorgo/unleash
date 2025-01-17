"use strict";
exports.up = function (db, cb) {
    db.runSql(`ALTER TABLE addons
            ADD COLUMN
                projects jsonb DEFAULT '[]'::jsonb;
         ALTER TABLE addons
             ADD COLUMN environments jsonb DEFAULT '[]'::jsonb;
                    `, cb);
};
exports.down = function (db, cb) {
    db.runSql(`
        ALTER TABLE addons DROP COLUMN projects;
        ALTER TABLE addons DROP COLUMN environments;
`, cb);
};
//# sourceMappingURL=20220711084613-add-projects-and-environments-for-addons.js.map