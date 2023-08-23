"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const is_email_1 = __importDefault(require("./is-email"));
test.each([
    'jessie34@claritymail.net',
    'brianne33@sparkmail.com',
    'kevin98@brightmail.org',
    'sophia22@crestmail.com',
    'zachary55@horizonmail.net',
    'giselle89@fogmail.org',
    'david23@peakmail.net',
    'maria77@apexmail.com',
    'jacob66@skywardmail.org',
    'kylie44@oceanmail.net',
    'user1.email@testmail.com',
    'email2-user@example.org',
    '3test_email@example.net',
    'myemail+4@example.com',
    'em5a.il@example.net',
    'user#6@example.org',
    '_email7@example.com',
    'email-8@example.net',
    'test.email-9@example.com',
    'email10@test-mail.net',
])(`should validate email address %s`, (email) => {
    expect((0, is_email_1.default)(email)).toBe(true);
});
test.each([
    'myemail@.com',
    'email123@com',
    '@gmail.com',
    'email123@.com',
    'email123@domain.',
    'email@-domain.com',
    'email@domain.c',
    'email@.domain.com',
    'notanemail',
    'missing@symbol',
    '@missingusername.com',
    'invalid.email@missingtld',
    '.missingusername@missingtld',
    'invalid.username@missingtld.',
    'invalid.email@-invalid-domain.com',
    'invalid.email@missingtld.',
])(`should validate email address %s`, (email) => {
    expect((0, is_email_1.default)(email)).toBe(false);
});
//# sourceMappingURL=is-email.test.js.map