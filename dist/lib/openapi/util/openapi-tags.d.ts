declare const OPENAPI_TAGS: readonly [{
    readonly name: "Addons";
    readonly description: "Create, update, and delete [Unleash addons](https://docs.getunleash.io/addons).";
}, {
    readonly name: "Admin UI";
    readonly description: "Configuration for the Unleash Admin UI. These endpoints should not be relied upon and can change at any point without prior notice.";
}, {
    readonly name: "API tokens";
    readonly description: "Create, update, and delete [Unleash API tokens](https://docs.getunleash.io/reference/api-tokens-and-client-keys).";
}, {
    readonly name: "Personal access tokens";
    readonly description: "Create, update, and delete [Personal access tokens](https://docs.getunleash.io/reference/api-tokens-and-client-keys#personal-access-tokens).";
}, {
    readonly name: "Service Accounts";
    readonly description: "Endpoints for managing [Service Accounts](https://docs.getunleash.io/reference/service-accounts), which enable programmatic access to the Unleash API.";
}, {
    readonly name: "Archive";
    readonly description: "Revive or permanently delete [archived feature toggles](https://docs.getunleash.io/advanced/archived_toggles).";
}, {
    readonly name: "Auth";
    readonly description: "Manage logins, passwords, etc.";
}, {
    readonly name: "Change Requests";
    readonly description: "Operations related to [Change Requests](https://docs.getunleash.io/reference/change-requests).";
}, {
    readonly name: "Client";
    readonly description: "Endpoints for [Unleash server-side clients](https://docs.getunleash.io/reference/sdks).";
}, {
    readonly name: "Context";
    readonly description: "Create, update, and delete [context fields](https://docs.getunleash.io/reference/unleash-context) that Unleash is aware of.";
}, {
    readonly name: "Environments";
    readonly description: "Create, update, delete, enable or disable [environments](https://docs.getunleash.io/reference/environments) for this Unleash instance.";
}, {
    readonly name: "Events";
    readonly description: "Read events from this Unleash instance.";
}, {
    readonly name: "Features";
    readonly description: "Create, update, and delete [features toggles](https://docs.getunleash.io/reference/feature-toggles).";
}, {
    readonly name: "Feature Types";
    readonly description: "Manage [feature toggle types](https://docs.getunleash.io/reference/feature-toggle-types).";
}, {
    readonly name: "Import/Export";
    readonly description: "[Import and export](https://docs.getunleash.io/deploy/import_export) the state of your Unleash instance.";
}, {
    readonly name: "Instance Admin";
    readonly description: "Instance admin endpoints used to manage the Unleash instance itself.";
}, {
    readonly name: "Metrics";
    readonly description: "Register, read, or delete metrics recorded by Unleash.";
}, {
    readonly name: "Notifications";
    readonly description: "Manage [notifications](https://docs.getunleash.io/reference/notifications).";
}, {
    readonly name: "Operational";
    readonly description: "Endpoints related to the operational status of this Unleash instance.";
}, {
    readonly name: "Playground";
    readonly description: "Evaluate an Unleash context against your feature toggles.";
}, {
    readonly name: "Projects";
    readonly description: "Create, update, and delete [Unleash projects](https://docs.getunleash.io/reference/projects).";
}, {
    readonly name: "Public signup tokens";
    readonly description: "Create, update, and delete [Unleash Public Signup tokens](https://docs.getunleash.io/reference/public-signup-tokens).";
}, {
    readonly name: "Segments";
    readonly description: "Create, update, delete, and manage [segments](https://docs.getunleash.io/reference/segments).";
}, {
    readonly name: "Strategies";
    readonly description: "Create, update, delete, manage [custom strategies](https://docs.getunleash.io/reference/custom-activation-strategies).";
}, {
    readonly name: "Tags";
    readonly description: "Create, update, and delete [tags and tag types](https://docs.getunleash.io/reference/tags).";
}, {
    readonly name: "Users";
    readonly description: "Manage users and passwords.";
}, {
    readonly name: "Unstable";
    readonly description: "Experimental endpoints that may change or disappear at any time.";
}, {
    readonly name: "Edge";
    readonly description: "Endpoints related to Unleash on the Edge.";
}, {
    readonly name: "Frontend API";
    readonly description: "API for connecting client-side (frontend) applications to Unleash.";
}, {
    readonly name: "Maintenance";
    readonly description: "Enable/disable the maintenance mode of Unleash.";
}, {
    readonly name: "Change Requests";
    readonly description: "API for managing [change requests](https://docs.getunleash.io/reference/change-requests).";
}, {
    readonly name: "Telemetry";
    readonly description: "API for information about telemetry collection";
}, {
    readonly name: "Notifications";
    readonly description: "API for managing [notifications](https://docs.getunleash.io/reference/notifications).";
}];
export declare const openApiTags: ({
    readonly name: "Addons";
    readonly description: "Create, update, and delete [Unleash addons](https://docs.getunleash.io/addons).";
} | {
    readonly name: "Admin UI";
    readonly description: "Configuration for the Unleash Admin UI. These endpoints should not be relied upon and can change at any point without prior notice.";
} | {
    readonly name: "API tokens";
    readonly description: "Create, update, and delete [Unleash API tokens](https://docs.getunleash.io/reference/api-tokens-and-client-keys).";
} | {
    readonly name: "Personal access tokens";
    readonly description: "Create, update, and delete [Personal access tokens](https://docs.getunleash.io/reference/api-tokens-and-client-keys#personal-access-tokens).";
} | {
    readonly name: "Service Accounts";
    readonly description: "Endpoints for managing [Service Accounts](https://docs.getunleash.io/reference/service-accounts), which enable programmatic access to the Unleash API.";
} | {
    readonly name: "Archive";
    readonly description: "Revive or permanently delete [archived feature toggles](https://docs.getunleash.io/advanced/archived_toggles).";
} | {
    readonly name: "Auth";
    readonly description: "Manage logins, passwords, etc.";
} | {
    readonly name: "Change Requests";
    readonly description: "Operations related to [Change Requests](https://docs.getunleash.io/reference/change-requests).";
} | {
    readonly name: "Client";
    readonly description: "Endpoints for [Unleash server-side clients](https://docs.getunleash.io/reference/sdks).";
} | {
    readonly name: "Context";
    readonly description: "Create, update, and delete [context fields](https://docs.getunleash.io/reference/unleash-context) that Unleash is aware of.";
} | {
    readonly name: "Environments";
    readonly description: "Create, update, delete, enable or disable [environments](https://docs.getunleash.io/reference/environments) for this Unleash instance.";
} | {
    readonly name: "Events";
    readonly description: "Read events from this Unleash instance.";
} | {
    readonly name: "Features";
    readonly description: "Create, update, and delete [features toggles](https://docs.getunleash.io/reference/feature-toggles).";
} | {
    readonly name: "Feature Types";
    readonly description: "Manage [feature toggle types](https://docs.getunleash.io/reference/feature-toggle-types).";
} | {
    readonly name: "Import/Export";
    readonly description: "[Import and export](https://docs.getunleash.io/deploy/import_export) the state of your Unleash instance.";
} | {
    readonly name: "Instance Admin";
    readonly description: "Instance admin endpoints used to manage the Unleash instance itself.";
} | {
    readonly name: "Metrics";
    readonly description: "Register, read, or delete metrics recorded by Unleash.";
} | {
    readonly name: "Notifications";
    readonly description: "Manage [notifications](https://docs.getunleash.io/reference/notifications).";
} | {
    readonly name: "Operational";
    readonly description: "Endpoints related to the operational status of this Unleash instance.";
} | {
    readonly name: "Playground";
    readonly description: "Evaluate an Unleash context against your feature toggles.";
} | {
    readonly name: "Projects";
    readonly description: "Create, update, and delete [Unleash projects](https://docs.getunleash.io/reference/projects).";
} | {
    readonly name: "Public signup tokens";
    readonly description: "Create, update, and delete [Unleash Public Signup tokens](https://docs.getunleash.io/reference/public-signup-tokens).";
} | {
    readonly name: "Segments";
    readonly description: "Create, update, delete, and manage [segments](https://docs.getunleash.io/reference/segments).";
} | {
    readonly name: "Strategies";
    readonly description: "Create, update, delete, manage [custom strategies](https://docs.getunleash.io/reference/custom-activation-strategies).";
} | {
    readonly name: "Tags";
    readonly description: "Create, update, and delete [tags and tag types](https://docs.getunleash.io/reference/tags).";
} | {
    readonly name: "Users";
    readonly description: "Manage users and passwords.";
} | {
    readonly name: "Unstable";
    readonly description: "Experimental endpoints that may change or disappear at any time.";
} | {
    readonly name: "Edge";
    readonly description: "Endpoints related to Unleash on the Edge.";
} | {
    readonly name: "Frontend API";
    readonly description: "API for connecting client-side (frontend) applications to Unleash.";
} | {
    readonly name: "Maintenance";
    readonly description: "Enable/disable the maintenance mode of Unleash.";
} | {
    readonly name: "Change Requests";
    readonly description: "API for managing [change requests](https://docs.getunleash.io/reference/change-requests).";
} | {
    readonly name: "Telemetry";
    readonly description: "API for information about telemetry collection";
} | {
    readonly name: "Notifications";
    readonly description: "API for managing [notifications](https://docs.getunleash.io/reference/notifications).";
})[];
export declare type OpenApiTag = typeof OPENAPI_TAGS[number]['name'];
export {};
