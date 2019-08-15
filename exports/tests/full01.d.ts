import { QcAction } from '../index';
import { MyState001, MyQcStore001, MyCacher001 } from './types001';
export declare const crudToRestMap: {
    create: string;
    read: string;
    update: string;
    delete: string;
    getCollection: string;
};
export declare type EpicMiddlewareCb = (next: Function) => (action: QcAction) => any;
export declare class MyStore implements MyQcStore001 {
    state: MyState001;
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
