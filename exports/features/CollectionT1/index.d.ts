import { ResourceState, ResourceChange, BaseSelector } from '../../common/interfaces';
import { QcBasicAction, ResourceModelQueryActionOptions, ResourceModel, QueryInfo, CommonConfig, ModelMap, BuildRequestConfigMiddleware } from '../../core/interfaces';
import { FeatureEx, BuiltinSelectorCreators, BuiltinSelectors } from '../../Cacher/interfaces';
import { GetResourceChange } from '../shared';
export declare const crudToRestMap: {
    getCollection: string;
};
export declare type RawActionCreatorGetCollectionT1 = (options?: ResourceModelQueryActionOptions) => {
    options?: ResourceModelQueryActionOptions;
    [s: string]: any;
};
export declare type RawActionCreatorGetByIdsT1 = (ids: string[], options?: ResourceModelQueryActionOptions) => {
    options?: ResourceModelQueryActionOptions;
    [s: string]: any;
};
export declare type QueryInfosT1 = {
    getCollection: QueryInfo<RawActionCreatorGetCollectionT1>;
    getByIds: QueryInfo<RawActionCreatorGetByIdsT1>;
};
export declare type ActionInfosT1 = {};
export declare type SelectorCreatorsT1 = {
    selectCollenctionItems: () => (state: any) => any;
};
export declare type Types = {
    RawActionCreatorGetCollection: RawActionCreatorGetCollectionT1;
    ActionInfos: ActionInfosT1;
    QueryInfos: QueryInfosT1;
    SelectorCreators: SelectorCreatorsT1;
};
export declare type ParseResponse = (state: ResourceState, action: QcBasicAction) => ResourceChange;
export declare const NOT_IN_RESOURCE_MAP: unique symbol;
export default class CollectionT1 implements FeatureEx<Types> {
    Types: Types;
    onError: (error: Error, state: ResourceState, action: QcBasicAction) => any;
    constructor();
    getResourceChange: <CommonConfigType extends CommonConfig, ResourceModelType extends ResourceModel<CommonConfigType>>(resourceModel: ResourceModelType) => GetResourceChange;
    getBuildRequestConfigMiddleware: <CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>>() => BuildRequestConfigMiddleware<CommonConfigType, ModelMapType>;
    getQueryInfos: <CommonConfigType extends CommonConfig, ResourceModelType extends ResourceModel<CommonConfigType>>(resourceModel: ResourceModelType) => QueryInfosT1;
    getActionInfos: <CommonConfigType extends CommonConfig, ResourceModelType extends ResourceModel<CommonConfigType>>(resourceModel: ResourceModelType) => ActionInfosT1;
    getExtraSelectorInfos: <CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, ResourceModelType extends ResourceModel<CommonConfigType>, StateType extends any>(resourceModel: ResourceModelType) => {
        selectCollenctionItems: {
            creatorCreator: (baseSelector: BaseSelector<ModelMapType>, builtinSelectorCreators: BuiltinSelectorCreators<StateType>, builtinSelectors: BuiltinSelectors<StateType>) => () => (state: StateType) => any;
        };
    };
}
