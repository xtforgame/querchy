import { State } from 'pure-epic';
import { SliceReducer, ResourceStateResourceMap, ResourceStateQueryMap, BaseSelector, ResourceStateMetadataMap, ResourceStateValueMap } from '../common/interfaces';
import { CommonConfig, ModelMap, FeatureTypes, Feature, ResourceModel } from '../core/interfaces';
import { ReturnType } from '../utils/helper-functions';
export declare type SelectorCreators = {
    [s: string]: Function;
};
export interface ExtraSelectorFeatureTypes extends FeatureTypes {
    SelectorCreators: {
        [s: string]: Function;
    };
}
export declare type ReturnTypeOfGetExtraSelectorInfos<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, ResourceModelType extends ResourceModel<CommonConfigType>, StateType extends State, TypesType extends ExtraSelectorFeatureTypes = ExtraSelectorFeatureTypes> = {
    [P in keyof TypesType['SelectorCreators']]: {
        creatorCreator: (baseSelector: BaseSelector<ModelMapType>, builtinSelectorCreators: BuiltinSelectorCreators<StateType>, builtinSelectors: BuiltinSelectors<StateType>) => TypesType['SelectorCreators'][P];
    };
};
export declare type ExtraSelectorFeature<TypesType extends ExtraSelectorFeatureTypes = ExtraSelectorFeatureTypes> = {
    Types: TypesType;
    getExtraSelectorInfos: <CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, ResourceModelType extends ResourceModel<CommonConfigType>, StateType extends State>(resourceModel: ResourceModelType) => ReturnTypeOfGetExtraSelectorInfos<CommonConfigType, ModelMapType, ResourceModelType, StateType, TypesType>;
};
export declare type FeatureEx<TypesType extends ExtraSelectorFeatureTypes = ExtraSelectorFeatureTypes> = Feature<TypesType> & ExtraSelectorFeature<TypesType>;
export declare type ReducerSet<T> = {
    [P in keyof T]: SliceReducer;
} & {
    [s: string]: SliceReducer;
};
export declare type ReducerSets<CommonConfigType extends CommonConfig, T extends ModelMap<CommonConfigType>> = {
    [P in keyof T]: ReducerSet<Required<T[P]>['actions']>;
} & {
    [s: string]: {
        [s: string]: SliceReducer;
    };
};
export declare type SelectorInfo<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>> = {
    creatorCreator: (baseSelector: BaseSelector<ModelMapType>) => Function;
};
export declare type SelectorInfos<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>> = {
    selectorInfos: {
        [s: string]: SelectorInfo<CommonConfigType, ModelMapType>;
    };
};
export declare type SliceSelectorCreator = any;
export declare type BuiltinSelectorCreators<StateType extends State> = {
    selectResourceMap: () => (state: StateType) => ResourceStateResourceMap;
    selectResourceMapMetadata: () => (state: StateType) => ResourceStateMetadataMap;
    selectResourceMapValues: () => (state: StateType) => ResourceStateValueMap;
    selectQueryMap: () => (state: StateType) => ResourceStateQueryMap;
    selectQueryMapMetadata: () => (state: StateType) => ResourceStateMetadataMap;
    selectQueryMapValues: () => (state: StateType) => ResourceStateValueMap;
};
export declare type SelectorCreatorSet<StateType extends State, T> = BuiltinSelectorCreators<StateType> & T;
export declare type SelectorCreatorsForFeatureExHelper<StateType extends State, CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, SelectorCreatorsType extends SelectorCreators> = {
    [P in keyof SelectorCreatorsType]: SelectorCreatorsType[P];
};
export declare type SelectorCreatorsForFeatureEx<StateType extends State, CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, FeatureExType extends ExtraSelectorFeature> = SelectorCreatorsForFeatureExHelper<StateType, CommonConfigType, ModelMapType, FeatureExType['Types']['SelectorCreators']>;
export declare type SelectorCreatorSets<StateType extends State, CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, ExtraSelectorCreators> = {
    [P in keyof ModelMapType]: SelectorCreatorSet<StateType, {}> & (Required<ModelMapType[P]>['feature'] extends ExtraSelectorFeature ? SelectorCreatorsForFeatureEx<StateType, CommonConfigType, ModelMapType, Required<ModelMapType[P]>['feature']> : {});
} & ExtraSelectorCreators & {
    [s: string]: SelectorCreatorSet<StateType, {}>;
};
export declare type SliceSelector = any;
export declare type BuiltinSelectors<StateType extends State> = {
    [P in keyof BuiltinSelectorCreators<StateType>]: ReturnType<BuiltinSelectorCreators<StateType>[P]>;
};
export declare type SelectorSet<StateType extends State, T> = BuiltinSelectors<StateType> & T;
export declare type SelectorsForFeatureExHelper<StateType extends State, CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, SelectorCreatorsType extends SelectorCreators> = {
    [P in keyof SelectorCreatorsType]: ReturnType<SelectorCreatorsType[P]>;
};
export declare type SelectorsForFeatureEx<StateType extends State, CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, FeatureExType extends ExtraSelectorFeature> = SelectorsForFeatureExHelper<StateType, CommonConfigType, ModelMapType, FeatureExType['Types']['SelectorCreators']>;
export declare type SelectorSets<StateType extends State, CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, ExtraSelectorCreators> = {
    [P in keyof ModelMapType]: SelectorSet<StateType, {}> & (Required<ModelMapType[P]>['feature'] extends ExtraSelectorFeature ? SelectorsForFeatureEx<StateType, CommonConfigType, ModelMapType, Required<ModelMapType[P]>['feature']> : {});
} & ExtraSelectorCreators & {
    [s: string]: SelectorSet<StateType, {}>;
};
export declare type SelectorCreatorCreatorForModelMap<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, StateType extends State> = (baseSelector: BaseSelector<ModelMapType>, builtinSelectorCreators: BuiltinSelectorCreators<StateType>, builtinSelectors: BuiltinSelectors<StateType>) => (...args: any) => Function;
export declare type ExtraSelectorInfosForModelMap<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, StateType extends State> = {
    [s: string]: {
        creatorCreator: SelectorCreatorCreatorForModelMap<CommonConfigType, ModelMapType, StateType>;
    };
};
export declare type ExtraSelectorInfosMapForModelMap<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, StateType extends State> = {
    [P in keyof Partial<ModelMapType>]: ExtraSelectorInfosForModelMap<CommonConfigType, ModelMapType, StateType>;
};
export declare type BuiltinModelSelectors = {
    [s: string]: Function;
};
export declare type MergedSelectorCreatorsForModel<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, StateType extends State, ExtraSelectorInfosForModelMapType extends ExtraSelectorInfosForModelMap<CommonConfigType, ModelMapType, StateType>> = {
    [P in keyof ExtraSelectorInfosForModelMapType]: ReturnType<ExtraSelectorInfosForModelMapType[P]['creatorCreator']>;
};
export declare type ExtraModelSelectorCreators<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, StateType extends State, ExtraSelectorInfosForModelType extends ExtraSelectorInfosMapForModelMap<CommonConfigType, ModelMapType, StateType>> = {
    [P in keyof ModelMapType]: MergedSelectorCreatorsForModel<CommonConfigType, ModelMapType, StateType, ExtraSelectorInfosForModelType[P]>;
};
export declare type MergedSelectorsForModel<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, StateType extends State, ExtraSelectorInfosForModelMapType extends ExtraSelectorInfosForModelMap<CommonConfigType, ModelMapType, StateType>> = {
    [P in keyof ExtraSelectorInfosForModelMapType]: ReturnType<ReturnType<ExtraSelectorInfosForModelMapType[P]['creatorCreator']>>;
};
export declare type ExtraModelSelectors<CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>, StateType extends State, ExtraSelectorInfosForModelType extends ExtraSelectorInfosMapForModelMap<CommonConfigType, ModelMapType, StateType>> = {
    [P in keyof ModelMapType]: MergedSelectorsForModel<CommonConfigType, ModelMapType, StateType, ExtraSelectorInfosForModelType[P]>;
};
