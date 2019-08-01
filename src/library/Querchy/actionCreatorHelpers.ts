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
  ResourceModelType extends ResourceModel<CommonConfigType>,
  StartActionCreatorType,
>(
  modelName : string,
  actionTypes : Required<ResourceModelType['actionTypes']>,
  crudType: CrudType,
  start : Function,
) : ActionCreatorWithProps<
  StartActionCreatorType, StartActionCreatorType
> => {
  const actionCreatorProps : ActionCreatorProps<
    StartActionCreatorType
  > = <any>{
    creatorRefs: {},
  };

  const startFunc : ActionCreatorWithProps<
    StartActionCreatorType, StartActionCreatorType
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

const defaultRawActionCreator : { [s : string] : any } = {
  create: (data, options?) => ({
    data,
    options,
  }),
  read: (resourceId, options?) => ({
    resourceId,
    options,
  }),
  update: (resourceId, data, options?) => ({
    resourceId,
    data,
    options,
  }),
  delete: (resourceId, options?) => ({
    resourceId,
    options,
  }),
};

export const createModelActionCreators = <
  CommonConfigType extends CommonConfig,
  ResourceModelType extends ResourceModel<CommonConfigType>
>(
  modelName : string,
  model: ResourceModelType,
) : ResourceModelActions<Required<ResourceModelType['queryInfos']>> => {
  const actionTypes : Required<ResourceModelType['actionTypes']> = <any>model.actionTypes!;
  const queryInfos = model.queryInfos!;
  const crudTypes = model.crudTypes!;

  return crudTypes.reduce((actionCreators, crudType) => {
    const func = createModelCrudAction<
      CommonConfigType, ResourceModelType, ModelActionCreator<RawActionCreatorCreate>
    >(
      modelName, actionTypes, crudType,
      (
        queryInfos[crudType]
        && queryInfos[crudType].actionCreator
      ) || defaultRawActionCreator[crudType],
    );
    return {
      ...actionCreators,
      [crudType]: func,
    };
  }, <any>{});
};
