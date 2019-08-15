import { QcAction } from '../index';
import { MyCacher001 } from './types001';
import { MyQcStore001, Types } from './typesDef001';
export declare const crudToRestMap: {
    create: string;
    read: string;
    update: string;
    delete: string;
    getCollection: string;
};
export declare const createEpicMiddleware001: (...args: any[]) => {
    (_store: import("..").QcStore<any>): (next: Function) => (action: QcAction) => any;
    run(rootEpic: import("pure-epic").Epic<QcAction, QcAction, any, any>): void;
};
export declare type EpicMiddlewareCb = (next: Function) => (action: QcAction) => any;
export declare class MyStore implements MyQcStore001 {
    state: Types['StateType'];
    cacher: MyCacher001;
    epicMiddleware: (store: MyStore) => EpicMiddlewareCb;
    epicMiddlewareCb: EpicMiddlewareCb;
    cb: (action: QcAction) => any;
    constructor(cacher: MyCacher001, epicMiddleware: (store: MyStore) => EpicMiddlewareCb, cb: (action: QcAction) => any);
    dispatch: (action: QcAction) => void;
    getState: () => any;
}
declare const _default: () => Promise<unknown>;
export default _default;
