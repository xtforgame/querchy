import { Epic, createEpicMiddleware, combineEpics, State } from 'pure-epic';
import {
  ResourceMetadata,
  ResourceStateQueryMap,
  ResourceStateResourceMap,
  ResourceMerger,
  ResourceState,
  BaseSelector,
} from '../common/interfaces';
import {
  QcBasicAction,
  ResourceModelQueryActionOptions,
  ResourceModel,
  // ActionInfo,
  QueryInfo,
  CommonConfig,
  ModelMap,
  BuildRequestConfigMiddleware,
  Feature,
  FeatureTypes,
} from '../core/interfaces';
import {
  BuiltinSelectorCreators,
  BuiltinSelectors,
  ExtraSelectorFeatureTypes,
  FeatureEx,
  ReturnTypeOfGetExtraSelectorInfos,
} from '../Cacher/interfaces';
import EmptyFeature, {
  emptyFeature,
} from './EmptyFeature';
import {
  createEmptyResourceState,
  mergeResourceState,
} from '../utils';
import toBuildRequestConfigFunction from '../utils/toBuildRequestConfigFunction';

export default class FeatureGroup<
  TypesType extends ExtraSelectorFeatureTypes
> implements FeatureEx<TypesType> {
  features : Feature[];

  Types!: TypesType;

  constructor (
    ...features: Feature[]
  ) {
    this.features = features;
  }

  getActionInfos = <
    CommonConfigType extends CommonConfig,
    ResourceModelType extends ResourceModel<CommonConfigType>,
  >(resourceModel : ResourceModelType) : this['Types']['ActionInfos'] => {
    return this.features.reduce(
      (map, feature) => ({
        ...map,
        ...feature.getActionInfos(resourceModel),
      }),
      <any>{},
    );
  }

  getQueryInfos = <
    CommonConfigType extends CommonConfig,
    ResourceModelType extends ResourceModel<CommonConfigType>,
  >(resourceModel : ResourceModelType) : this['Types']['QueryInfos'] => {
    return this.features.reduce(
      (map, feature) => ({
        ...map,
        ...feature.getQueryInfos(resourceModel),
      }),
      <any>{},
    );
  }

  getExtraSelectorInfos = <
    CommonConfigType extends CommonConfig,
    ModelMapType extends ModelMap<CommonConfigType>,
    ResourceModelType extends ResourceModel<CommonConfigType>,
    StateType extends State,
  >(resourceModel : ResourceModelType)
    : ReturnTypeOfGetExtraSelectorInfos<
    CommonConfigType,
    ModelMapType,
    ResourceModelType,
    StateType,
    TypesType
  > => {
    return this.features.reduce(
      (m, feature) => {
        if ((<any>feature).getExtraSelectorInfos) {
          const featureEx : FeatureEx = <any>feature;
          return {
            ...m,
            ...featureEx.getExtraSelectorInfos<
              CommonConfigType,
              ModelMapType,
              ResourceModelType,
              StateType
            >(resourceModel),
          };
        }
        return m;
      },
      <any>{},
    );
  }

  getBuildRequestConfigMiddleware = <
    CommonConfigType extends CommonConfig,
    ModelMapType extends ModelMap<CommonConfigType>
  >() : BuildRequestConfigMiddleware<CommonConfigType, ModelMapType> => {
    return toBuildRequestConfigFunction<CommonConfigType, ModelMapType>(
      this.features.map(feature => feature.getBuildRequestConfigMiddleware()),
    );
  }
}

export type SelectorCreatorsFromFeature<
  FeatureType extends Feature,
> = FeatureType extends FeatureEx ? FeatureType['Types']['SelectorCreators'] : {};

export type FeatureGroupTypes<
  Feature1 extends Feature,
  Feature2 extends Feature,
  Feature3 extends Feature = EmptyFeature,
  Feature4 extends Feature = EmptyFeature,
  Feature5 extends Feature = EmptyFeature,
  Feature6 extends Feature = EmptyFeature,
  Feature7 extends Feature = EmptyFeature,
  Feature8 extends Feature = EmptyFeature,
> = Feature1['Types']
  & Feature2['Types']
  & Feature3['Types']
  & Feature4['Types']
  & Feature5['Types']
  & Feature6['Types']
  & Feature7['Types']
  & Feature8['Types']
  & {
    ActionInfos: Feature1['Types']['ActionInfos']
      & Feature2['Types']['ActionInfos']
      & Feature3['Types']['ActionInfos']
      & Feature4['Types']['ActionInfos']
      & Feature5['Types']['ActionInfos']
      & Feature6['Types']['ActionInfos']
      & Feature7['Types']['ActionInfos']
      & Feature8['Types']['ActionInfos'];
    QueryInfos: Feature1['Types']['QueryInfos']
      & Feature2['Types']['QueryInfos']
      & Feature3['Types']['QueryInfos']
      & Feature4['Types']['QueryInfos']
      & Feature5['Types']['QueryInfos']
      & Feature6['Types']['QueryInfos']
      & Feature7['Types']['QueryInfos']
      & Feature8['Types']['QueryInfos'];
    SelectorCreators:  SelectorCreatorsFromFeature<Feature1>
      & SelectorCreatorsFromFeature<Feature2>
      & SelectorCreatorsFromFeature<Feature3>
      & SelectorCreatorsFromFeature<Feature4>
      & SelectorCreatorsFromFeature<Feature5>
      & SelectorCreatorsFromFeature<Feature6>
      & SelectorCreatorsFromFeature<Feature7>
      & SelectorCreatorsFromFeature<Feature8>;
  };

export function createFeatureGroup<
  Feature1 extends Feature,
  Feature2 extends Feature,
  Feature3 extends Feature = EmptyFeature,
  Feature4 extends Feature = EmptyFeature,
  Feature5 extends Feature = EmptyFeature,
  Feature6 extends Feature = EmptyFeature,
  Feature7 extends Feature = EmptyFeature,
  Feature8 extends Feature = EmptyFeature,
>(
  feature1 : Feature1,
  feature2 : Feature2,
  feature3 : Feature3 = <any>emptyFeature,
  feature4 : Feature4 = <any>emptyFeature,
  feature5 : Feature5 = <any>emptyFeature,
  feature6 : Feature6 = <any>emptyFeature,
  feature7 : Feature7 = <any>emptyFeature,
  feature8 : Feature8 = <any>emptyFeature,
) {
  return new FeatureGroup<
    FeatureGroupTypes<
      Feature1,
      Feature2,
      Feature3,
      Feature4,
      Feature5,
      Feature6,
      Feature7,
      Feature8
    >>(
      feature1,
      feature2,
      feature3,
      feature4,
      feature5,
      feature6,
      feature7,
      feature8,
    );
}
