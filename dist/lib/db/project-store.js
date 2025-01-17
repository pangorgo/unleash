"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
const util_1 = require("../util");
const metrics_helper_1 = __importDefault(require("../util/metrics-helper"));
const metric_events_1 = require("../metric-events");
const COLUMNS = [
    'id',
    'name',
    'description',
    'created_at',
    'health',
    'updated_at',
];
const TABLE = 'projects';
const SETTINGS_COLUMNS = [
    'project_mode',
    'default_stickiness',
    'feature_limit',
];
const SETTINGS_TABLE = 'project_settings';
const PROJECT_ENVIRONMENTS = 'project_environments';
class ProjectStore {
    constructor(db, eventBus, getLogger, flagResolver) {
        this.db = db;
        this.logger = getLogger('project-store.ts');
        this.timer = (action) => metrics_helper_1.default.wrapTimer(eventBus, metric_events_1.DB_TIME, {
            store: 'project',
            action,
        });
        this.flagResolver = flagResolver;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    fieldToRow(data) {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
        };
    }
    destroy() { }
    async exists(id) {
        const result = await this.db.raw(`SELECT EXISTS(SELECT 1 FROM ${TABLE} WHERE id = ?) AS present`, [id]);
        const { present } = result.rows[0];
        return present;
    }
    async isFeatureLimitReached(id) {
        const result = await this.db.raw(`SELECT EXISTS(SELECT 1
             FROM project_settings
             LEFT JOIN features ON project_settings.project = features.project
             WHERE project_settings.project = ?
             GROUP BY project_settings.project
             HAVING project_settings.feature_limit <= COUNT(features.project)) AS present`, [id]);
        const { present } = result.rows[0];
        return present;
    }
    async getProjectsWithCounts(query, userId) {
        const projectTimer = this.timer('getProjectsWithCount');
        let projects = this.db(TABLE)
            .leftJoin('features', 'features.project', 'projects.id')
            .orderBy('projects.name', 'asc');
        if (query) {
            projects = projects.where(query);
        }
        let selectColumns = [
            this.db.raw('projects.id, projects.name, projects.description, projects.health, projects.updated_at, projects.created_at, count(features.name) FILTER (WHERE features.archived_at is null) AS number_of_features'),
        ];
        let groupByColumns = ['projects.id'];
        if (userId) {
            projects = projects.leftJoin(`favorite_projects`, function () {
                this.on('favorite_projects.project', 'projects.id').andOnVal('favorite_projects.user_id', '=', userId);
            });
            selectColumns = [
                ...selectColumns,
                this.db.raw('favorite_projects.project is not null as favorite'),
            ];
            groupByColumns = [...groupByColumns, 'favorite_projects.project'];
        }
        const projectAndFeatureCount = await projects
            .select(selectColumns)
            .groupBy(groupByColumns);
        const projectsWithFeatureCount = projectAndFeatureCount.map(this.mapProjectWithCountRow);
        projectTimer();
        const memberTimer = this.timer('getMemberCount');
        const memberCount = await this.getMembersCount();
        memberTimer();
        const memberMap = new Map(memberCount.map((c) => [c.project, Number(c.count)]));
        return projectsWithFeatureCount.map((projectWithCount) => {
            return {
                ...projectWithCount,
                memberCount: memberMap.get(projectWithCount.id) || 0,
            };
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    mapProjectWithCountRow(row) {
        return {
            name: row.name,
            id: row.id,
            description: row.description,
            health: row.health,
            favorite: row.favorite,
            featureCount: Number(row.number_of_features) || 0,
            memberCount: Number(row.number_of_users) || 0,
            updatedAt: row.updated_at,
            createdAt: row.created_at,
            mode: 'open',
            defaultStickiness: 'default',
        };
    }
    async getAll(query = {}) {
        const rows = await this.db
            .select(COLUMNS)
            .from(TABLE)
            .where(query)
            .orderBy('name', 'asc');
        return rows.map(this.mapRow);
    }
    async get(id) {
        return this.db
            .first([...COLUMNS, ...SETTINGS_COLUMNS])
            .from(TABLE)
            .leftJoin(SETTINGS_TABLE, `${SETTINGS_TABLE}.project`, `${TABLE}.id`)
            .where({ id })
            .then(this.mapRow);
    }
    async hasProject(id) {
        const result = await this.db.raw(`SELECT EXISTS(SELECT 1 FROM ${TABLE} WHERE id = ?) AS present`, [id]);
        const { present } = result.rows[0];
        return present;
    }
    async updateHealth(healthUpdate) {
        await this.db(TABLE)
            .where({ id: healthUpdate.id })
            .update({ health: healthUpdate.health, updated_at: new Date() });
    }
    async create(project) {
        const row = await this.db(TABLE)
            .insert(this.fieldToRow(project))
            .returning('*');
        const settingsRow = await this.db(SETTINGS_TABLE)
            .insert({
            project: project.id,
            project_mode: project.mode,
            default_stickiness: project.defaultStickiness,
            feature_limit: project.featureLimit,
        })
            .returning('*');
        return this.mapRow({ ...row[0], ...settingsRow[0] });
    }
    async hasProjectSettings(projectId) {
        const result = await this.db.raw(`SELECT EXISTS(SELECT 1 FROM ${SETTINGS_TABLE} WHERE project = ?) AS present`, [projectId]);
        const { present } = result.rows[0];
        return present;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async update(data) {
        try {
            await this.db(TABLE)
                .where({ id: data.id })
                .update(this.fieldToRow(data));
            if (await this.hasProjectSettings(data.id)) {
                await this.db(SETTINGS_TABLE)
                    .where({ project: data.id })
                    .update({
                    project_mode: data.mode,
                    default_stickiness: data.defaultStickiness,
                    feature_limit: data.featureLimit,
                });
            }
            else {
                await this.db(SETTINGS_TABLE).insert({
                    project: data.id,
                    project_mode: data.mode,
                    default_stickiness: data.defaultStickiness,
                    feature_limit: data.featureLimit,
                });
            }
        }
        catch (err) {
            this.logger.error('Could not update project, error: ', err);
        }
    }
    async importProjects(projects, environments) {
        const rows = await this.db(TABLE)
            .insert(projects.map(this.fieldToRow))
            .returning(COLUMNS)
            .onConflict('id')
            .ignore();
        if (environments && rows.length > 0) {
            environments.forEach((env) => {
                projects.forEach(async (project) => {
                    await this.addEnvironmentToProject(project.id, env.name);
                });
            });
            return rows.map(this.mapRow);
        }
        return [];
    }
    async addDefaultEnvironment(projects) {
        const environments = projects.map((project) => ({
            project_id: project.id,
            environment_name: util_1.DEFAULT_ENV,
        }));
        await this.db('project_environments')
            .insert(environments)
            .onConflict(['project_id', 'environment_name'])
            .ignore();
    }
    async deleteAll() {
        await this.db(TABLE).del();
    }
    async delete(id) {
        try {
            await this.db(TABLE).where({ id }).del();
        }
        catch (err) {
            this.logger.error('Could not delete project, error: ', err);
        }
    }
    async getProjectLinksForEnvironments(environments) {
        let rows = await this.db('project_environments')
            .select(['project_id', 'environment_name'])
            .whereIn('environment_name', environments);
        return rows.map(this.mapLinkRow);
    }
    async deleteEnvironmentForProject(id, environment) {
        await this.db('project_environments')
            .where({
            project_id: id,
            environment_name: environment,
        })
            .del();
    }
    async addEnvironmentToProject(id, environment) {
        await this.db('project_environments')
            .insert({
            project_id: id,
            environment_name: environment,
        })
            .onConflict(['project_id', 'environment_name'])
            .ignore();
    }
    async addEnvironmentToProjects(environment, projects) {
        const rows = await Promise.all(projects.map(async (projectId) => {
            return {
                project_id: projectId,
                environment_name: environment,
            };
        }));
        await this.db('project_environments')
            .insert(rows)
            .onConflict(['project_id', 'environment_name'])
            .ignore();
    }
    async getEnvironmentsForProject(id) {
        const rows = await this.db(PROJECT_ENVIRONMENTS)
            .where({
            project_id: id,
        })
            .innerJoin('environments', 'project_environments.environment_name', 'environments.name')
            .orderBy('environments.sort_order', 'asc')
            .orderBy('project_environments.environment_name', 'asc')
            .returning([
            'project_environments.environment_name',
            'project_environments.default_strategy',
        ]);
        return rows.map(this.mapProjectEnvironmentRow);
    }
    async getMembersCount() {
        const members = await this.db
            .select('project')
            .from((db) => {
            db.select('user_id', 'project')
                .from('role_user')
                .leftJoin('roles', 'role_user.role_id', 'roles.id')
                .where((builder) => builder.whereNot('type', 'root'))
                .union((queryBuilder) => {
                queryBuilder
                    .select('user_id', 'project')
                    .from('group_role')
                    .leftJoin('group_user', 'group_user.group_id', 'group_role.group_id');
            })
                .as('query');
        })
            .groupBy('project')
            .count('user_id');
        return members;
    }
    async getProjectsByUser(userId) {
        const projects = await this.db
            .from((db) => {
            db.select('project')
                .from('role_user')
                .leftJoin('roles', 'role_user.role_id', 'roles.id')
                .where('user_id', userId)
                .union((queryBuilder) => {
                queryBuilder
                    .select('project')
                    .from('group_role')
                    .leftJoin('group_user', 'group_user.group_id', 'group_role.group_id')
                    .where('user_id', userId);
            })
                .as('query');
        })
            .pluck('project');
        return projects;
    }
    async getMembersCountByProject(projectId) {
        const members = await this.db
            .from((db) => {
            db.select('user_id')
                .from('role_user')
                .leftJoin('roles', 'role_user.role_id', 'roles.id')
                .where((builder) => builder
                .where('project', projectId)
                .whereNot('type', 'root'))
                .union((queryBuilder) => {
                queryBuilder
                    .select('user_id')
                    .from('group_role')
                    .leftJoin('group_user', 'group_user.group_id', 'group_role.group_id')
                    .where('project', projectId);
            })
                .as('query');
        })
            .count()
            .first();
        return Number(members.count);
    }
    async getMembersCountByProjectAfterDate(projectId, date) {
        const members = await this.db
            .from((db) => {
            db.select('user_id')
                .from('role_user')
                .leftJoin('roles', 'role_user.role_id', 'roles.id')
                .where((builder) => builder
                .where('project', projectId)
                .whereNot('type', 'root')
                .andWhere('role_user.created_at', '>=', date))
                .union((queryBuilder) => {
                queryBuilder
                    .select('user_id')
                    .from('group_role')
                    .leftJoin('group_user', 'group_user.group_id', 'group_role.group_id')
                    .where('project', projectId)
                    .andWhere('group_role.created_at', '>=', date);
            })
                .as('query');
        })
            .count()
            .first();
        return Number(members.count);
    }
    async getDefaultStrategy(projectId, environment) {
        const rows = await this.db(PROJECT_ENVIRONMENTS)
            .select('default_strategy')
            .where({ project_id: projectId, environment_name: environment });
        return rows.length > 0 ? rows[0].default_strategy : null;
    }
    async updateDefaultStrategy(projectId, environment, strategy) {
        const rows = await this.db(PROJECT_ENVIRONMENTS)
            .update({
            default_strategy: strategy,
        })
            .where({ project_id: projectId, environment_name: environment })
            .returning('default_strategy');
        return rows[0].default_strategy;
    }
    async count() {
        return this.db
            .from(TABLE)
            .count('*')
            .then((res) => Number(res[0].count));
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    mapLinkRow(row) {
        return {
            environmentName: row.environment_name,
            projectId: row.project_id,
        };
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    mapRow(row) {
        if (!row) {
            throw new notfound_error_1.default('No project found');
        }
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            createdAt: row.created_at,
            health: row.health ?? 100,
            updatedAt: row.updated_at || new Date(),
            mode: row.project_mode || 'open',
            defaultStickiness: row.default_stickiness || 'default',
            featureLimit: row.feature_limit,
        };
    }
    mapProjectEnvironmentRow(row) {
        return {
            environment: row.environment_name,
            defaultStrategy: row.default_strategy === null
                ? undefined
                : row.default_strategy,
        };
    }
}
exports.default = ProjectStore;
//# sourceMappingURL=project-store.js.map