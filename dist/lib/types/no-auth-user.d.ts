export default class NoAuthUser {
    isAPI: boolean;
    username: string;
    id: number;
    permissions: string[];
    constructor(username?: string, id?: number, permissions?: string[]);
}
