import { ActionInfo, CommonConfig, ModelMap, BuildRequestConfigMiddleware, Feature, ResourceModel } from '../../core/interfaces';
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
export default class UpdateCacheT1 implements Feature<Types> {
    Types: Types;
    getBuildRequestConfigMiddleware: <CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>>() => BuildRequestConfigMiddleware<CommonConfigType, ModelMapType>;
    getQueryInfos: <CommonConfigType extends CommonConfig, ResourceModelType extends ResourceModel<CommonConfigType>>(resourceModel: ResourceModelType) => QueryInfosT1;
    getActionInfos: <CommonConfigType extends CommonConfig, ResourceModelType extends ResourceModel<CommonConfigType>>(resourceModel: ResourceModelType) => ActionInfosT1;
}
