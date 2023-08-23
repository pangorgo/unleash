"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddons = void 0;
const webhook_1 = __importDefault(require("./webhook"));
const slack_1 = __importDefault(require("./slack"));
const teams_1 = __importDefault(require("./teams"));
const datadog_1 = __importDefault(require("./datadog"));
const slack_app_1 = __importDefault(require("./slack-app"));
const getAddons = ({ getLogger, unleashUrl, flagResolver }) => {
    const slackAppAddonEnabled = flagResolver.isEnabled('slackAppAddon');
    const slackAddon = new slack_1.default({ getLogger, unleashUrl });
    if (slackAppAddonEnabled) {
        slackAddon.definition.deprecated =
            'This addon is deprecated. Please try the new Slack App addon instead.';
    }
    const addons = [
        new webhook_1.default({ getLogger }),
        slackAddon,
        new teams_1.default({ getLogger, unleashUrl }),
        new datadog_1.default({ getLogger, unleashUrl }),
    ];
    if (slackAppAddonEnabled) {
        addons.push(new slack_app_1.default({ getLogger, unleashUrl }));
    }
    return addons.reduce((map, addon) => {
        // eslint-disable-next-line no-param-reassign
        map[addon.name] = addon;
        return map;
    }, {});
};
exports.getAddons = getAddons;
//# sourceMappingURL=index.js.map