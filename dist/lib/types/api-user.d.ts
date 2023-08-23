import { ApiTokenType } from './models/api-token';
interface IApiUserData {
    permissions?: string[];
    projects?: string[];
    project?: string;
    environment: string;
    type: ApiTokenType;
    secret: string;
    tokenName: string;
}
export default class ApiUser {
    readonly isAPI: boolean;
    readonly permissions: string[];
    readonly projects: string[];
    readonly environment: string;
    readonly type: ApiTokenType;
    readonly secret: string;
    constructor({ permissions, projects, project, environment, type, secret, tokenName, }: IApiUserData);
}
export {};
