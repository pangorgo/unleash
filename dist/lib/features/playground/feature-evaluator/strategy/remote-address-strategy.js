"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strategy_1 = require("./strategy");
const ip_1 = __importDefault(require("ip"));
class RemoteAddressStrategy extends strategy_1.Strategy {
    constructor() {
        super('remoteAddress');
    }
    isEnabled(parameters, context) {
        if (!parameters.IPs) {
            return false;
        }
        return parameters.IPs.split(/\s*,\s*/).some((range) => {
            if (range === context.remoteAddress) {
                return true;
            }
            if (!ip_1.default.isV6Format(range)) {
                try {
                    return ip_1.default
                        .cidrSubnet(range)
                        .contains(context.remoteAddress);
                }
                catch (err) {
                    return false;
                }
            }
            return false;
        });
    }
}
exports.default = RemoteAddressStrategy;
//# sourceMappingURL=remote-address-strategy.js.map