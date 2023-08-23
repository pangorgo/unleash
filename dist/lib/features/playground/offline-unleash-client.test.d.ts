import { ClientInitOptions } from './offline-unleash-client';
import { Unleash as UnleashClientNode } from 'unleash-client';
export declare const offlineUnleashClientNode: ({ features, context, logError, segments, }: ClientInitOptions) => Promise<UnleashClientNode>;
