import { ITestDb } from '../helpers/database-init';
import { FeatureToggle } from '../../../lib/types/model';
import { ClientFeatureSchema } from 'lib/openapi/spec/client-feature-schema';
import { SegmentSchema } from 'lib/openapi/spec/segment-schema';
export declare const seedDatabaseForPlaygroundTest: (database: ITestDb, features: ClientFeatureSchema[], environment: string, segments?: SegmentSchema[]) => Promise<FeatureToggle[]>;
