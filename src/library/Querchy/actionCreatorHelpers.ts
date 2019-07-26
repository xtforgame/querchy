import { Epic, Action, createEpicMiddleware, combineEpics } from 'pure-epic';
import { ObservableInput } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { toUnderscore } from '~/common/common-functions';

import {
  QcAction,
  QcState,
  QcStore,
  QcActionCreator,
} from '~/common/interfaces';

import {
  CrudType,
  CrudSubType,

  CommonConfig,
  ResourceModel,
  ResourceModelActionTypes,
  ResourceModelActions,
  ModelMap,
  QueryCreatorMap,
  ExtraActionCreators,
  QuerchyDefinition,
  QcDependencies,
  INIT_FUNC,
  InitFunctionKeyType,

  ActionCreatorProps,
  ActionCreatorWithProps,
  ModelActionCreatorCreate,
  ModelActionCreatorRead,
  ModelActionCreatorUpdate,
  ModelActionCreatorDelete,
} from '~/core/interfaces';

export const createModelActionTypes = <
  ActionType extends Action,
  CommonConfigType extends CommonConfig,
>(modelName : string, commonConfig : CommonConfigType) : ResourceModelActionTypes => {
  const { queryPrefix = '' } = commonConfig;
  return {
    create: commonConfig.getActionTypeName!(queryPrefix, `create_${modelName}`),
    read: commonConfig.getActionTypeName!(queryPrefix, `read_${modelName}`),
    update: commonConfig.getActionTypeName!(queryPrefix, `update_${modelName}`),
    delete: commonConfig.getActionTypeName!(queryPrefix, `delete_${modelName}`),
  };
};

const createModelCrudAction = <
  ActionType extends Action,
  CommonConfigType extends CommonConfig,
  StartActionCreatorType,
>(
  modelName : string,
  actionTypes : ResourceModelActionTypes,
  commonConfig : CommonConfigType,
  crudType: CrudType,
  start : StartActionCreatorType,
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
  > = Object.assign(
    start,
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
  ActionType extends Action,
  CommonConfigType extends CommonConfig,
>(
  modelName : string,
  actionTypes : ResourceModelActionTypes,
  commonConfig : CommonConfigType,
) : ResourceModelActions => {
  const createFunc = createModelCrudAction<
    ActionType,
    CommonConfigType,
    ModelActionCreatorCreate
  >(
    modelName, actionTypes, commonConfig, 'create',
    (data, options?) => ({
      type: actionTypes['create'],
      actionCreator: createFunc,
      modelName,
      actionTypes,
      crudType: 'create',
      crudSubType: 'start',
      data,
      options,
    }),
  );

  const readFunc = createModelCrudAction<
    ActionType,
    CommonConfigType,
    ModelActionCreatorRead
  >(
    modelName, actionTypes, commonConfig, 'read',
    (resourceId, options?) => ({
      type: actionTypes['read'],
      actionCreator: readFunc,
      modelName,
      actionTypes,
      crudType: 'read',
      crudSubType: 'start',
      id: resourceId,
      options,
    }),
  );

  const updateFunc = createModelCrudAction<
    ActionType,
    CommonConfigType,
    ModelActionCreatorUpdate
  >(
    modelName, actionTypes, commonConfig, 'update',
    (resourceId, data, options?) => ({
      type: actionTypes['update'],
      actionCreator: updateFunc,
      modelName,
      actionTypes,
      crudType: 'update',
      crudSubType: 'start',
      id: resourceId,
      data,
      options,
    }),
  );

  const deleteFunc = createModelCrudAction<
    ActionType,
    CommonConfigType,
    ModelActionCreatorDelete
  >(
    modelName, actionTypes, commonConfig, 'delete',
    (resourceId, options?) => ({
      type: actionTypes['delete'],
      actionCreator: deleteFunc,
      modelName,
      actionTypes,
      crudType: 'delete',
      crudSubType: 'start',
      id: resourceId,
      options,
    }),
  );

  return {
    create: createFunc,
    read: readFunc,
    update: updateFunc,
    delete: deleteFunc,
  };
};
