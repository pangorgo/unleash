import { FromSchema } from 'json-schema-to-ts';
export declare const searchEventsSchema: {
    readonly $id: "#/components/schemas/searchEventsSchema";
    readonly type: "object";
    readonly description: "\n        Search for events by type, project, feature, free-text query,\n        or a combination thereof. Pass an empty object to fetch all events.\n    ";
    readonly properties: {
        readonly type: {
            readonly type: "string";
            readonly description: "Find events by event type (case-sensitive).";
            readonly enum: readonly ["application-created", "feature-created", "feature-deleted", "feature-updated", "feature-metadata-updated", "feature-variants-updated", "feature-environment-variants-updated", "feature-project-change", "feature-archived", "feature-revived", "feature-import", "feature-tagged", "feature-tag-import", "feature-strategy-update", "feature-strategy-add", "feature-strategy-remove", "strategy-order-changed", "drop-feature-tags", "feature-untagged", "feature-stale-on", "feature-stale-off", "drop-features", "feature-environment-enabled", "feature-environment-disabled", "strategy-created", "strategy-deleted", "strategy-deprecated", "strategy-reactivated", "strategy-updated", "strategy-import", "drop-strategies", "context-field-created", "context-field-updated", "context-field-deleted", "project-access-added", "project-created", "project-updated", "project-deleted", "project-import", "project-user-added", "project-user-removed", "project-user-role-changed", "project-group-role-changed", "project-group-added", "project-group-removed", "drop-projects", "tag-created", "tag-deleted", "tag-import", "drop-tags", "tag-type-created", "tag-type-deleted", "tag-type-updated", "tag-type-import", "drop-tag-types", "addon-config-created", "addon-config-updated", "addon-config-deleted", "db-pool-update", "user-created", "user-updated", "user-deleted", "drop-environments", "environment-import", "segment-created", "segment-updated", "segment-deleted", "group-created", "group-updated", "setting-created", "setting-updated", "setting-deleted", "client-metrics", "client-register", "pat-created", "pat-deleted", "public-signup-token-created", "public-signup-token-user-added", "public-signup-token-updated", "change-request-created", "change-request-discarded", "change-added", "change-discarded", "change-edited", "change-request-rejected", "change-request-approved", "change-request-approval-added", "change-request-cancelled", "change-request-sent-to-review", "change-request-applied", "api-token-created", "api-token-updated", "api-token-deleted", "feature-favorited", "feature-unfavorited", "project-favorited", "project-unfavorited", "features-exported", "features-imported", "service-account-created", "service-account-deleted", "service-account-updated", "feature-potentially-stale-on"];
            readonly example: "feature-created";
        };
        readonly project: {
            readonly type: "string";
            readonly description: "Find events by project ID (case-sensitive).";
            readonly example: "default";
        };
        readonly feature: {
            readonly type: "string";
            readonly description: "Find events by feature toggle name (case-sensitive).";
            readonly example: "my.first.toggle";
        };
        readonly query: {
            readonly type: "string";
            readonly description: "Find events by a free-text search query. The query will be matched against the event type, the username or email that created the event (if any), and the event data payload (if any).";
            readonly example: "admin@example.com";
        };
        readonly limit: {
            readonly type: "integer";
            readonly description: "The maximum amount of events to return in the search result";
            readonly minimum: 1;
            readonly maximum: 100;
            readonly default: 100;
            readonly example: 50;
        };
        readonly offset: {
            readonly description: "Which event id to start listing from";
            readonly type: "integer";
            readonly minimum: 0;
            readonly default: 0;
            readonly example: 100;
        };
    };
    readonly components: {};
};
export declare type SearchEventsSchema = FromSchema<typeof searchEventsSchema>;
