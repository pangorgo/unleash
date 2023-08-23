import { Db, IUnleashConfig } from 'lib/server-impl';
import { SegmentService } from '../../services';
import { ISegmentService } from '../../segments/segment-service-interface';
export declare const createSegmentService: (db: Db, config: IUnleashConfig) => SegmentService;
export declare const createFakeSegmentService: (config: IUnleashConfig) => ISegmentService;
