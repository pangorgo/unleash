"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureEventFormatterMd = exports.LinkStyle = void 0;
const types_1 = require("../types");
var LinkStyle;
(function (LinkStyle) {
    LinkStyle[LinkStyle["SLACK"] = 0] = "SLACK";
    LinkStyle[LinkStyle["MD"] = 1] = "MD";
})(LinkStyle = exports.LinkStyle || (exports.LinkStyle = {}));
class FeatureEventFormatterMd {
    constructor(unleashUrl, linkStyle = LinkStyle.MD) {
        this.unleashUrl = unleashUrl;
        this.linkStyle = linkStyle;
    }
    generateArchivedText(event) {
        const { createdBy, type } = event;
        const action = type === types_1.FEATURE_ARCHIVED ? 'archived' : 'revived';
        const feature = this.generateFeatureLink(event);
        return ` ${createdBy} just ${action} feature toggle *${feature}*`;
    }
    generateFeatureLink(event) {
        if (this.linkStyle === LinkStyle.SLACK) {
            return `<${this.featureLink(event)}|${event.featureName}>`;
        }
        else {
            return `[${event.featureName}](${this.featureLink(event)})`;
        }
    }
    generateStaleText(event) {
        const { createdBy, type } = event;
        const isStale = type === types_1.FEATURE_STALE_ON;
        const feature = this.generateFeatureLink(event);
        if (isStale) {
            return `${createdBy} marked ${feature}  as stale and this feature toggle is now *ready to be removed* from the code.`;
        }
        return `${createdBy} removed the stale marking on *${feature}*.`;
    }
    generateEnvironmentToggleText(event) {
        const { createdBy, environment, type, project } = event;
        const toggleStatus = type === types_1.FEATURE_ENVIRONMENT_ENABLED ? 'enabled' : 'disabled';
        const feature = this.generateFeatureLink(event);
        return `${createdBy} *${toggleStatus}* ${feature} in *${environment}* environment in project *${project}*`;
    }
    generateStrategyChangeText(event) {
        const { createdBy, environment, project, data, preData } = event;
        const feature = this.generateFeatureLink(event);
        const strategyText = () => {
            switch (data.name) {
                case 'flexibleRollout':
                    return this.flexibleRolloutStrategyChangeText(preData, data, environment);
                case 'default':
                    return this.defaultStrategyChangeText(preData, data, environment);
                case 'userWithId':
                    return this.userWithIdStrategyChangeText(preData, data, environment);
                case 'remoteAddress':
                    return this.remoteAddressStrategyChangeText(preData, data, environment);
                case 'applicationHostname':
                    return this.applicationHostnameStrategyChangeText(preData, data, environment);
                default:
                    return `by updating strategy ${data?.name} in *${environment}*`;
            }
        };
        return `${createdBy} updated *${feature}* in project *${project}* ${strategyText()}`;
    }
    applicationHostnameStrategyChangeText(preData, data, environment) {
        return this.listOfValuesStrategyChangeText(preData, data, environment, 'hostNames');
    }
    remoteAddressStrategyChangeText(preData, data, environment) {
        return this.listOfValuesStrategyChangeText(preData, data, environment, 'IPs');
    }
    userWithIdStrategyChangeText(preData, data, environment) {
        return this.listOfValuesStrategyChangeText(preData, data, environment, 'userIds');
    }
    listOfValuesStrategyChangeText(preData, data, environment, propertyName) {
        const userIdText = (values) => values.length === 0
            ? `empty set of ${propertyName}`
            : `[${values}]`;
        const usersText = preData.parameters[propertyName] === data.parameters[propertyName]
            ? ''
            : ` ${propertyName} from ${userIdText(preData.parameters[propertyName])} to ${userIdText(data.parameters[propertyName])}`;
        const constraintText = this.constraintChangeText(preData.constraints, data.constraints);
        const strategySpecificText = [usersText, constraintText]
            .filter((x) => x.length)
            .join(';');
        return `by updating strategy ${data?.name} in *${environment}*${strategySpecificText}`;
    }
    flexibleRolloutStrategyChangeText(preData, data, environment) {
        const { rollout: oldRollout, stickiness: oldStickiness, groupId: oldGroupId, } = preData.parameters;
        const { rollout, stickiness, groupId } = data.parameters;
        const stickinessText = oldStickiness === stickiness
            ? ''
            : ` stickiness from ${oldStickiness} to ${stickiness}`;
        const rolloutText = oldRollout === rollout
            ? ''
            : ` rollout from ${oldRollout}% to ${rollout}%`;
        const groupIdText = oldGroupId === groupId
            ? ''
            : ` groupId from ${oldGroupId} to ${groupId}`;
        const constraintText = this.constraintChangeText(preData.constraints, data.constraints);
        const strategySpecificText = [
            stickinessText,
            rolloutText,
            groupIdText,
            constraintText,
        ]
            .filter((txt) => txt.length)
            .join(';');
        return `by updating strategy ${data?.name} in *${environment}*${strategySpecificText}`;
    }
    defaultStrategyChangeText(preData, data, environment) {
        return `by updating strategy ${data?.name} in *${environment}*${this.constraintChangeText(preData.constraints, data.constraints)}`;
    }
    constraintChangeText(oldConstraints, newConstraints) {
        const formatConstraints = (constraints) => {
            const constraintOperatorDescriptions = {
                IN: 'is one of',
                NOT_IN: 'is not one of',
                STR_CONTAINS: 'is a string that contains',
                STR_STARTS_WITH: 'is a string that starts with',
                STR_ENDS_WITH: 'is a string that ends with',
                NUM_EQ: 'is a number equal to',
                NUM_GT: 'is a number greater than',
                NUM_GTE: 'is a number greater than or equal to',
                NUM_LT: 'is a number less than',
                NUM_LTE: 'is a number less than or equal to',
                DATE_BEFORE: 'is a date before',
                DATE_AFTER: 'is a date after',
                SEMVER_EQ: 'is a SemVer equal to',
                SEMVER_GT: 'is a SemVer greater than',
                SEMVER_LT: 'is a SemVer less than',
            };
            const formatConstraint = (constraint) => {
                const val = constraint.hasOwnProperty('value')
                    ? constraint.value
                    : `(${constraint.values.join(',')})`;
                const operator = constraintOperatorDescriptions.hasOwnProperty(constraint.operator)
                    ? constraintOperatorDescriptions[constraint.operator]
                    : constraint.operator;
                return `${constraint.contextName} ${constraint.inverted ? 'not ' : ''}${operator} ${val}`;
            };
            return constraints.length === 0
                ? 'empty set of constraints'
                : `[${constraints.map(formatConstraint).join(', ')}]`;
        };
        const oldConstraintText = formatConstraints(oldConstraints);
        const newConstraintText = formatConstraints(newConstraints);
        return oldConstraintText === newConstraintText
            ? ''
            : ` constraints from ${oldConstraintText} to ${newConstraintText}`;
    }
    generateStrategyRemoveText(event) {
        const { createdBy, environment, project, preData } = event;
        const feature = this.generateFeatureLink(event);
        return `${createdBy} updated *${feature}* in project *${project}* by removing strategy ${preData?.name} in *${environment}*`;
    }
    generateStrategyAddText(event) {
        const { createdBy, environment, project, data } = event;
        const feature = this.generateFeatureLink(event);
        return `${createdBy} updated *${feature}* in project *${project}* by adding strategy ${data?.name} in *${environment}*`;
    }
    generateMetadataText(event) {
        const { createdBy, project } = event;
        const feature = this.generateFeatureLink(event);
        return `${createdBy} updated the metadata for ${feature} in project *${project}*`;
    }
    generateProjectChangeText(event) {
        const { createdBy, project, featureName } = event;
        return `${createdBy} moved ${featureName} to ${project}`;
    }
    generateFeaturePotentiallyStaleOnText(event) {
        const { project, createdBy } = event;
        const feature = this.generateFeatureLink(event);
        return `${createdBy} marked feature toggle *${feature}* (in project *${project}*) as *potentially stale*.`;
    }
    featureLink(event) {
        const { type, project = '', featureName } = event;
        if (type === types_1.FEATURE_ARCHIVED) {
            if (project) {
                return `${this.unleashUrl}/projects/${project}/archive`;
            }
            return `${this.unleashUrl}/archive`;
        }
        return `${this.unleashUrl}/projects/${project}/features/${featureName}`;
    }
    getAction(type) {
        switch (type) {
            case types_1.FEATURE_CREATED:
                return 'created';
            case types_1.FEATURE_UPDATED:
                return 'updated';
            case types_1.FEATURE_VARIANTS_UPDATED:
                return 'updated variants for';
            default:
                return type;
        }
    }
    defaultText(event) {
        const { createdBy, project, type } = event;
        const action = this.getAction(type);
        const feature = this.generateFeatureLink(event);
        return `${createdBy} ${action} feature toggle ${feature} in project *${project}*`;
    }
    format(event) {
        switch (event.type) {
            case types_1.FEATURE_ARCHIVED:
            case types_1.FEATURE_REVIVED:
                return this.generateArchivedText(event);
            case types_1.FEATURE_STALE_ON:
            case types_1.FEATURE_STALE_OFF:
                return this.generateStaleText(event);
            case types_1.FEATURE_ENVIRONMENT_DISABLED:
            case types_1.FEATURE_ENVIRONMENT_ENABLED:
                return this.generateEnvironmentToggleText(event);
            case types_1.FEATURE_STRATEGY_REMOVE:
                return this.generateStrategyRemoveText(event);
            case types_1.FEATURE_STRATEGY_ADD:
                return this.generateStrategyAddText(event);
            case types_1.FEATURE_STRATEGY_UPDATE:
                return this.generateStrategyChangeText(event);
            case types_1.FEATURE_METADATA_UPDATED:
                return this.generateMetadataText(event);
            case types_1.FEATURE_PROJECT_CHANGE:
                return this.generateProjectChangeText(event);
            case types_1.FEATURE_POTENTIALLY_STALE_ON:
                return this.generateFeaturePotentiallyStaleOnText(event);
            default:
                return this.defaultText(event);
        }
    }
}
exports.FeatureEventFormatterMd = FeatureEventFormatterMd;
//# sourceMappingURL=feature-event-formatter-md.js.map