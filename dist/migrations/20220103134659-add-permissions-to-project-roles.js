"use strict";
exports.up = function (db, cb) {
    db.runSql(`
        INSERT INTO role_permission (role_id, permission_id, environment)
        SELECT
            (SELECT id as role_id from roles WHERE name = 'Owner' LIMIT 1),
            p.id as permission_id,
            e.name as environment
        FROM permissions p
        CROSS JOIN environments e
        WHERE p.permission IN
            ('CREATE_FEATURE_STRATEGY',
            'UPDATE_FEATURE_STRATEGY',
            'DELETE_FEATURE_STRATEGY',
            'UPDATE_FEATURE_ENVIRONMENT');

        INSERT INTO role_permission (role_id, permission_id, environment)
        SELECT
            (SELECT id as role_id from roles WHERE name = 'Member' LIMIT 1),
            p.id as permission_id,
            e.name as environment
        FROM permissions p
        CROSS JOIN environments e
        WHERE p.permission IN
            ('CREATE_FEATURE_STRATEGY',
            'UPDATE_FEATURE_STRATEGY',
            'DELETE_FEATURE_STRATEGY',
            'UPDATE_FEATURE_ENVIRONMENT');
        `, cb);
};
exports.down = function (db, cb) {
    db.runSql(`
  `, cb);
};
//# sourceMappingURL=20220103134659-add-permissions-to-project-roles.js.map