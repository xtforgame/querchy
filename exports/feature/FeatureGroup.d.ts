import { ResourceModel, CommonConfig, ModelMap, BuildRequestConfigMiddleware, Feature } from '../core/interfaces';
import { ExtraSelectorFeatureTypes, FeatureEx, ReturnTypeOfGetExtraSelectorInfos } from '../Cacher/interfaces';
import EmptyFeature from './EmptyFeature';
export default class FeatureGroup<TypesType extends ExtraSelectorFeatureTypes> implements FeatureEx<TypesType> {
    features: Feature[];
    Types: TypesType;
    constructor(...features: Feature[]);
    getActionInfos: <CommonConfigType extends CommonConfig, ResourceModelType extends ResourceModel<CommonConfigType>>(resourceModel: ResourceModelType) => this["Types"]["ActionInfos"];
    getQueryInfos: <CommonConfigType extends CommonConfig, ResourceModelType extends ResourceModel<CommonConfigType>>(resourceModel: ResourceModelType) => this["Types"]["QueryInfos"];
    getExtraSelectorInfos: <CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, ResourceModelType extends ResourceModel<CommonConfigType>, StateType extends any>(resourceModel: ResourceModelType) => ReturnTypeOfGetExtraSelectorInfos<CommonConfigType, ModelMapType, ResourceModelType, StateType, TypesType>;
    getBuildRequestConfigMiddleware: <CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>>() => BuildRequestConfigMiddleware<CommonConfigType, ModelMapType>;
}
export declare type SelectorCreatorsFromFeature<FeatureType extends Feature> = FeatureType extends FeatureEx ? FeatureType['Types']['SelectorCreators'] : {};
export declare type FeatureGroupTypes<Feature1 extends Feature, Feature2 extends Feature, Feature3 extends Feature = EmptyFeature, Feature4 extends Feature = EmptyFeature, Feature5 extends Feature = EmptyFeature, Feature6 extends Feature = EmptyFeature, Feature7 extends Feature = EmptyFeature, Feature8 extends Feature = EmptyFeature> = Feature1['Types'] & Feature2['Types'] & Feature3['Types'] & Feature4['Types'] & Feature5['Types'] & Feature6['Types'] & Feature7['Types'] & Feature8['Types'] & {
    ActionInfos: Feature1['Types']['ActionInfos'] & Feature2['Types']['ActionInfos'] & Feature3['Types']['ActionInfos'] & Feature4['Types']['ActionInfos'] & Feature5['Types']['ActionInfos'] & Feature6['Types']['ActionInfos'] & Feature7['Types']['ActionInfos'] & Feature8['Types']['ActionInfos'];
    QueryInfos: Feature1['Types']['QueryInfos'] & Feature2['Types']['QueryInfos'] & Feature3['Types']['QueryInfos'] & Feature4['Types']['QueryInfos'] & Feature5['Types']['QueryInfos'] & Feature6['Types']['QueryInfos'] & Feature7['Types']['QueryInfos'] & Feature8['Types']['QueryInfos'];
    SelectorCreators: SelectorCreatorsFromFeature<Feature1> & SelectorCreatorsFromFeature<Feature2> & SelectorCreatorsFromFeature<Feature3> & SelectorCreatorsFromFeature<Feature4> & SelectorCreatorsFromFeature<Feature5> & SelectorCreatorsFromFeature<Feature6> & SelectorCreatorsFromFeature<Feature7> & SelectorCreatorsFromFeature<Feature8>;
};
export declare function createFeatureGroup<Feature1 extends Feature, Feature2 extends Feature, Feature3 extends Feature = EmptyFeature, Feature4 extends Feature = EmptyFeature, Feature5 extends Feature = EmptyFeature, Feature6 extends Feature = EmptyFeature, Feature7 extends Feature = EmptyFeature, Feature8 extends Feature = EmptyFeature>(feature1: Feature1, feature2: Feature2, feature3?: Feature3, feature4?: Feature4, feature5?: Feature5, feature6?: Feature6, feature7?: Feature7, feature8?: Feature8): FeatureGroup<FeatureGroupTypes<Feature1, Feature2, Feature3, Feature4, Feature5, Feature6, Feature7, Feature8>>;
