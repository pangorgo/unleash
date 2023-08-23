import { IChangeRequestAccessReadModel } from './change-request-access-read-model';
export declare class FakeChangeRequestAccessReadModel implements IChangeRequestAccessReadModel {
    private canBypass;
    private isChangeRequestEnabled;
    constructor(canBypass?: boolean, isChangeRequestEnabled?: boolean);
    canBypassChangeRequest(): Promise<boolean>;
    canBypassChangeRequestForProject(): Promise<boolean>;
    isChangeRequestsEnabled(): Promise<boolean>;
    isChangeRequestsEnabledForProject(): Promise<boolean>;
}
