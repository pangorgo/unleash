export declare const AccountTypes: readonly ["User", "Service Account"];
declare type AccountType = typeof AccountTypes[number];
export interface UserData {
    id: number;
    name?: string;
    username?: string;
    email?: string;
    imageUrl?: string;
    seenAt?: Date;
    loginAttempts?: number;
    createdAt?: Date;
    isService?: boolean;
}
export interface IUser {
    id: number;
    name?: string;
    username?: string;
    email?: string;
    inviteLink?: string;
    seenAt?: Date;
    createdAt: Date;
    permissions: string[];
    loginAttempts: number;
    isAPI: boolean;
    imageUrl: string;
    accountType?: AccountType;
}
export interface IProjectUser extends IUser {
    addedAt: Date;
}
export default class User implements IUser {
    isAPI: boolean;
    id: number;
    name: string;
    username: string;
    email: string;
    permissions: string[];
    imageUrl: string;
    seenAt: Date;
    loginAttempts: number;
    createdAt: Date;
    accountType?: AccountType;
    constructor({ id, name, email, username, imageUrl, seenAt, loginAttempts, createdAt, isService, }: UserData);
    generateImageUrl(): string;
}
export {};
