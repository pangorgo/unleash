import { LogProvider } from '../logger';
import { IEmailOption } from '../types/option';
export interface IAuthOptions {
    user: string;
    pass: string;
}
export declare enum TemplateFormat {
    HTML = "html",
    PLAIN = "plain"
}
export declare enum TransporterType {
    SMTP = "smtp",
    JSON = "json"
}
export interface IEmailEnvelope {
    from: string;
    to: string;
    subject: string;
    html: string;
    text: string;
}
export declare const MAIL_ACCEPTED = "250 Accepted";
export declare class EmailService {
    private logger;
    private readonly mailer?;
    private readonly sender;
    constructor(email: IEmailOption, getLogger: LogProvider);
    sendResetMail(name: string, recipient: string, resetLink: string): Promise<IEmailEnvelope>;
    sendGettingStartedMail(name: string, recipient: string, unleashUrl: string, passwordLink?: string): Promise<IEmailEnvelope>;
    isEnabled(): boolean;
    compileTemplate(templateName: string, format: TemplateFormat, context: unknown): Promise<string>;
    private resolveTemplate;
    configured(): boolean;
    stripSpecialCharacters(str: string): string;
}
