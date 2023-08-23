"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helmet_1 = __importDefault(require("helmet"));
const date_fns_1 = require("date-fns");
const secureHeaders = (config) => {
    if (config.secureHeaders) {
        return (0, helmet_1.default)({
            hsts: {
                maxAge: (0, date_fns_1.hoursToSeconds)(24 * 365 * 2),
                includeSubDomains: true,
                preload: true,
            },
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: [
                        "'self'",
                        'cdn.getunleash.io',
                        'gravatar.com',
                        ...config.additionalCspAllowedDomains.defaultSrc,
                    ],
                    fontSrc: [
                        "'self'",
                        'cdn.getunleash.io',
                        'fonts.googleapis.com',
                        'fonts.gstatic.com',
                        ...config.additionalCspAllowedDomains.fontSrc,
                    ],
                    styleSrc: [
                        "'self'",
                        "'unsafe-inline'",
                        'cdn.getunleash.io',
                        'fonts.googleapis.com',
                        'fonts.gstatic.com',
                        'data:',
                        ...config.additionalCspAllowedDomains.styleSrc,
                    ],
                    scriptSrc: [
                        "'self'",
                        'cdn.getunleash.io',
                        ...config.additionalCspAllowedDomains.scriptSrc,
                    ],
                    imgSrc: [
                        "'self'",
                        'data:',
                        'cdn.getunleash.io',
                        'gravatar.com',
                        ...config.additionalCspAllowedDomains.imgSrc,
                    ],
                    connectSrc: [
                        "'self'",
                        'cdn.getunleash.io',
                        'plausible.getunleash.io',
                        'gravatar.com',
                        'europe-west3-metrics-304612.cloudfunctions.net',
                        ...config.additionalCspAllowedDomains.connectSrc,
                    ],
                },
            },
            crossOriginEmbedderPolicy: false,
        });
    }
    return (req, res, next) => {
        next();
    };
};
exports.default = secureHeaders;
//# sourceMappingURL=secure-headers.js.map