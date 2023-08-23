"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SegmentService = void 0;
const types_1 = require("../types");
const name_exists_error_1 = __importDefault(require("../error/name-exists-error"));
const segment_schema_1 = require("./segment-schema");
const events_1 = require("../types/events");
const bad_data_error_1 = __importDefault(require("../error/bad-data-error"));
const error_1 = require("../error");
class SegmentService {
    constructor({ segmentStore, featureStrategiesStore, eventStore, }, changeRequestAccessReadModel, config) {
        this.segmentStore = segmentStore;
        this.featureStrategiesStore = featureStrategiesStore;
        this.eventStore = eventStore;
        this.changeRequestAccessReadModel = changeRequestAccessReadModel;
        this.logger = config.getLogger('services/segment-service.ts');
        this.flagResolver = config.flagResolver;
        this.config = config;
    }
    async get(id) {
        return this.segmentStore.get(id);
    }
    async getAll() {
        return this.segmentStore.getAll();
    }
    async getActive() {
        return this.segmentStore.getActive();
    }
    async getActiveForClient() {
        return this.segmentStore.getActiveForClient();
    }
    // Used by unleash-enterprise.
    async getByStrategy(strategyId) {
        return this.segmentStore.getByStrategy(strategyId);
    }
    // Used by unleash-enterprise.
    async getStrategies(id) {
        return this.featureStrategiesStore.getStrategiesBySegment(id);
    }
    async create(data, user) {
        const input = await segment_schema_1.segmentSchema.validateAsync(data);
        this.validateSegmentValuesLimit(input);
        await this.validateName(input.name);
        const segment = await this.segmentStore.create(input, user);
        await this.eventStore.store({
            type: events_1.SEGMENT_CREATED,
            createdBy: user.email || user.username || 'unknown',
            data: segment,
        });
        return segment;
    }
    async update(id, data, user) {
        if (this.flagResolver.isEnabled('segmentChangeRequests')) {
            const input = await segment_schema_1.segmentSchema.validateAsync(data);
            await this.stopWhenChangeRequestsEnabled(input.project, user);
        }
        return this.unprotectedUpdate(id, data, user);
    }
    async unprotectedUpdate(id, data, user) {
        const input = await segment_schema_1.segmentSchema.validateAsync(data);
        this.validateSegmentValuesLimit(input);
        const preData = await this.segmentStore.get(id);
        if (preData.name !== input.name) {
            await this.validateName(input.name);
        }
        await this.validateSegmentProject(id, input);
        const segment = await this.segmentStore.update(id, input);
        await this.eventStore.store({
            type: events_1.SEGMENT_UPDATED,
            createdBy: user.email || user.username || 'unknown',
            data: segment,
            preData,
        });
    }
    async delete(id, user) {
        const segment = await this.segmentStore.get(id);
        if (this.flagResolver.isEnabled('segmentChangeRequests')) {
            await this.stopWhenChangeRequestsEnabled(segment.project, user);
        }
        await this.segmentStore.delete(id);
        await this.eventStore.store({
            type: events_1.SEGMENT_DELETED,
            createdBy: user.email || user.username,
            data: segment,
        });
    }
    async unprotectedDelete(id, user) {
        const segment = await this.segmentStore.get(id);
        await this.segmentStore.delete(id);
        await this.eventStore.store({
            type: events_1.SEGMENT_DELETED,
            createdBy: user.email || user.username,
            data: segment,
        });
    }
    async cloneStrategySegments(sourceStrategyId, targetStrategyId) {
        const sourceStrategySegments = await this.getByStrategy(sourceStrategyId);
        await Promise.all(sourceStrategySegments.map((sourceStrategySegment) => {
            return this.addToStrategy(sourceStrategySegment.id, targetStrategyId);
        }));
    }
    // Used by unleash-enterprise.
    async addToStrategy(id, strategyId) {
        await this.validateStrategySegmentLimit(strategyId);
        await this.segmentStore.addToStrategy(id, strategyId);
    }
    async updateStrategySegments(strategyId, segmentIds) {
        if (segmentIds.length > this.config.strategySegmentsLimit) {
            throw new bad_data_error_1.default(`Strategies may not have more than ${this.config.strategySegmentsLimit} segments`);
        }
        const segments = await this.getByStrategy(strategyId);
        const currentSegmentIds = segments.map((segment) => segment.id);
        const segmentIdsToRemove = currentSegmentIds.filter((id) => !segmentIds.includes(id));
        await Promise.all(segmentIdsToRemove.map((segmentId) => this.removeFromStrategy(segmentId, strategyId)));
        const segmentIdsToAdd = segmentIds.filter((id) => !currentSegmentIds.includes(id));
        await Promise.all(segmentIdsToAdd.map((segmentId) => this.addToStrategy(segmentId, strategyId)));
    }
    // Used by unleash-enterprise.
    async removeFromStrategy(id, strategyId) {
        await this.segmentStore.removeFromStrategy(id, strategyId);
    }
    async validateName(name) {
        if (!name) {
            throw new bad_data_error_1.default('Segment name cannot be empty');
        }
        if (await this.segmentStore.existsByName(name)) {
            throw new name_exists_error_1.default('Segment name already exists');
        }
    }
    async validateStrategySegmentLimit(strategyId) {
        const { strategySegmentsLimit } = this.config;
        if ((await this.getByStrategy(strategyId)).length >=
            strategySegmentsLimit) {
            throw new bad_data_error_1.default(`Strategies may not have more than ${strategySegmentsLimit} segments`);
        }
    }
    validateSegmentValuesLimit(segment) {
        const { segmentValuesLimit } = this.config;
        const valuesCount = segment.constraints
            .flatMap((constraint) => constraint.values?.length ?? 0)
            .reduce((acc, length) => acc + length, 0);
        if (valuesCount > segmentValuesLimit) {
            throw new bad_data_error_1.default(`Segments may not have more than ${segmentValuesLimit} values`);
        }
    }
    async validateSegmentProject(id, segment) {
        const strategies = await this.featureStrategiesStore.getStrategiesBySegment(id);
        const projectsUsed = new Set(strategies.map((strategy) => strategy.projectId));
        if (segment.project &&
            (projectsUsed.size > 1 ||
                (projectsUsed.size === 1 && !projectsUsed.has(segment.project)))) {
            throw new bad_data_error_1.default(`Invalid project. Segment is being used by strategies in other projects: ${Array.from(projectsUsed).join(', ')}`);
        }
    }
    async stopWhenChangeRequestsEnabled(project, user) {
        if (!project)
            return;
        const canBypass = await this.changeRequestAccessReadModel.canBypassChangeRequestForProject(project, user);
        if (!canBypass) {
            throw new error_1.PermissionError(types_1.SKIP_CHANGE_REQUEST);
        }
    }
}
exports.SegmentService = SegmentService;
//# sourceMappingURL=segment-service.js.map