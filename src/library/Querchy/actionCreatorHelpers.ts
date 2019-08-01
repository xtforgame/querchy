import {
  CrudType,
  CrudSubType,

  CommonConfig,
  ResourceModelActionTypes,
  ResourceModelActions,

  ActionCreatorProps,
  ActionCreatorWithProps,
  ModelActionCreatorCreate,
  ModelActionCreatorRead,
  ModelActionCreatorUpdate,
  ModelActionCreatorDelete,
} from '~/core/interfaces';

export const createModelActionTypes = <
  CommonConfigType extends CommonConfig,
  ModelActions,
>(modelName : string, commonConfig : CommonConfigType, crudTypes: string[]) : ResourceModelActionTypes<ModelActions> => {
  const { queryPrefix = '' } = commonConfig;
  return <ResourceModelActionTypes<ModelActions>><any>crudTypes.reduce((actionTypes, crudType) => {
    return {
      ...actionTypes,
      [crudType]: commonConfig.getActionTypeName!(queryPrefix, `${crudType}_${modelName}`),
    }
  }, {});
};

const createModelCrudAction = <
  ModelActions,
  StartActionCreatorType,
>(
  modelName : string,
  actionTypes : ResourceModelActionTypes<ModelActions>,
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

export const createModelActions = <
  ModelActions,
>(
  modelName : string,
  actionTypes : ResourceModelActionTypes<ModelActions>,
) : ResourceModelActions => ({
  create: createModelCrudAction<ModelActions, ModelActionCreatorCreate>(
    modelName, actionTypes, 'create',
    (data, options?) => ({
      data,
      options,
    }),
  ),
  read: createModelCrudAction<ModelActions, ModelActionCreatorRead>(
    modelName, actionTypes, 'read',
    (resourceId, options?) => ({
      resourceId,
      options,
    }),
  ),
  update: createModelCrudAction<ModelActions, ModelActionCreatorUpdate>(
    modelName, actionTypes, 'update',
    (resourceId, data, options?) => ({
      resourceId,
      data,
      options,
    }),
  ),
  delete: createModelCrudAction<ModelActions, ModelActionCreatorDelete>(
    modelName, actionTypes, 'delete',
    (resourceId, options?) => ({
      resourceId,
      options,
    }),
  ),
});
