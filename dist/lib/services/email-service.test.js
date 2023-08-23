"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_service_1 = require("./email-service");
const no_logger_1 = __importDefault(require("../../test/fixtures/no-logger"));
test('Can send reset email', async () => {
    const emailService = new email_service_1.EmailService({
        host: 'test',
        port: 587,
        secure: false,
        smtpuser: '',
        smtppass: '',
        sender: 'noreply@getunleash.ai',
    }, no_logger_1.default);
    const resetLinkUrl = 'https://unleash-hosted.com/reset-password?token=$2b$10$M06Ysso6KL4ueH/xR6rdSuY5GSymdIwmIkEUJMRkB.Qn26r5Gi5vW';
    const content = await emailService.sendResetMail('Some username', 'test@resetLinkUrl.com', resetLinkUrl);
    expect(content.from).toBe('noreply@getunleash.ai');
    expect(content.subject).toBe('Unleash - Reset your password');
    expect(content.html.includes(resetLinkUrl)).toBe(true);
    expect(content.text.includes(resetLinkUrl)).toBe(true);
});
test('Can send welcome mail', async () => {
    const emailService = new email_service_1.EmailService({
        host: 'test',
        port: 9999,
        secure: false,
        sender: 'noreply@getunleash.ai',
        smtpuser: '',
        smtppass: '',
    }, no_logger_1.default);
    const content = await emailService.sendGettingStartedMail('Some username', 'test@test.com', 'abc123456');
    expect(content.from).toBe('noreply@getunleash.ai');
    expect(content.subject).toBe('Welcome to Unleash');
});
test('Can supply additional SMTP transport options', async () => {
    const spy = jest.spyOn(nodemailer_1.default, 'createTransport');
    new email_service_1.EmailService({
        host: 'smtp.unleash.test',
        port: 9999,
        secure: false,
        sender: 'noreply@getunleash.ai',
        transportOptions: {
            tls: {
                rejectUnauthorized: true,
            },
        },
    }, no_logger_1.default);
    expect(spy).toHaveBeenCalledWith({
        auth: {
            user: '',
            pass: '',
        },
        host: 'smtp.unleash.test',
        port: 9999,
        secure: false,
        tls: {
            rejectUnauthorized: true,
        },
    });
});
test('should strip special characters from email subject', async () => {
    const emailService = new email_service_1.EmailService({
        host: 'test',
        port: 9999,
        secure: false,
        sender: 'noreply@getunleash.ai',
        smtpuser: '',
        smtppass: '',
    }, no_logger_1.default);
    expect(emailService.stripSpecialCharacters('http://evil.com')).toBe('httpevilcom');
    expect(emailService.stripSpecialCharacters('http://ööbik.com')).toBe('httpööbikcom');
    expect(emailService.stripSpecialCharacters('tom-jones')).toBe('tom-jones');
});
//# sourceMappingURL=email-service.test.js.map