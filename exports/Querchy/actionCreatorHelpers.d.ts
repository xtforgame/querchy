import { Action } from 'pure-epic';
import { ModelActionCreator, ResourceModelActions } from '../common/interfaces';
import { CommonConfig, ResourceModel, ResourceModelQueryActions, QueryActionCreatorWithProps, ActionInfoBase, ExtraActionCreatorsLike } from '../core/interfaces';
export declare const createActionTypes: <CommonConfigType extends CommonConfig>(actionTypePrefix2: string, commonConfig: CommonConfigType, names: string[]) => {
    [s: string]: string;
};
export declare const wrapActionCreator: <CommonConfigType extends CommonConfig>(modelName: string, actionTypes: {
    [s: string]: string;
}, actionName: string, actionInfo: ActionInfoBase<Function>, rawFuncWrapper?: (f: Function) => Function, finalFuncWrapper?: (f: Function) => Function) => ModelActionCreator<Function>;
export declare const wrapQueryActionCreator: <CommonConfigType extends CommonConfig>(modelName: string, actionTypes: {
    [s: string]: string;
}, crudType: string, actionInfo: ActionInfoBase<Function>, rawFuncWrapper?: (f: Function) => Function, finalFuncWrapper?: (f: Function) => Function) => QueryActionCreatorWithProps<Function, Function>;
export declare const createModelActionTypes: <CommonConfigType extends CommonConfig, ResourceModelType extends ResourceModel<CommonConfigType>>(modelName: string, commonConfig: CommonConfigType, model: ResourceModelType) => {
    [s: string]: string;
};
export declare const createModelActionCreators: <CommonConfigType extends CommonConfig, ResourceModelType extends ResourceModel<CommonConfigType>>(commonConfigType: CommonConfigType, modelName: string, model: ResourceModelType) => ResourceModelQueryActions<Required<ResourceModelType["queryInfos"]>> & ResourceModelActions<Required<ResourceModelType["actionInfos"]>>;
export declare const createPromiseModelActionCreators: <CommonConfigType extends CommonConfig, ResourceModelType extends ResourceModel<CommonConfigType>>(dispatch: (action: Action) => any, commonConfigType: CommonConfigType, modelName: string, model: ResourceModelType) => ResourceModelQueryActions<Required<ResourceModelType["queryInfos"]>> & ResourceModelActions<Required<ResourceModelType["actionInfos"]>>;
export declare const createExtraActionTypes: <CommonConfigType extends CommonConfig, ExtraActionCreatorsType extends ExtraActionCreatorsLike>(commonConfig: CommonConfigType, extraActionCreators: ExtraActionCreatorsType) => {
    [s: string]: string;
};
export declare const createExtraActionCreators: <CommonConfigType extends CommonConfig, ExtraActionCreatorsType extends ExtraActionCreatorsLike>(commonConfigType: CommonConfigType, extraActionCreators: ExtraActionCreatorsType) => ResourceModelQueryActions<Required<ExtraActionCreatorsType["queryInfos"]>> & ResourceModelActions<Required<ExtraActionCreatorsType["actionInfos"]>>;
export declare const createExtraPromiseModelActionCreators: <CommonConfigType extends CommonConfig, ExtraActionCreatorsType extends ExtraActionCreatorsLike>(dispatch: (action: Action) => any, commonConfigType: CommonConfigType, extraActionCreators: ExtraActionCreatorsType) => ResourceModelQueryActions<Required<ExtraActionCreatorsType["queryInfos"]>> & ResourceModelActions<Required<ExtraActionCreatorsType["actionInfos"]>>;
