import { ActionInfo, CommonConfig, ModelMap, BuildRequestConfigMiddleware, Feature, FeatureForModel } from '../../core/interfaces';
import { ModelActionCreatorUpdateCache, ModelActionCreatorUpdateSomeCache, ModelActionCreatorClearCache, ModelActionCreatorClearSomeCache, ModelActionCreatorClearAllCache, ModelActionCreatorChangeSomeCache } from './interfaces';
export declare type QueryInfosT1 = {};
export declare type ActionInfosT1 = {
    updateCache: ActionInfo<ModelActionCreatorUpdateCache>;
    updateSomeCache: ActionInfo<ModelActionCreatorUpdateSomeCache>;
    clearCache: ActionInfo<ModelActionCreatorClearCache>;
    clearSomeCache: ActionInfo<ModelActionCreatorClearSomeCache>;
    clearAllCache: ActionInfo<ModelActionCreatorClearAllCache>;
    changeSomeCache: ActionInfo<ModelActionCreatorChangeSomeCache>;
};
export declare type Types = {
    ModelActionCreatorUpdateCache: ModelActionCreatorUpdateCache;
    ModelActionCreatorUpdateSomeCache: ModelActionCreatorUpdateSomeCache;
    ModelActionCreatorClearCache: ModelActionCreatorClearCache;
    ModelActionCreatorClearSomeCache: ModelActionCreatorClearSomeCache;
    ModelActionCreatorClearAllCache: ModelActionCreatorClearAllCache;
    ModelActionCreatorChangeSomeCache: ModelActionCreatorChangeSomeCache;
    ActionInfos: ActionInfosT1;
    QueryInfos: QueryInfosT1;
};
declare class UpdateCacheForModelT1 implements FeatureForModel<Types> {
    Types: Types;
    getQueryInfos: () => QueryInfosT1;
    getActionInfos: () => ActionInfosT1;
}
export default class UpdateCacheT1 implements Feature<Types> {
    Types: Types;
    getFeatureForModel: () => UpdateCacheForModelT1;
    getBuildRequestConfigMiddleware: <CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>>() => BuildRequestConfigMiddleware<CommonConfigType, ModelMapType>;
}
export {};
