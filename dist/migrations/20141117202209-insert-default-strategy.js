'use strict';
exports.up = function (db, callback) {
    db.runSql(`
INSERT INTO strategies(name, description) 
VALUES ('default', 'Default on/off strategy.');
       `, callback);
};
exports.down = function (db, callback) {
    db.runSql(`
DELETE FROM strategies where name='default';`, callback);
};
//# sourceMappingURL=20141117202209-insert-default-strategy.js.map