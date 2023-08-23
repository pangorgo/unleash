/// <reference types="node" />
import { LogProvider } from '../logger';
import { IEnvironment, IFlagResolver, IProject, IProjectWithCount } from '../types';
import { IProjectHealthUpdate, IProjectInsert, IProjectQuery, IProjectSettings, IProjectStore, ProjectEnvironment } from '../types/stores/project-store';
import EventEmitter from 'events';
import { Db } from './db';
import { CreateFeatureStrategySchema } from '../openapi';
export interface IEnvironmentProjectLink {
    environmentName: string;
    projectId: string;
}
export interface IProjectMembersCount {
    count: number;
    project: string;
}
declare class ProjectStore implements IProjectStore {
    private db;
    private logger;
    private flagResolver;
    private timer;
    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider, flagResolver: IFlagResolver);
    fieldToRow(data: any): Omit<IProjectInsert, 'mode'>;
    destroy(): void;
    exists(id: string): Promise<boolean>;
    isFeatureLimitReached(id: string): Promise<boolean>;
    getProjectsWithCounts(query?: IProjectQuery, userId?: number): Promise<IProjectWithCount[]>;
    mapProjectWithCountRow(row: any): IProjectWithCount;
    getAll(query?: IProjectQuery): Promise<IProject[]>;
    get(id: string): Promise<IProject>;
    hasProject(id: string): Promise<boolean>;
    updateHealth(healthUpdate: IProjectHealthUpdate): Promise<void>;
    create(project: IProjectInsert & IProjectSettings): Promise<IProject>;
    private hasProjectSettings;
    update(data: any): Promise<void>;
    importProjects(projects: IProjectInsert[], environments?: IEnvironment[]): Promise<IProject[]>;
    addDefaultEnvironment(projects: any[]): Promise<void>;
    deleteAll(): Promise<void>;
    delete(id: string): Promise<void>;
    getProjectLinksForEnvironments(environments: string[]): Promise<IEnvironmentProjectLink[]>;
    deleteEnvironmentForProject(id: string, environment: string): Promise<void>;
    addEnvironmentToProject(id: string, environment: string): Promise<void>;
    addEnvironmentToProjects(environment: string, projects: string[]): Promise<void>;
    getEnvironmentsForProject(id: string): Promise<ProjectEnvironment[]>;
    getMembersCount(): Promise<IProjectMembersCount[]>;
    getProjectsByUser(userId: number): Promise<string[]>;
    getMembersCountByProject(projectId: string): Promise<number>;
    getMembersCountByProjectAfterDate(projectId: string, date: string): Promise<number>;
    getDefaultStrategy(projectId: string, environment: string): Promise<CreateFeatureStrategySchema | null>;
    updateDefaultStrategy(projectId: string, environment: string, strategy: CreateFeatureStrategySchema): Promise<CreateFeatureStrategySchema>;
    count(): Promise<number>;
    mapLinkRow(row: any): IEnvironmentProjectLink;
    mapRow(row: any): IProject;
    mapProjectEnvironmentRow(row: {
        environment_name: string;
        default_strategy: CreateFeatureStrategySchema;
    }): ProjectEnvironment;
}
export default ProjectStore;
