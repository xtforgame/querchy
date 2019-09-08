import { ResourceMerger } from '../common/interfaces';
import { QcBasicAction, CommonConfig, ModelMap, BuildRequestConfigMiddleware, Feature, FeatureForModel, FeatureTypes } from '../core/interfaces';
export declare type QueryInfosEmpty = {};
export declare type ActionInfosEmpty = {};
export declare type Types = {
    ActionInfos: ActionInfosEmpty;
    QueryInfos: QueryInfosEmpty;
};
export declare class EmptyFeatureForModel<TypesType extends FeatureTypes = Types> implements FeatureForModel<TypesType> {
    constructor(nothing?: any);
    Types: TypesType;
    resourceMerger: ResourceMerger<QcBasicAction>;
    getQueryInfos: () => QueryInfosEmpty;
    getActionInfos: () => ActionInfosEmpty;
}
export default class EmptyFeature<TypesType extends FeatureTypes = Types> implements Feature<TypesType> {
    constructor(nothing?: any);
    Types: TypesType;
    resourceMerger: ResourceMerger<QcBasicAction>;
    getFeatureForModel: () => EmptyFeatureForModel<TypesType>;
    getQueryInfos: () => QueryInfosEmpty;
    getActionInfos: () => ActionInfosEmpty;
    getBuildRequestConfigMiddleware: <CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>>() => BuildRequestConfigMiddleware<CommonConfigType, ModelMapType>;
}
export declare const emptyFeature: EmptyFeature<Types>;
