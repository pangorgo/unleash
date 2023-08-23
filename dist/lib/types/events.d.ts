import { FeatureToggle, IStrategyConfig, ITag, IVariant } from './model';
import { IApiToken } from './models/api-token';
import { IUser } from './user';
export declare const APPLICATION_CREATED: "application-created";
export declare const FEATURE_CREATED: "feature-created";
export declare const FEATURE_DELETED: "feature-deleted";
export declare const FEATURE_UPDATED: "feature-updated";
export declare const FEATURE_METADATA_UPDATED: "feature-metadata-updated";
export declare const FEATURE_VARIANTS_UPDATED: "feature-variants-updated";
export declare const FEATURE_ENVIRONMENT_VARIANTS_UPDATED: "feature-environment-variants-updated";
export declare const FEATURE_PROJECT_CHANGE: "feature-project-change";
export declare const FEATURE_ARCHIVED: "feature-archived";
export declare const FEATURE_REVIVED: "feature-revived";
export declare const FEATURE_IMPORT: "feature-import";
export declare const FEATURE_TAGGED: "feature-tagged";
export declare const FEATURE_TAG_IMPORT: "feature-tag-import";
export declare const FEATURE_STRATEGY_UPDATE: "feature-strategy-update";
export declare const FEATURE_STRATEGY_ADD: "feature-strategy-add";
export declare const FEATURE_STRATEGY_REMOVE: "feature-strategy-remove";
export declare const DROP_FEATURE_TAGS: "drop-feature-tags";
export declare const FEATURE_UNTAGGED: "feature-untagged";
export declare const FEATURE_STALE_ON: "feature-stale-on";
export declare const FEATURE_STALE_OFF: "feature-stale-off";
export declare const DROP_FEATURES: "drop-features";
export declare const FEATURE_ENVIRONMENT_ENABLED: "feature-environment-enabled";
export declare const FEATURE_ENVIRONMENT_DISABLED: "feature-environment-disabled";
export declare const STRATEGY_ORDER_CHANGED = "strategy-order-changed";
export declare const STRATEGY_CREATED: "strategy-created";
export declare const STRATEGY_DELETED: "strategy-deleted";
export declare const STRATEGY_DEPRECATED: "strategy-deprecated";
export declare const STRATEGY_REACTIVATED: "strategy-reactivated";
export declare const STRATEGY_UPDATED: "strategy-updated";
export declare const STRATEGY_IMPORT: "strategy-import";
export declare const DROP_STRATEGIES: "drop-strategies";
export declare const CONTEXT_FIELD_CREATED: "context-field-created";
export declare const CONTEXT_FIELD_UPDATED: "context-field-updated";
export declare const CONTEXT_FIELD_DELETED: "context-field-deleted";
export declare const PROJECT_ACCESS_ADDED: "project-access-added";
export declare const PROJECT_CREATED: "project-created";
export declare const PROJECT_UPDATED: "project-updated";
export declare const PROJECT_DELETED: "project-deleted";
export declare const PROJECT_IMPORT: "project-import";
export declare const PROJECT_USER_ADDED: "project-user-added";
export declare const PROJECT_USER_REMOVED: "project-user-removed";
export declare const PROJECT_USER_ROLE_CHANGED: "project-user-role-changed";
export declare const PROJECT_GROUP_ADDED: "project-group-added";
export declare const PROJECT_GROUP_REMOVED: "project-group-removed";
export declare const PROJECT_GROUP_ROLE_CHANGED: "project-group-role-changed";
export declare const DROP_PROJECTS: "drop-projects";
export declare const TAG_CREATED: "tag-created";
export declare const TAG_DELETED: "tag-deleted";
export declare const TAG_IMPORT: "tag-import";
export declare const DROP_TAGS: "drop-tags";
export declare const TAG_TYPE_CREATED: "tag-type-created";
export declare const TAG_TYPE_DELETED: "tag-type-deleted";
export declare const TAG_TYPE_UPDATED: "tag-type-updated";
export declare const TAG_TYPE_IMPORT: "tag-type-import";
export declare const DROP_TAG_TYPES: "drop-tag-types";
export declare const ADDON_CONFIG_CREATED: "addon-config-created";
export declare const ADDON_CONFIG_UPDATED: "addon-config-updated";
export declare const ADDON_CONFIG_DELETED: "addon-config-deleted";
export declare const DB_POOL_UPDATE: "db-pool-update";
export declare const USER_CREATED: "user-created";
export declare const USER_UPDATED: "user-updated";
export declare const USER_DELETED: "user-deleted";
export declare const DROP_ENVIRONMENTS: "drop-environments";
export declare const ENVIRONMENT_IMPORT: "environment-import";
export declare const SEGMENT_CREATED: "segment-created";
export declare const SEGMENT_UPDATED: "segment-updated";
export declare const SEGMENT_DELETED: "segment-deleted";
export declare const GROUP_CREATED: "group-created";
export declare const GROUP_UPDATED: "group-updated";
export declare const SETTING_CREATED: "setting-created";
export declare const SETTING_UPDATED: "setting-updated";
export declare const SETTING_DELETED: "setting-deleted";
export declare const CLIENT_METRICS: "client-metrics";
export declare const CLIENT_REGISTER: "client-register";
export declare const PAT_CREATED: "pat-created";
export declare const PAT_DELETED: "pat-deleted";
export declare const PUBLIC_SIGNUP_TOKEN_CREATED: "public-signup-token-created";
export declare const PUBLIC_SIGNUP_TOKEN_USER_ADDED: "public-signup-token-user-added";
export declare const PUBLIC_SIGNUP_TOKEN_TOKEN_UPDATED: "public-signup-token-updated";
export declare const CHANGE_REQUEST_CREATED: "change-request-created";
export declare const CHANGE_REQUEST_DISCARDED: "change-request-discarded";
export declare const CHANGE_ADDED: "change-added";
export declare const CHANGE_DISCARDED: "change-discarded";
export declare const CHANGE_EDITED: "change-edited";
export declare const CHANGE_REQUEST_APPROVED: "change-request-approved";
export declare const CHANGE_REQUEST_REJECTED: "change-request-rejected";
export declare const CHANGE_REQUEST_APPROVAL_ADDED: "change-request-approval-added";
export declare const CHANGE_REQUEST_CANCELLED: "change-request-cancelled";
export declare const CHANGE_REQUEST_SENT_TO_REVIEW: "change-request-sent-to-review";
export declare const CHANGE_REQUEST_APPLIED: "change-request-applied";
export declare const API_TOKEN_CREATED: "api-token-created";
export declare const API_TOKEN_UPDATED: "api-token-updated";
export declare const API_TOKEN_DELETED: "api-token-deleted";
export declare const FEATURE_FAVORITED: "feature-favorited";
export declare const FEATURE_UNFAVORITED: "feature-unfavorited";
export declare const PROJECT_FAVORITED: "project-favorited";
export declare const PROJECT_UNFAVORITED: "project-unfavorited";
export declare const FEATURES_EXPORTED: "features-exported";
export declare const FEATURES_IMPORTED: "features-imported";
export declare const SERVICE_ACCOUNT_CREATED: "service-account-created";
export declare const SERVICE_ACCOUNT_UPDATED: "service-account-updated";
export declare const SERVICE_ACCOUNT_DELETED: "service-account-deleted";
export declare const FEATURE_POTENTIALLY_STALE_ON: "feature-potentially-stale-on";
export declare const IEventTypes: readonly ["application-created", "feature-created", "feature-deleted", "feature-updated", "feature-metadata-updated", "feature-variants-updated", "feature-environment-variants-updated", "feature-project-change", "feature-archived", "feature-revived", "feature-import", "feature-tagged", "feature-tag-import", "feature-strategy-update", "feature-strategy-add", "feature-strategy-remove", "strategy-order-changed", "drop-feature-tags", "feature-untagged", "feature-stale-on", "feature-stale-off", "drop-features", "feature-environment-enabled", "feature-environment-disabled", "strategy-created", "strategy-deleted", "strategy-deprecated", "strategy-reactivated", "strategy-updated", "strategy-import", "drop-strategies", "context-field-created", "context-field-updated", "context-field-deleted", "project-access-added", "project-created", "project-updated", "project-deleted", "project-import", "project-user-added", "project-user-removed", "project-user-role-changed", "project-group-role-changed", "project-group-added", "project-group-removed", "drop-projects", "tag-created", "tag-deleted", "tag-import", "drop-tags", "tag-type-created", "tag-type-deleted", "tag-type-updated", "tag-type-import", "drop-tag-types", "addon-config-created", "addon-config-updated", "addon-config-deleted", "db-pool-update", "user-created", "user-updated", "user-deleted", "drop-environments", "environment-import", "segment-created", "segment-updated", "segment-deleted", "group-created", "group-updated", "setting-created", "setting-updated", "setting-deleted", "client-metrics", "client-register", "pat-created", "pat-deleted", "public-signup-token-created", "public-signup-token-user-added", "public-signup-token-updated", "change-request-created", "change-request-discarded", "change-added", "change-discarded", "change-edited", "change-request-rejected", "change-request-approved", "change-request-approval-added", "change-request-cancelled", "change-request-sent-to-review", "change-request-applied", "api-token-created", "api-token-updated", "api-token-deleted", "feature-favorited", "feature-unfavorited", "project-favorited", "project-unfavorited", "features-exported", "features-imported", "service-account-created", "service-account-deleted", "service-account-updated", "feature-potentially-stale-on"];
export declare type IEventType = typeof IEventTypes[number];
export interface IBaseEvent {
    type: IEventType;
    createdBy: string;
    project?: string;
    environment?: string;
    featureName?: string;
    data?: any;
    preData?: any;
    tags?: ITag[];
}
export interface IEvent extends IBaseEvent {
    id: number;
    createdAt: Date;
}
export interface IEventList {
    totalEvents: number;
    events: IEvent[];
}
declare class BaseEvent implements IBaseEvent {
    readonly type: IEventType;
    readonly createdBy: string;
    readonly tags: ITag[];
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(type: IEventType, createdBy: string | IUser, tags?: ITag[]);
}
export declare class FeatureStaleEvent extends BaseEvent {
    readonly project: string;
    readonly featureName: string;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p: {
        stale: boolean;
        project: string;
        featureName: string;
        createdBy: string | IUser;
        tags: ITag[];
    });
}
export declare class FeatureEnvironmentEvent extends BaseEvent {
    readonly project: string;
    readonly featureName: string;
    readonly environment: string;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p: {
        enabled: boolean;
        project: string;
        featureName: string;
        environment: string;
        createdBy: string | IUser;
        tags: ITag[];
    });
}
export declare type StrategyIds = {
    strategyIds: string[];
};
export declare class StrategiesOrderChangedEvent extends BaseEvent {
    readonly project: string;
    readonly featureName: string;
    readonly environment: string;
    readonly data: StrategyIds;
    readonly preData: StrategyIds;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p: {
        project: string;
        featureName: string;
        environment: string;
        createdBy: string | IUser;
        data: StrategyIds;
        preData: StrategyIds;
        tags: ITag[];
    });
}
export declare class FeatureVariantEvent extends BaseEvent {
    readonly project: string;
    readonly featureName: string;
    readonly data: {
        variants: IVariant[];
    };
    readonly preData: {
        variants: IVariant[];
    };
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p: {
        project: string;
        featureName: string;
        createdBy: string | IUser;
        tags: ITag[];
        newVariants: IVariant[];
        oldVariants: IVariant[];
    });
}
export declare class EnvironmentVariantEvent extends BaseEvent {
    readonly project: string;
    readonly environment: string;
    readonly featureName: string;
    readonly data: {
        variants: IVariant[];
    };
    readonly preData: {
        variants: IVariant[];
    };
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p: {
        featureName: string;
        environment: string;
        project: string;
        createdBy: string | IUser;
        newVariants: IVariant[];
        oldVariants: IVariant[];
    });
}
export declare class FeatureChangeProjectEvent extends BaseEvent {
    readonly project: string;
    readonly featureName: string;
    readonly data: {
        oldProject: string;
        newProject: string;
    };
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p: {
        oldProject: string;
        newProject: string;
        featureName: string;
        createdBy: string | IUser;
        tags: ITag[];
    });
}
export declare class FeatureCreatedEvent extends BaseEvent {
    readonly project: string;
    readonly featureName: string;
    readonly data: FeatureToggle;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p: {
        project: string;
        featureName: string;
        createdBy: string | IUser;
        data: FeatureToggle;
        tags: ITag[];
    });
}
export declare class FeatureArchivedEvent extends BaseEvent {
    readonly project: string;
    readonly featureName: string;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p: {
        project: string;
        featureName: string;
        createdBy: string | IUser;
        tags: ITag[];
    });
}
export declare class FeatureRevivedEvent extends BaseEvent {
    readonly project: string;
    readonly featureName: string;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p: {
        project: string;
        featureName: string;
        createdBy: string | IUser;
        tags: ITag[];
    });
}
export declare class FeatureDeletedEvent extends BaseEvent {
    readonly project: string;
    readonly featureName: string;
    readonly preData: FeatureToggle;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p: {
        project: string;
        featureName: string;
        preData: FeatureToggle;
        createdBy: string | IUser;
        tags: ITag[];
    });
}
export declare class FeatureMetadataUpdateEvent extends BaseEvent {
    readonly project: string;
    readonly featureName: string;
    readonly data: FeatureToggle;
    readonly preData: FeatureToggle;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p: {
        featureName: string;
        createdBy: string | IUser;
        project: string;
        data: FeatureToggle;
        preData: FeatureToggle;
        tags: ITag[];
    });
}
export declare class FeatureStrategyAddEvent extends BaseEvent {
    readonly project: string;
    readonly featureName: string;
    readonly environment: string;
    readonly data: IStrategyConfig;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p: {
        project: string;
        featureName: string;
        environment: string;
        createdBy: string | IUser;
        data: IStrategyConfig;
        tags: ITag[];
    });
}
export declare class FeatureStrategyUpdateEvent extends BaseEvent {
    readonly project: string;
    readonly featureName: string;
    readonly environment: string;
    readonly data: IStrategyConfig;
    readonly preData: IStrategyConfig;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p: {
        project: string;
        featureName: string;
        environment: string;
        createdBy: string | IUser;
        data: IStrategyConfig;
        preData: IStrategyConfig;
        tags: ITag[];
    });
}
export declare class FeatureStrategyRemoveEvent extends BaseEvent {
    readonly project: string;
    readonly featureName: string;
    readonly environment: string;
    readonly preData: IStrategyConfig;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p: {
        project: string;
        featureName: string;
        environment: string;
        createdBy: string | IUser;
        preData: IStrategyConfig;
        tags: ITag[];
    });
}
export declare class ProjectUserAddedEvent extends BaseEvent {
    readonly project: string;
    readonly data: any;
    readonly preData: any;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p: {
        project: string;
        createdBy: string | IUser;
        data: any;
    });
}
export declare class ProjectUserRemovedEvent extends BaseEvent {
    readonly project: string;
    readonly data: any;
    readonly preData: any;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p: {
        project: string;
        createdBy: string | IUser;
        preData: any;
    });
}
export declare class ProjectUserUpdateRoleEvent extends BaseEvent {
    readonly project: string;
    readonly data: any;
    readonly preData: any;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData: {
        project: string;
        createdBy: string | IUser;
        data: any;
        preData: any;
    });
}
export declare class ProjectGroupAddedEvent extends BaseEvent {
    readonly project: string;
    readonly data: any;
    readonly preData: any;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p: {
        project: string;
        createdBy: string | IUser;
        data: any;
    });
}
export declare class ProjectGroupRemovedEvent extends BaseEvent {
    readonly project: string;
    readonly data: any;
    readonly preData: any;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p: {
        project: string;
        createdBy: string | IUser;
        preData: any;
    });
}
export declare class ProjectGroupUpdateRoleEvent extends BaseEvent {
    readonly project: string;
    readonly data: any;
    readonly preData: any;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData: {
        project: string;
        createdBy: string | IUser;
        data: any;
        preData: any;
    });
}
export declare class ProjectAccessAddedEvent extends BaseEvent {
    readonly project: string;
    readonly data: any;
    readonly preData: any;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p: {
        project: string;
        createdBy: string | IUser;
        data: any;
    });
}
export declare class SettingCreatedEvent extends BaseEvent {
    readonly data: any;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData: {
        createdBy: string | IUser;
        data: any;
    });
}
export declare class SettingDeletedEvent extends BaseEvent {
    readonly data: any;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData: {
        createdBy: string | IUser;
        data: any;
    });
}
export declare class SettingUpdatedEvent extends BaseEvent {
    readonly data: any;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData: {
        createdBy: string | IUser;
        data: any;
    });
}
export declare class PublicSignupTokenCreatedEvent extends BaseEvent {
    readonly data: any;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData: {
        createdBy: string | IUser;
        data: any;
    });
}
export declare class PublicSignupTokenUpdatedEvent extends BaseEvent {
    readonly data: any;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData: {
        createdBy: string | IUser;
        data: any;
    });
}
export declare class PublicSignupTokenUserAddedEvent extends BaseEvent {
    readonly data: any;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData: {
        createdBy: string | IUser;
        data: any;
    });
}
export declare class ApiTokenCreatedEvent extends BaseEvent {
    readonly data: any;
    readonly environment: string;
    readonly project: string;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData: {
        createdBy: string | IUser;
        apiToken: Omit<IApiToken, 'secret'>;
    });
}
export declare class ApiTokenDeletedEvent extends BaseEvent {
    readonly preData: any;
    readonly environment: string;
    readonly project: string;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData: {
        createdBy: string | IUser;
        apiToken: Omit<IApiToken, 'secret'>;
    });
}
export declare class ApiTokenUpdatedEvent extends BaseEvent {
    readonly preData: any;
    readonly data: any;
    readonly environment: string;
    readonly project: string;
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData: {
        createdBy: string | IUser;
        previousToken: Omit<IApiToken, 'secret'>;
        apiToken: Omit<IApiToken, 'secret'>;
    });
}
export declare class PotentiallyStaleOnEvent extends BaseEvent {
    readonly featureName: string;
    readonly project: string;
    constructor(eventData: {
        featureName: string;
        project: string;
        tags: ITag[];
    });
}
export {};
