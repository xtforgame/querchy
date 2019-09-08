import {
  ResourceMetadata,
  ResourceStateQueryMap,
  ResourceStateResourceMap,
  ResourceMerger,
  ResourceState,
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
  FeatureForModel,
} from '../core/interfaces';
import EmptyFeature, {
  emptyFeature,
} from './EmptyFeature';
import {
  createEmptyResourceState,
  mergeResourceState,
} from '../utils';
import toBuildRequestConfigFunction from '../utils/toBuildRequestConfigFunction';

export class FeatureGroupForModel<
  TypesType extends FeatureTypes
> implements FeatureForModel<TypesType> {
  featuresForModel : FeatureForModel[];

  Types!: TypesType;

  constructor (
    ...featuresForModel: FeatureForModel[]
  ) {
    this.featuresForModel = featuresForModel;
  }

  // resourceMerger : ResourceMerger<QcBasicAction> = (
  //   state = createEmptyResourceState(),
  //   action,
  // ) => {
  //   return this.features.reduce<ResourceState>((s, f) => f.resourceMerger(s, action), state);
  // }

  getActionInfos : () => this['Types']['ActionInfos'] = () => {
    return this.featuresForModel.reduce(
      (map, featureForModel) => ({
        ...map,
        ...featureForModel.getActionInfos(),
      }),
      <any>{},
    );
  }

  getQueryInfos : () => this['Types']['QueryInfos'] = () => {
    return this.featuresForModel.reduce(
      (map, featureForModel) => ({
        ...map,
        ...featureForModel.getQueryInfos(),
      }),
      <any>{},
    );
  }
}

export default class FeatureGroup<
  TypesType extends FeatureTypes
> implements Feature<TypesType> {
  features : Feature[];

  Types!: TypesType;

  constructor (
    ...features: Feature[]
  ) {
    this.features = features;
  }

  getFeatureForModel = (resourceModel : ResourceModel) => {
    const featuresForModel = this.features.map(
      feature => feature.getFeatureForModel(resourceModel),
    );
    return new FeatureGroupForModel<TypesType>(...featuresForModel);
  }

  getBuildRequestConfigMiddleware = <
    CommonConfigType extends CommonConfig,
    ModelMapType extends ModelMap<CommonConfigType>
  >() : BuildRequestConfigMiddleware<CommonConfigType, ModelMapType> => {
    return  toBuildRequestConfigFunction<CommonConfigType, ModelMapType>(
      this.features.map(feature => feature.getBuildRequestConfigMiddleware()),
    );
  }
}

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
