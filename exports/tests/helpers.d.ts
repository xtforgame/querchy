import { ResourceMerger, QcBasicAction } from '../index';
import { ActionInfosT1, QueryInfosT1 } from '../templates/builtin-t1';
export declare const resMerger: ResourceMerger<QcBasicAction>;
export declare const resMergerForColl: ResourceMerger<QcBasicAction>;
export declare const getBasicQueryInfos: () => QueryInfosT1;
export declare const getBasicActionInfos: () => ActionInfosT1;
