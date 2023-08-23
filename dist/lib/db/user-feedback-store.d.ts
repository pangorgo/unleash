/// <reference types="node" />
import { EventEmitter } from 'events';
import { LogProvider } from '../logger';
import { IUserFeedback, IUserFeedbackKey, IUserFeedbackStore } from '../types/stores/user-feedback-store';
import { Db } from './db';
export default class UserFeedbackStore implements IUserFeedbackStore {
    private db;
    private logger;
    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider);
    getAllUserFeedback(userId: number): Promise<IUserFeedback[]>;
    getFeedback(userId: number, feedbackId: string): Promise<IUserFeedback>;
    updateFeedback(feedback: IUserFeedback): Promise<IUserFeedback>;
    delete({ userId, feedbackId }: IUserFeedbackKey): Promise<void>;
    deleteAll(): Promise<void>;
    destroy(): void;
    exists({ userId, feedbackId }: IUserFeedbackKey): Promise<boolean>;
    get({ userId, feedbackId, }: IUserFeedbackKey): Promise<IUserFeedback>;
    getAll(): Promise<IUserFeedback[]>;
}
