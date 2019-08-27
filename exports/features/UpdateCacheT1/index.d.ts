import { ResourceModelQueryActionOptions, ActionInfo, CommonConfig, ModelMap, BuildRequestConfigMiddleware } from '../../core/interfaces';
export declare type RawActionCreatorUpdateCacheT1 = (cacheChange: any, options?: ResourceModelQueryActionOptions) => {
    cacheChange: any;
    options?: ResourceModelQueryActionOptions;
    [s: string]: any;
};
export declare type QueryInfosT1 = {};
export declare type ActionInfosT1 = {
    updateCache: ActionInfo<RawActionCreatorUpdateCacheT1>;
};
export declare type Types = {
    RawActionCreatorUpdateCache: RawActionCreatorUpdateCacheT1;
    ActionInfos: ActionInfosT1;
    QueryInfos: QueryInfosT1;
};
export default class UpdateCacheT1 {
    Types: Types;
    getQueryInfos: () => QueryInfosT1;
    getActionInfos: () => ActionInfosT1;
    getBuildRequestConfigMiddleware: <CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>>() => BuildRequestConfigMiddleware<CommonConfigType, ModelMapType>;
}
