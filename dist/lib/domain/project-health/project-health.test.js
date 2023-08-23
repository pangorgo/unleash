"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const project_health_1 = require("./project-health");
const exampleFeatureTypes = [
    {
        id: 'default',
        name: 'Default',
        description: '',
        lifetimeDays: 30,
    },
    {
        id: 'short-lived',
        name: 'Short lived',
        description: '',
        lifetimeDays: 7,
    },
    {
        id: 'non-expiring',
        name: 'Long lived',
        description: '',
        lifetimeDays: null,
    },
];
describe('calculateProjectHealth', () => {
    it('works with empty features', () => {
        expect((0, project_health_1.calculateProjectHealth)([], exampleFeatureTypes)).toEqual({
            activeCount: 0,
            staleCount: 0,
            potentiallyStaleCount: 0,
        });
    });
    it('counts active toggles', () => {
        const features = [{ stale: false }, {}];
        expect((0, project_health_1.calculateProjectHealth)(features, exampleFeatureTypes)).toEqual({
            activeCount: 2,
            staleCount: 0,
            potentiallyStaleCount: 0,
        });
    });
    it('counts stale toggles', () => {
        const features = [{ stale: true }, { stale: false }, {}];
        expect((0, project_health_1.calculateProjectHealth)(features, exampleFeatureTypes)).toEqual({
            activeCount: 2,
            staleCount: 1,
            potentiallyStaleCount: 0,
        });
    });
    it('takes feature type into account when calculating potentially stale toggles', () => {
        expect((0, project_health_1.calculateProjectHealth)([
            {
                stale: false,
                createdAt: (0, date_fns_1.subDays)(Date.now(), 15),
                type: 'default',
            },
        ], exampleFeatureTypes)).toEqual({
            activeCount: 1,
            staleCount: 0,
            potentiallyStaleCount: 0,
        });
        expect((0, project_health_1.calculateProjectHealth)([
            {
                stale: false,
                createdAt: (0, date_fns_1.subDays)(Date.now(), 31),
                type: 'default',
            },
        ], exampleFeatureTypes)).toEqual({
            activeCount: 1,
            staleCount: 0,
            potentiallyStaleCount: 1,
        });
        expect((0, project_health_1.calculateProjectHealth)([
            {
                stale: false,
                createdAt: (0, date_fns_1.subDays)(Date.now(), 15),
                type: 'short-lived',
            },
        ], exampleFeatureTypes)).toEqual({
            activeCount: 1,
            staleCount: 0,
            potentiallyStaleCount: 1,
        });
    });
    it("doesn't count stale toggles as potentially stale or stale as active", () => {
        const features = [
            {
                stale: true,
                createdAt: (0, date_fns_1.subDays)(Date.now(), 31),
                type: 'default',
            },
            {
                stale: false,
                createdAt: (0, date_fns_1.subDays)(Date.now(), 31),
                type: 'default',
            },
        ];
        expect((0, project_health_1.calculateProjectHealth)(features, exampleFeatureTypes)).toEqual({
            activeCount: 1,
            staleCount: 1,
            potentiallyStaleCount: 1,
        });
    });
    it('counts non-expiring types properly', () => {
        const features = [
            {
                createdAt: (0, date_fns_1.subDays)(Date.now(), 366),
                type: 'non-expiring',
            },
            {
                createdAt: (0, date_fns_1.subDays)(Date.now(), 366),
                type: 'default',
            },
        ];
        expect((0, project_health_1.calculateProjectHealth)(features, exampleFeatureTypes)).toEqual({
            activeCount: 2,
            staleCount: 0,
            potentiallyStaleCount: 1,
        });
    });
});
describe('calculateHealthRating', () => {
    it('works with empty feature toggles', () => {
        expect((0, project_health_1.calculateHealthRating)([], exampleFeatureTypes)).toEqual(100);
    });
    it('works with stale and active feature toggles', () => {
        expect((0, project_health_1.calculateHealthRating)([{ stale: true }, { stale: true }], exampleFeatureTypes)).toEqual(0);
        expect((0, project_health_1.calculateHealthRating)([{ stale: true }, { stale: false }], exampleFeatureTypes)).toEqual(50);
        expect((0, project_health_1.calculateHealthRating)([{ stale: false }, { stale: true }, { stale: false }], exampleFeatureTypes)).toEqual(67);
    });
    it('counts potentially stale toggles', () => {
        expect((0, project_health_1.calculateHealthRating)([
            { createdAt: (0, date_fns_1.subDays)(Date.now(), 1), type: 'default' },
            {
                stale: true,
                createdAt: (0, date_fns_1.subDays)(Date.now(), 1),
                type: 'default',
            },
            {
                stale: true,
                createdAt: (0, date_fns_1.subDays)(Date.now(), 31),
                type: 'default',
            },
            {
                stale: false,
                createdAt: (0, date_fns_1.subDays)(Date.now(), 31),
                type: 'default',
            },
        ], exampleFeatureTypes)).toEqual(25);
    });
});
//# sourceMappingURL=project-health.test.js.map