"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DROP_TAGS = exports.TAG_IMPORT = exports.TAG_DELETED = exports.TAG_CREATED = exports.DROP_PROJECTS = exports.PROJECT_GROUP_ROLE_CHANGED = exports.PROJECT_GROUP_REMOVED = exports.PROJECT_GROUP_ADDED = exports.PROJECT_USER_ROLE_CHANGED = exports.PROJECT_USER_REMOVED = exports.PROJECT_USER_ADDED = exports.PROJECT_IMPORT = exports.PROJECT_DELETED = exports.PROJECT_UPDATED = exports.PROJECT_CREATED = exports.PROJECT_ACCESS_ADDED = exports.CONTEXT_FIELD_DELETED = exports.CONTEXT_FIELD_UPDATED = exports.CONTEXT_FIELD_CREATED = exports.DROP_STRATEGIES = exports.STRATEGY_IMPORT = exports.STRATEGY_UPDATED = exports.STRATEGY_REACTIVATED = exports.STRATEGY_DEPRECATED = exports.STRATEGY_DELETED = exports.STRATEGY_CREATED = exports.STRATEGY_ORDER_CHANGED = exports.FEATURE_ENVIRONMENT_DISABLED = exports.FEATURE_ENVIRONMENT_ENABLED = exports.DROP_FEATURES = exports.FEATURE_STALE_OFF = exports.FEATURE_STALE_ON = exports.FEATURE_UNTAGGED = exports.DROP_FEATURE_TAGS = exports.FEATURE_STRATEGY_REMOVE = exports.FEATURE_STRATEGY_ADD = exports.FEATURE_STRATEGY_UPDATE = exports.FEATURE_TAG_IMPORT = exports.FEATURE_TAGGED = exports.FEATURE_IMPORT = exports.FEATURE_REVIVED = exports.FEATURE_ARCHIVED = exports.FEATURE_PROJECT_CHANGE = exports.FEATURE_ENVIRONMENT_VARIANTS_UPDATED = exports.FEATURE_VARIANTS_UPDATED = exports.FEATURE_METADATA_UPDATED = exports.FEATURE_UPDATED = exports.FEATURE_DELETED = exports.FEATURE_CREATED = exports.APPLICATION_CREATED = void 0;
exports.SERVICE_ACCOUNT_CREATED = exports.FEATURES_IMPORTED = exports.FEATURES_EXPORTED = exports.PROJECT_UNFAVORITED = exports.PROJECT_FAVORITED = exports.FEATURE_UNFAVORITED = exports.FEATURE_FAVORITED = exports.API_TOKEN_DELETED = exports.API_TOKEN_UPDATED = exports.API_TOKEN_CREATED = exports.CHANGE_REQUEST_APPLIED = exports.CHANGE_REQUEST_SENT_TO_REVIEW = exports.CHANGE_REQUEST_CANCELLED = exports.CHANGE_REQUEST_APPROVAL_ADDED = exports.CHANGE_REQUEST_REJECTED = exports.CHANGE_REQUEST_APPROVED = exports.CHANGE_EDITED = exports.CHANGE_DISCARDED = exports.CHANGE_ADDED = exports.CHANGE_REQUEST_DISCARDED = exports.CHANGE_REQUEST_CREATED = exports.PUBLIC_SIGNUP_TOKEN_TOKEN_UPDATED = exports.PUBLIC_SIGNUP_TOKEN_USER_ADDED = exports.PUBLIC_SIGNUP_TOKEN_CREATED = exports.PAT_DELETED = exports.PAT_CREATED = exports.CLIENT_REGISTER = exports.CLIENT_METRICS = exports.SETTING_DELETED = exports.SETTING_UPDATED = exports.SETTING_CREATED = exports.GROUP_UPDATED = exports.GROUP_CREATED = exports.SEGMENT_DELETED = exports.SEGMENT_UPDATED = exports.SEGMENT_CREATED = exports.ENVIRONMENT_IMPORT = exports.DROP_ENVIRONMENTS = exports.USER_DELETED = exports.USER_UPDATED = exports.USER_CREATED = exports.DB_POOL_UPDATE = exports.ADDON_CONFIG_DELETED = exports.ADDON_CONFIG_UPDATED = exports.ADDON_CONFIG_CREATED = exports.DROP_TAG_TYPES = exports.TAG_TYPE_IMPORT = exports.TAG_TYPE_UPDATED = exports.TAG_TYPE_DELETED = exports.TAG_TYPE_CREATED = void 0;
exports.PotentiallyStaleOnEvent = exports.ApiTokenUpdatedEvent = exports.ApiTokenDeletedEvent = exports.ApiTokenCreatedEvent = exports.PublicSignupTokenUserAddedEvent = exports.PublicSignupTokenUpdatedEvent = exports.PublicSignupTokenCreatedEvent = exports.SettingUpdatedEvent = exports.SettingDeletedEvent = exports.SettingCreatedEvent = exports.ProjectAccessAddedEvent = exports.ProjectGroupUpdateRoleEvent = exports.ProjectGroupRemovedEvent = exports.ProjectGroupAddedEvent = exports.ProjectUserUpdateRoleEvent = exports.ProjectUserRemovedEvent = exports.ProjectUserAddedEvent = exports.FeatureStrategyRemoveEvent = exports.FeatureStrategyUpdateEvent = exports.FeatureStrategyAddEvent = exports.FeatureMetadataUpdateEvent = exports.FeatureDeletedEvent = exports.FeatureRevivedEvent = exports.FeatureArchivedEvent = exports.FeatureCreatedEvent = exports.FeatureChangeProjectEvent = exports.EnvironmentVariantEvent = exports.FeatureVariantEvent = exports.StrategiesOrderChangedEvent = exports.FeatureEnvironmentEvent = exports.FeatureStaleEvent = exports.IEventTypes = exports.FEATURE_POTENTIALLY_STALE_ON = exports.SERVICE_ACCOUNT_DELETED = exports.SERVICE_ACCOUNT_UPDATED = void 0;
const util_1 = require("../util");
exports.APPLICATION_CREATED = 'application-created';
// feature event types
exports.FEATURE_CREATED = 'feature-created';
exports.FEATURE_DELETED = 'feature-deleted';
exports.FEATURE_UPDATED = 'feature-updated';
exports.FEATURE_METADATA_UPDATED = 'feature-metadata-updated';
exports.FEATURE_VARIANTS_UPDATED = 'feature-variants-updated';
exports.FEATURE_ENVIRONMENT_VARIANTS_UPDATED = 'feature-environment-variants-updated';
exports.FEATURE_PROJECT_CHANGE = 'feature-project-change';
exports.FEATURE_ARCHIVED = 'feature-archived';
exports.FEATURE_REVIVED = 'feature-revived';
exports.FEATURE_IMPORT = 'feature-import';
exports.FEATURE_TAGGED = 'feature-tagged';
exports.FEATURE_TAG_IMPORT = 'feature-tag-import';
exports.FEATURE_STRATEGY_UPDATE = 'feature-strategy-update';
exports.FEATURE_STRATEGY_ADD = 'feature-strategy-add';
exports.FEATURE_STRATEGY_REMOVE = 'feature-strategy-remove';
exports.DROP_FEATURE_TAGS = 'drop-feature-tags';
exports.FEATURE_UNTAGGED = 'feature-untagged';
exports.FEATURE_STALE_ON = 'feature-stale-on';
exports.FEATURE_STALE_OFF = 'feature-stale-off';
exports.DROP_FEATURES = 'drop-features';
exports.FEATURE_ENVIRONMENT_ENABLED = 'feature-environment-enabled';
exports.FEATURE_ENVIRONMENT_DISABLED = 'feature-environment-disabled';
exports.STRATEGY_ORDER_CHANGED = 'strategy-order-changed';
exports.STRATEGY_CREATED = 'strategy-created';
exports.STRATEGY_DELETED = 'strategy-deleted';
exports.STRATEGY_DEPRECATED = 'strategy-deprecated';
exports.STRATEGY_REACTIVATED = 'strategy-reactivated';
exports.STRATEGY_UPDATED = 'strategy-updated';
exports.STRATEGY_IMPORT = 'strategy-import';
exports.DROP_STRATEGIES = 'drop-strategies';
exports.CONTEXT_FIELD_CREATED = 'context-field-created';
exports.CONTEXT_FIELD_UPDATED = 'context-field-updated';
exports.CONTEXT_FIELD_DELETED = 'context-field-deleted';
exports.PROJECT_ACCESS_ADDED = 'project-access-added';
exports.PROJECT_CREATED = 'project-created';
exports.PROJECT_UPDATED = 'project-updated';
exports.PROJECT_DELETED = 'project-deleted';
exports.PROJECT_IMPORT = 'project-import';
exports.PROJECT_USER_ADDED = 'project-user-added';
exports.PROJECT_USER_REMOVED = 'project-user-removed';
exports.PROJECT_USER_ROLE_CHANGED = 'project-user-role-changed';
exports.PROJECT_GROUP_ADDED = 'project-group-added';
exports.PROJECT_GROUP_REMOVED = 'project-group-removed';
exports.PROJECT_GROUP_ROLE_CHANGED = 'project-group-role-changed';
exports.DROP_PROJECTS = 'drop-projects';
exports.TAG_CREATED = 'tag-created';
exports.TAG_DELETED = 'tag-deleted';
exports.TAG_IMPORT = 'tag-import';
exports.DROP_TAGS = 'drop-tags';
exports.TAG_TYPE_CREATED = 'tag-type-created';
exports.TAG_TYPE_DELETED = 'tag-type-deleted';
exports.TAG_TYPE_UPDATED = 'tag-type-updated';
exports.TAG_TYPE_IMPORT = 'tag-type-import';
exports.DROP_TAG_TYPES = 'drop-tag-types';
exports.ADDON_CONFIG_CREATED = 'addon-config-created';
exports.ADDON_CONFIG_UPDATED = 'addon-config-updated';
exports.ADDON_CONFIG_DELETED = 'addon-config-deleted';
exports.DB_POOL_UPDATE = 'db-pool-update';
exports.USER_CREATED = 'user-created';
exports.USER_UPDATED = 'user-updated';
exports.USER_DELETED = 'user-deleted';
exports.DROP_ENVIRONMENTS = 'drop-environments';
exports.ENVIRONMENT_IMPORT = 'environment-import';
exports.SEGMENT_CREATED = 'segment-created';
exports.SEGMENT_UPDATED = 'segment-updated';
exports.SEGMENT_DELETED = 'segment-deleted';
exports.GROUP_CREATED = 'group-created';
exports.GROUP_UPDATED = 'group-updated';
exports.SETTING_CREATED = 'setting-created';
exports.SETTING_UPDATED = 'setting-updated';
exports.SETTING_DELETED = 'setting-deleted';
exports.CLIENT_METRICS = 'client-metrics';
exports.CLIENT_REGISTER = 'client-register';
exports.PAT_CREATED = 'pat-created';
exports.PAT_DELETED = 'pat-deleted';
exports.PUBLIC_SIGNUP_TOKEN_CREATED = 'public-signup-token-created';
exports.PUBLIC_SIGNUP_TOKEN_USER_ADDED = 'public-signup-token-user-added';
exports.PUBLIC_SIGNUP_TOKEN_TOKEN_UPDATED = 'public-signup-token-updated';
exports.CHANGE_REQUEST_CREATED = 'change-request-created';
exports.CHANGE_REQUEST_DISCARDED = 'change-request-discarded';
exports.CHANGE_ADDED = 'change-added';
exports.CHANGE_DISCARDED = 'change-discarded';
exports.CHANGE_EDITED = 'change-edited';
exports.CHANGE_REQUEST_APPROVED = 'change-request-approved';
exports.CHANGE_REQUEST_REJECTED = 'change-request-rejected';
exports.CHANGE_REQUEST_APPROVAL_ADDED = 'change-request-approval-added';
exports.CHANGE_REQUEST_CANCELLED = 'change-request-cancelled';
exports.CHANGE_REQUEST_SENT_TO_REVIEW = 'change-request-sent-to-review';
exports.CHANGE_REQUEST_APPLIED = 'change-request-applied';
exports.API_TOKEN_CREATED = 'api-token-created';
exports.API_TOKEN_UPDATED = 'api-token-updated';
exports.API_TOKEN_DELETED = 'api-token-deleted';
exports.FEATURE_FAVORITED = 'feature-favorited';
exports.FEATURE_UNFAVORITED = 'feature-unfavorited';
exports.PROJECT_FAVORITED = 'project-favorited';
exports.PROJECT_UNFAVORITED = 'project-unfavorited';
exports.FEATURES_EXPORTED = 'features-exported';
exports.FEATURES_IMPORTED = 'features-imported';
exports.SERVICE_ACCOUNT_CREATED = 'service-account-created';
exports.SERVICE_ACCOUNT_UPDATED = 'service-account-updated';
exports.SERVICE_ACCOUNT_DELETED = 'service-account-deleted';
exports.FEATURE_POTENTIALLY_STALE_ON = 'feature-potentially-stale-on';
exports.IEventTypes = [
    exports.APPLICATION_CREATED,
    exports.FEATURE_CREATED,
    exports.FEATURE_DELETED,
    exports.FEATURE_UPDATED,
    exports.FEATURE_METADATA_UPDATED,
    exports.FEATURE_VARIANTS_UPDATED,
    exports.FEATURE_ENVIRONMENT_VARIANTS_UPDATED,
    exports.FEATURE_PROJECT_CHANGE,
    exports.FEATURE_ARCHIVED,
    exports.FEATURE_REVIVED,
    exports.FEATURE_IMPORT,
    exports.FEATURE_TAGGED,
    exports.FEATURE_TAG_IMPORT,
    exports.FEATURE_STRATEGY_UPDATE,
    exports.FEATURE_STRATEGY_ADD,
    exports.FEATURE_STRATEGY_REMOVE,
    exports.STRATEGY_ORDER_CHANGED,
    exports.DROP_FEATURE_TAGS,
    exports.FEATURE_UNTAGGED,
    exports.FEATURE_STALE_ON,
    exports.FEATURE_STALE_OFF,
    exports.DROP_FEATURES,
    exports.FEATURE_ENVIRONMENT_ENABLED,
    exports.FEATURE_ENVIRONMENT_DISABLED,
    exports.STRATEGY_CREATED,
    exports.STRATEGY_DELETED,
    exports.STRATEGY_DEPRECATED,
    exports.STRATEGY_REACTIVATED,
    exports.STRATEGY_UPDATED,
    exports.STRATEGY_IMPORT,
    exports.DROP_STRATEGIES,
    exports.CONTEXT_FIELD_CREATED,
    exports.CONTEXT_FIELD_UPDATED,
    exports.CONTEXT_FIELD_DELETED,
    exports.PROJECT_ACCESS_ADDED,
    exports.PROJECT_CREATED,
    exports.PROJECT_UPDATED,
    exports.PROJECT_DELETED,
    exports.PROJECT_IMPORT,
    exports.PROJECT_USER_ADDED,
    exports.PROJECT_USER_REMOVED,
    exports.PROJECT_USER_ROLE_CHANGED,
    exports.PROJECT_GROUP_ROLE_CHANGED,
    exports.PROJECT_GROUP_ADDED,
    exports.PROJECT_GROUP_REMOVED,
    exports.DROP_PROJECTS,
    exports.TAG_CREATED,
    exports.TAG_DELETED,
    exports.TAG_IMPORT,
    exports.DROP_TAGS,
    exports.TAG_TYPE_CREATED,
    exports.TAG_TYPE_DELETED,
    exports.TAG_TYPE_UPDATED,
    exports.TAG_TYPE_IMPORT,
    exports.DROP_TAG_TYPES,
    exports.ADDON_CONFIG_CREATED,
    exports.ADDON_CONFIG_UPDATED,
    exports.ADDON_CONFIG_DELETED,
    exports.DB_POOL_UPDATE,
    exports.USER_CREATED,
    exports.USER_UPDATED,
    exports.USER_DELETED,
    exports.DROP_ENVIRONMENTS,
    exports.ENVIRONMENT_IMPORT,
    exports.SEGMENT_CREATED,
    exports.SEGMENT_UPDATED,
    exports.SEGMENT_DELETED,
    exports.GROUP_CREATED,
    exports.GROUP_UPDATED,
    exports.SETTING_CREATED,
    exports.SETTING_UPDATED,
    exports.SETTING_DELETED,
    exports.CLIENT_METRICS,
    exports.CLIENT_REGISTER,
    exports.PAT_CREATED,
    exports.PAT_DELETED,
    exports.PUBLIC_SIGNUP_TOKEN_CREATED,
    exports.PUBLIC_SIGNUP_TOKEN_USER_ADDED,
    exports.PUBLIC_SIGNUP_TOKEN_TOKEN_UPDATED,
    exports.CHANGE_REQUEST_CREATED,
    exports.CHANGE_REQUEST_DISCARDED,
    exports.CHANGE_ADDED,
    exports.CHANGE_DISCARDED,
    exports.CHANGE_EDITED,
    exports.CHANGE_REQUEST_REJECTED,
    exports.CHANGE_REQUEST_APPROVED,
    exports.CHANGE_REQUEST_APPROVAL_ADDED,
    exports.CHANGE_REQUEST_CANCELLED,
    exports.CHANGE_REQUEST_SENT_TO_REVIEW,
    exports.CHANGE_REQUEST_APPLIED,
    exports.API_TOKEN_CREATED,
    exports.API_TOKEN_UPDATED,
    exports.API_TOKEN_DELETED,
    exports.FEATURE_FAVORITED,
    exports.FEATURE_UNFAVORITED,
    exports.PROJECT_FAVORITED,
    exports.PROJECT_UNFAVORITED,
    exports.FEATURES_EXPORTED,
    exports.FEATURES_IMPORTED,
    exports.SERVICE_ACCOUNT_CREATED,
    exports.SERVICE_ACCOUNT_DELETED,
    exports.SERVICE_ACCOUNT_UPDATED,
    exports.FEATURE_POTENTIALLY_STALE_ON,
];
class BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(type, createdBy, tags = []) {
        this.type = type;
        this.createdBy =
            typeof createdBy === 'string'
                ? createdBy
                : (0, util_1.extractUsernameFromUser)(createdBy);
        this.tags = tags;
    }
}
class FeatureStaleEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p) {
        super(p.stale ? exports.FEATURE_STALE_ON : exports.FEATURE_STALE_OFF, p.createdBy, p.tags);
        this.project = p.project;
        this.featureName = p.featureName;
    }
}
exports.FeatureStaleEvent = FeatureStaleEvent;
class FeatureEnvironmentEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p) {
        super(p.enabled
            ? exports.FEATURE_ENVIRONMENT_ENABLED
            : exports.FEATURE_ENVIRONMENT_DISABLED, p.createdBy, p.tags);
        this.project = p.project;
        this.featureName = p.featureName;
        this.environment = p.environment;
    }
}
exports.FeatureEnvironmentEvent = FeatureEnvironmentEvent;
class StrategiesOrderChangedEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p) {
        super(exports.STRATEGY_ORDER_CHANGED, p.createdBy, p.tags);
        const { project, featureName, environment, data, preData } = p;
        this.project = project;
        this.featureName = featureName;
        this.environment = environment;
        this.data = data;
        this.preData = preData;
    }
}
exports.StrategiesOrderChangedEvent = StrategiesOrderChangedEvent;
class FeatureVariantEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p) {
        super(exports.FEATURE_VARIANTS_UPDATED, p.createdBy, p.tags);
        this.project = p.project;
        this.featureName = p.featureName;
        this.data = { variants: p.newVariants };
        this.preData = { variants: p.oldVariants };
    }
}
exports.FeatureVariantEvent = FeatureVariantEvent;
class EnvironmentVariantEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p) {
        super(exports.FEATURE_ENVIRONMENT_VARIANTS_UPDATED, p.createdBy);
        this.featureName = p.featureName;
        this.environment = p.environment;
        this.project = p.project;
        this.data = { variants: p.newVariants };
        this.preData = { variants: p.oldVariants };
    }
}
exports.EnvironmentVariantEvent = EnvironmentVariantEvent;
class FeatureChangeProjectEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p) {
        super(exports.FEATURE_PROJECT_CHANGE, p.createdBy, p.tags);
        const { newProject, oldProject, featureName } = p;
        this.project = newProject;
        this.featureName = featureName;
        this.data = { newProject, oldProject };
    }
}
exports.FeatureChangeProjectEvent = FeatureChangeProjectEvent;
class FeatureCreatedEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p) {
        super(exports.FEATURE_CREATED, p.createdBy, p.tags);
        const { project, featureName, data } = p;
        this.project = project;
        this.featureName = featureName;
        this.data = data;
    }
}
exports.FeatureCreatedEvent = FeatureCreatedEvent;
class FeatureArchivedEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p) {
        super(exports.FEATURE_ARCHIVED, p.createdBy, p.tags);
        const { project, featureName } = p;
        this.project = project;
        this.featureName = featureName;
    }
}
exports.FeatureArchivedEvent = FeatureArchivedEvent;
class FeatureRevivedEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p) {
        super(exports.FEATURE_REVIVED, p.createdBy, p.tags);
        const { project, featureName } = p;
        this.project = project;
        this.featureName = featureName;
    }
}
exports.FeatureRevivedEvent = FeatureRevivedEvent;
class FeatureDeletedEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p) {
        super(exports.FEATURE_DELETED, p.createdBy, p.tags);
        const { project, featureName, preData } = p;
        this.project = project;
        this.featureName = featureName;
        this.preData = preData;
    }
}
exports.FeatureDeletedEvent = FeatureDeletedEvent;
class FeatureMetadataUpdateEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p) {
        super(exports.FEATURE_METADATA_UPDATED, p.createdBy, p.tags);
        const { project, featureName, data, preData } = p;
        this.project = project;
        this.featureName = featureName;
        this.data = data;
        this.preData = preData;
    }
}
exports.FeatureMetadataUpdateEvent = FeatureMetadataUpdateEvent;
class FeatureStrategyAddEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p) {
        super(exports.FEATURE_STRATEGY_ADD, p.createdBy, p.tags);
        const { project, featureName, environment, data } = p;
        this.project = project;
        this.featureName = featureName;
        this.environment = environment;
        this.data = data;
    }
}
exports.FeatureStrategyAddEvent = FeatureStrategyAddEvent;
class FeatureStrategyUpdateEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p) {
        super(exports.FEATURE_STRATEGY_UPDATE, p.createdBy, p.tags);
        const { project, featureName, environment, data, preData } = p;
        this.project = project;
        this.featureName = featureName;
        this.environment = environment;
        this.data = data;
        this.preData = preData;
    }
}
exports.FeatureStrategyUpdateEvent = FeatureStrategyUpdateEvent;
class FeatureStrategyRemoveEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p) {
        super(exports.FEATURE_STRATEGY_REMOVE, p.createdBy, p.tags);
        const { project, featureName, environment, preData } = p;
        this.project = project;
        this.featureName = featureName;
        this.environment = environment;
        this.preData = preData;
    }
}
exports.FeatureStrategyRemoveEvent = FeatureStrategyRemoveEvent;
class ProjectUserAddedEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p) {
        super(exports.PROJECT_USER_ADDED, p.createdBy);
        const { project, data } = p;
        this.project = project;
        this.data = data;
        this.preData = null;
    }
}
exports.ProjectUserAddedEvent = ProjectUserAddedEvent;
class ProjectUserRemovedEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p) {
        super(exports.PROJECT_USER_REMOVED, p.createdBy);
        const { project, preData } = p;
        this.project = project;
        this.data = null;
        this.preData = preData;
    }
}
exports.ProjectUserRemovedEvent = ProjectUserRemovedEvent;
class ProjectUserUpdateRoleEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData) {
        super(exports.PROJECT_USER_ROLE_CHANGED, eventData.createdBy);
        const { project, data, preData } = eventData;
        this.project = project;
        this.data = data;
        this.preData = preData;
    }
}
exports.ProjectUserUpdateRoleEvent = ProjectUserUpdateRoleEvent;
class ProjectGroupAddedEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p) {
        super(exports.PROJECT_GROUP_ADDED, p.createdBy);
        const { project, data } = p;
        this.project = project;
        this.data = data;
        this.preData = null;
    }
}
exports.ProjectGroupAddedEvent = ProjectGroupAddedEvent;
class ProjectGroupRemovedEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p) {
        super(exports.PROJECT_GROUP_REMOVED, p.createdBy);
        const { project, preData } = p;
        this.project = project;
        this.data = null;
        this.preData = preData;
    }
}
exports.ProjectGroupRemovedEvent = ProjectGroupRemovedEvent;
class ProjectGroupUpdateRoleEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData) {
        super(exports.PROJECT_GROUP_ROLE_CHANGED, eventData.createdBy);
        const { project, data, preData } = eventData;
        this.project = project;
        this.data = data;
        this.preData = preData;
    }
}
exports.ProjectGroupUpdateRoleEvent = ProjectGroupUpdateRoleEvent;
class ProjectAccessAddedEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(p) {
        super(exports.PROJECT_ACCESS_ADDED, p.createdBy);
        const { project, data } = p;
        this.project = project;
        this.data = data;
        this.preData = null;
    }
}
exports.ProjectAccessAddedEvent = ProjectAccessAddedEvent;
class SettingCreatedEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData) {
        super(exports.SETTING_CREATED, eventData.createdBy);
        this.data = eventData.data;
    }
}
exports.SettingCreatedEvent = SettingCreatedEvent;
class SettingDeletedEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData) {
        super(exports.SETTING_DELETED, eventData.createdBy);
        this.data = eventData.data;
    }
}
exports.SettingDeletedEvent = SettingDeletedEvent;
class SettingUpdatedEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData) {
        super(exports.SETTING_UPDATED, eventData.createdBy);
        this.data = eventData.data;
    }
}
exports.SettingUpdatedEvent = SettingUpdatedEvent;
class PublicSignupTokenCreatedEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData) {
        super(exports.PUBLIC_SIGNUP_TOKEN_CREATED, eventData.createdBy);
        this.data = eventData.data;
    }
}
exports.PublicSignupTokenCreatedEvent = PublicSignupTokenCreatedEvent;
class PublicSignupTokenUpdatedEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData) {
        super(exports.PUBLIC_SIGNUP_TOKEN_TOKEN_UPDATED, eventData.createdBy);
        this.data = eventData.data;
    }
}
exports.PublicSignupTokenUpdatedEvent = PublicSignupTokenUpdatedEvent;
class PublicSignupTokenUserAddedEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData) {
        super(exports.PUBLIC_SIGNUP_TOKEN_USER_ADDED, eventData.createdBy);
        this.data = eventData.data;
    }
}
exports.PublicSignupTokenUserAddedEvent = PublicSignupTokenUserAddedEvent;
class ApiTokenCreatedEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData) {
        super(exports.API_TOKEN_CREATED, eventData.createdBy);
        this.data = eventData.apiToken;
        this.environment = eventData.apiToken.environment;
        this.project = eventData.apiToken.project;
    }
}
exports.ApiTokenCreatedEvent = ApiTokenCreatedEvent;
class ApiTokenDeletedEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData) {
        super(exports.API_TOKEN_DELETED, eventData.createdBy);
        this.preData = eventData.apiToken;
        this.environment = eventData.apiToken.environment;
        this.project = eventData.apiToken.project;
    }
}
exports.ApiTokenDeletedEvent = ApiTokenDeletedEvent;
class ApiTokenUpdatedEvent extends BaseEvent {
    /**
     * @param createdBy accepts a string for backward compatibility. Prefer using IUser for standardization
     */
    constructor(eventData) {
        super(exports.API_TOKEN_UPDATED, eventData.createdBy);
        this.preData = eventData.previousToken;
        this.data = eventData.apiToken;
        this.environment = eventData.apiToken.environment;
        this.project = eventData.apiToken.project;
    }
}
exports.ApiTokenUpdatedEvent = ApiTokenUpdatedEvent;
class PotentiallyStaleOnEvent extends BaseEvent {
    constructor(eventData) {
        super(exports.FEATURE_POTENTIALLY_STALE_ON, 'unleash-system', eventData.tags);
        this.featureName = eventData.featureName;
        this.project = eventData.project;
    }
}
exports.PotentiallyStaleOnEvent = PotentiallyStaleOnEvent;
//# sourceMappingURL=events.js.map