import {
  CrudType,
  CrudSubType,

  CommonConfig,
  ResourceModel,
  ResourceModelActionTypes,
  ResourceModelActions,

  ActionCreatorProps,
  ActionCreatorWithProps,
  ModelActionCreator,
  RawActionCreatorCreate,
  RawActionCreatorRead,
  RawActionCreatorUpdate,
  RawActionCreatorDelete,
} from '~/core/interfaces';

export const createModelActionTypes = <
  CommonConfigType extends CommonConfig,
  ModelActions,
>(modelName : string, commonConfig : CommonConfigType, crudTypes: string[]) : ResourceModelActionTypes<ModelActions> => {
  const { queryPrefix = '' } = commonConfig;
  return <ResourceModelActionTypes<ModelActions>><any>crudTypes.reduce((actionTypes, crudType) => {
    return {
      ...actionTypes,
      [crudType]: commonConfig.getActionTypeName!(queryPrefix, `${modelName}_${crudType}`),
    }
  }, {});
};

const createModelCrudAction = <
  CommonConfigType extends CommonConfig,
  ResourceModelType extends ResourceModel<CommonConfigType>
>(
  modelName : string,
  actionTypes : Required<ResourceModelType['actionTypes']>,
  crudType: CrudType,
  start : Function,
) : ActionCreatorWithProps<
  Function, Function
> => {
  const actionCreatorProps : ActionCreatorProps<
    Function
  > = <any>{
    creatorRefs: {},
  };

  const startFunc : ActionCreatorWithProps<
    Function, Function
  > = <any>Object.assign(
    (...args : any[]) => ({
      ...start(...args),
      type: actionTypes[crudType]!,
      actionCreator: startFunc,
      modelName,
      actionTypes,
      crudType,
      crudSubType: 'start',
    }),
    actionCreatorProps,
  );

  actionCreatorProps.creatorRefs.start = startFunc;
  actionCreatorProps.creatorRefs.respond = Object.assign(
    (response, responseType, options?) => ({
      type: `${actionTypes[crudType]}_RESPOND`,
      actionCreator: actionCreatorProps.creatorRefs.respond,
      response,
      responseType,
      modelName,
      actionTypes,
      crudType,
      crudSubType: <CrudSubType>'respond',
      options,
    }),
    actionCreatorProps,
    { actionType: `${actionTypes[crudType]}_RESPOND` },
  );
  actionCreatorProps.creatorRefs.respondError = Object.assign(
    (error, options?) => ({
      type: `${actionTypes[crudType]}_ERROR`,
      actionCreator: actionCreatorProps.creatorRefs.respondError,
      error,
      modelName,
      actionTypes,
      crudType,
      crudSubType: <CrudSubType>'respondError',
      options,
    }),
    actionCreatorProps,
    { actionType: `${actionTypes[crudType]}_ERROR` },
  );
  actionCreatorProps.creatorRefs.cancel = Object.assign(
    (reason, options?) => ({
      type: `${actionTypes[crudType]}_CANCEL`,
      actionCreator: actionCreatorProps.creatorRefs.cancel,
      reason,
      modelName,
      actionTypes,
      crudType,
      crudSubType: <CrudSubType>'cancel',
      options,
    }),
    actionCreatorProps,
    { actionType: `${actionTypes[crudType]}_CANCEL` },
  );
  return startFunc;
};

export const createModelActionCreators = <
  CommonConfigType extends CommonConfig,
  ResourceModelType extends ResourceModel<CommonConfigType>
>(
  commonConfigType: CommonConfigType,
  modelName : string,
  model: ResourceModelType,
) : ResourceModelActions<Required<ResourceModelType['queryInfos']>> => {
  const actionTypes : Required<ResourceModelType['actionTypes']> = <any>model.actionTypes!;
  const queryInfos = model.queryInfos!;
  const crudTypes = model.crudTypes!;

  return crudTypes.reduce((actionCreators, crudType) => {
    const queryInfo = queryInfos[crudType] || commonConfigType.builtinQueryInfos[crudType];
    const func = createModelCrudAction<
      CommonConfigType, ResourceModelType
    >(
      modelName, actionTypes, crudType, queryInfo.actionCreator,
    );
    return {
      ...actionCreators,
      [crudType]: func,
    };
  }, <any>{});
};
