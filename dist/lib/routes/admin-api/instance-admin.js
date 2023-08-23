"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json2csv_1 = require("json2csv");
const controller_1 = __importDefault(require("../controller"));
const permissions_1 = require("../../types/permissions");
const create_response_schema_1 = require("../../openapi/util/create-response-schema");
class InstanceAdminController extends controller_1.default {
    constructor(config, { instanceStatsService, openApiService, }) {
        super(config);
        this.jsonCsvParser = new json2csv_1.Parser();
        this.openApiService = openApiService;
        this.instanceStatsService = instanceStatsService;
        this.route({
            method: 'get',
            path: '/statistics/csv',
            handler: this.getStatisticsCSV,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    tags: ['Instance Admin'],
                    summary: 'Instance usage statistics',
                    description: 'Provides statistics about various features of Unleash to allow for reporting of usage for self-hosted customers. The response contains data such as the number of users, groups, features, strategies, versions, etc.',
                    operationId: 'getInstanceAdminStatsCsv',
                    responses: {
                        200: (0, create_response_schema_1.createCsvResponseSchema)('instanceAdminStatsSchemaCsv', this.jsonCsvParser.parse(this.instanceStatsExample())),
                    },
                }),
            ],
        });
        this.route({
            method: 'get',
            path: '/statistics',
            handler: this.getStatistics,
            permission: permissions_1.NONE,
            middleware: [
                openApiService.validPath({
                    tags: ['Instance Admin'],
                    operationId: 'getInstanceAdminStats',
                    summary: 'Instance usage statistics',
                    description: 'Provides statistics about various features of Unleash to allow for reporting of usage for self-hosted customers. The response contains data such as the number of users, groups, features, strategies, versions, etc.',
                    responses: {
                        200: (0, create_response_schema_1.createResponseSchema)('instanceAdminStatsSchema'),
                    },
                    deprecated: true,
                }),
            ],
        });
    }
    instanceStatsExample() {
        return {
            OIDCenabled: true,
            SAMLenabled: false,
            clientApps: [
                { range: 'allTime', count: 15 },
                { range: '30d', count: 9 },
                { range: '7d', count: 5 },
            ],
            contextFields: 6,
            environments: 2,
            featureExports: 0,
            featureImports: 0,
            featureToggles: 29,
            groups: 3,
            instanceId: 'ed3861ae-78f9-4e8c-8e57-b57efc15f82b',
            projects: 1,
            roles: 5,
            customRootRoles: 2,
            customRootRolesInUse: 1,
            segments: 2,
            strategies: 8,
            sum: 'some-sha256-hash',
            timestamp: new Date(2023, 6, 12, 10, 0, 0, 0),
            users: 10,
            versionEnterprise: '5.1.7',
            versionOSS: '5.1.7',
        };
    }
    async getStatistics(req, res) {
        const instanceStats = await this.instanceStatsService.getSignedStats();
        res.json(instanceStats);
    }
    async getStatisticsCSV(req, res) {
        const instanceStats = await this.instanceStatsService.getSignedStats();
        const fileName = `unleash-${instanceStats.instanceId}-${Date.now()}.csv`;
        const json2csvParser = new json2csv_1.Parser();
        const csv = json2csvParser.parse(instanceStats);
        res.contentType('csv');
        res.attachment(fileName);
        res.send(csv);
    }
}
exports.default = InstanceAdminController;
//# sourceMappingURL=instance-admin.js.map