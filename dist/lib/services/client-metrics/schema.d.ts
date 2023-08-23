import joi from 'joi';
import { IMetricsBucket } from 'lib/types';
export declare type ValidatedClientMetrics = {
    environment?: string;
    appName: string;
    instanceId: string;
    bucket: IMetricsBucket;
};
export declare const clientMetricsSchema: joi.ObjectSchema<ValidatedClientMetrics>;
export declare const clientMetricsEnvSchema: joi.ObjectSchema<any>;
export declare const clientMetricsEnvBulkSchema: joi.ArraySchema<any[]>;
export declare const applicationSchema: joi.ObjectSchema<any>;
export declare const batchMetricsSchema: joi.ObjectSchema<any>;
export declare const clientRegisterSchema: joi.ObjectSchema<any>;
