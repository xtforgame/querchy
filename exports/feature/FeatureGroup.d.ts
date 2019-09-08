import { ResourceModel, CommonConfig, ModelMap, BuildRequestConfigMiddleware, Feature, FeatureTypes, FeatureForModel } from '../core/interfaces';
import EmptyFeature from './EmptyFeature';
export declare class FeatureGroupForModel<TypesType extends FeatureTypes> implements FeatureForModel<TypesType> {
    featuresForModel: FeatureForModel[];
    Types: TypesType;
    constructor(...featuresForModel: FeatureForModel[]);
    getActionInfos: () => this['Types']['ActionInfos'];
    getQueryInfos: () => this['Types']['QueryInfos'];
}
export default class FeatureGroup<TypesType extends FeatureTypes> implements Feature<TypesType> {
    features: Feature[];
    Types: TypesType;
    constructor(...features: Feature[]);
    getFeatureForModel: (resourceModel: ResourceModel<CommonConfig>) => FeatureGroupForModel<TypesType>;
    getBuildRequestConfigMiddleware: <CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>>() => BuildRequestConfigMiddleware<CommonConfigType, ModelMapType>;
}
export declare type FeatureGroupTypes<Feature1 extends Feature, Feature2 extends Feature, Feature3 extends Feature = EmptyFeature, Feature4 extends Feature = EmptyFeature, Feature5 extends Feature = EmptyFeature, Feature6 extends Feature = EmptyFeature, Feature7 extends Feature = EmptyFeature, Feature8 extends Feature = EmptyFeature> = Feature1['Types'] & Feature2['Types'] & Feature3['Types'] & Feature4['Types'] & Feature5['Types'] & Feature6['Types'] & Feature7['Types'] & Feature8['Types'] & {
    ActionInfos: Feature1['Types']['ActionInfos'] & Feature2['Types']['ActionInfos'] & Feature3['Types']['ActionInfos'] & Feature4['Types']['ActionInfos'] & Feature5['Types']['ActionInfos'] & Feature6['Types']['ActionInfos'] & Feature7['Types']['ActionInfos'] & Feature8['Types']['ActionInfos'];
    QueryInfos: Feature1['Types']['QueryInfos'] & Feature2['Types']['QueryInfos'] & Feature3['Types']['QueryInfos'] & Feature4['Types']['QueryInfos'] & Feature5['Types']['QueryInfos'] & Feature6['Types']['QueryInfos'] & Feature7['Types']['QueryInfos'] & Feature8['Types']['QueryInfos'];
};
export declare function createFeatureGroup<Feature1 extends Feature, Feature2 extends Feature, Feature3 extends Feature = EmptyFeature, Feature4 extends Feature = EmptyFeature, Feature5 extends Feature = EmptyFeature, Feature6 extends Feature = EmptyFeature, Feature7 extends Feature = EmptyFeature, Feature8 extends Feature = EmptyFeature>(feature1: Feature1, feature2: Feature2, feature3?: Feature3, feature4?: Feature4, feature5?: Feature5, feature6?: Feature6, feature7?: Feature7, feature8?: Feature8): FeatureGroup<FeatureGroupTypes<Feature1, Feature2, Feature3, Feature4, Feature5, Feature6, Feature7, Feature8>>;
