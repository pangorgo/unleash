"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = exports.MAIL_ACCEPTED = exports.TransporterType = exports.TemplateFormat = void 0;
const nodemailer_1 = require("nodemailer");
const mustache_1 = __importDefault(require("mustache"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
var TemplateFormat;
(function (TemplateFormat) {
    TemplateFormat["HTML"] = "html";
    TemplateFormat["PLAIN"] = "plain";
})(TemplateFormat = exports.TemplateFormat || (exports.TemplateFormat = {}));
var TransporterType;
(function (TransporterType) {
    TransporterType["SMTP"] = "smtp";
    TransporterType["JSON"] = "json";
})(TransporterType = exports.TransporterType || (exports.TransporterType = {}));
const RESET_MAIL_SUBJECT = 'Unleash - Reset your password';
const GETTING_STARTED_SUBJECT = 'Welcome to Unleash';
exports.MAIL_ACCEPTED = '250 Accepted';
class EmailService {
    constructor(email, getLogger) {
        this.logger = getLogger('services/email-service.ts');
        if (email && email.host) {
            this.sender = email.sender;
            if (email.host === 'test') {
                this.mailer = (0, nodemailer_1.createTransport)({ jsonTransport: true });
            }
            else {
                this.mailer = (0, nodemailer_1.createTransport)({
                    host: email.host,
                    port: email.port,
                    secure: email.secure,
                    auth: {
                        user: email.smtpuser ?? '',
                        pass: email.smtppass ?? '',
                    },
                    ...email.transportOptions,
                });
            }
            this.logger.info(`Initialized transport to ${email.host} on port ${email.port} with user: ${email.smtpuser}`);
        }
        else {
            this.sender = 'not-configured';
            this.mailer = undefined;
        }
    }
    async sendResetMail(name, recipient, resetLink) {
        if (this.configured()) {
            const year = new Date().getFullYear();
            const bodyHtml = await this.compileTemplate('reset-password', TemplateFormat.HTML, {
                resetLink,
                name,
                year,
            });
            const bodyText = await this.compileTemplate('reset-password', TemplateFormat.PLAIN, {
                resetLink,
                name,
                year,
            });
            const email = {
                from: this.sender,
                to: recipient,
                subject: RESET_MAIL_SUBJECT,
                html: bodyHtml,
                text: bodyText,
            };
            process.nextTick(() => {
                this.mailer.sendMail(email).then(() => this.logger.info('Successfully sent reset-password email'), (e) => this.logger.warn('Failed to send reset-password email', e));
            });
            return Promise.resolve(email);
        }
        return new Promise((res) => {
            this.logger.warn('No mailer is configured. Please read the docs on how to configure an emailservice');
            this.logger.debug('Reset link: ', resetLink);
            res({
                from: this.sender,
                to: recipient,
                subject: RESET_MAIL_SUBJECT,
                html: '',
                text: '',
            });
        });
    }
    async sendGettingStartedMail(name, recipient, unleashUrl, passwordLink) {
        if (this.configured()) {
            const year = new Date().getFullYear();
            const context = {
                passwordLink,
                name: this.stripSpecialCharacters(name),
                year,
                unleashUrl,
            };
            const bodyHtml = await this.compileTemplate('getting-started', TemplateFormat.HTML, context);
            const bodyText = await this.compileTemplate('getting-started', TemplateFormat.PLAIN, context);
            const email = {
                from: this.sender,
                to: recipient,
                subject: GETTING_STARTED_SUBJECT,
                html: bodyHtml,
                text: bodyText,
            };
            process.nextTick(() => {
                this.mailer.sendMail(email).then(() => this.logger.info('Successfully sent getting started email'), (e) => this.logger.warn('Failed to send getting started email', e));
            });
            return Promise.resolve(email);
        }
        return new Promise((res) => {
            this.logger.warn('No mailer is configured. Please read the docs on how to configure an EmailService');
            res({
                from: this.sender,
                to: recipient,
                subject: GETTING_STARTED_SUBJECT,
                html: '',
                text: '',
            });
        });
    }
    isEnabled() {
        return this.mailer !== undefined;
    }
    async compileTemplate(templateName, format, context) {
        try {
            const template = this.resolveTemplate(templateName, format);
            return await Promise.resolve(mustache_1.default.render(template, context));
        }
        catch (e) {
            this.logger.info(`Could not find template ${templateName}`);
            return Promise.reject(e);
        }
    }
    resolveTemplate(templateName, format) {
        const topPath = path_1.default.resolve(__dirname, '../../mailtemplates');
        const template = path_1.default.join(topPath, templateName, `${templateName}.${format}.mustache`);
        if ((0, fs_1.existsSync)(template)) {
            return (0, fs_1.readFileSync)(template, 'utf-8');
        }
        throw new notfound_error_1.default('Could not find template');
    }
    configured() {
        return this.sender !== 'not-configured' && this.mailer !== undefined;
    }
    stripSpecialCharacters(str) {
        return str?.replace(/[`~!@#$%^&*()_|+=?;:'",.<>{}[\]\\/]/gi, '');
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=email-service.js.map