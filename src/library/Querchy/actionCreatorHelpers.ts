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
} from '~/core/interfaces';

export const createModelActionTypes = <
  ActionType extends Action,
  CommonConfigType extends CommonConfig,
>(modelName : string, commonConfig : CommonConfigType) : ResourceModelActionTypes<ActionType, CommonConfigType> => {
  const { queryPrefix = '' } = commonConfig;
  return {
    create: commonConfig.getActionTypeName!(queryPrefix, `create_${modelName}`),
    read: commonConfig.getActionTypeName!(queryPrefix, `read_${modelName}`),
    update: commonConfig.getActionTypeName!(queryPrefix, `update_${modelName}`),
    delete: commonConfig.getActionTypeName!(queryPrefix, `delete_${modelName}`),
  };
};

export const createModelActions = <
  ActionType extends Action,
  CommonConfigType extends CommonConfig,
>(modelName : string, actionTypes : ResourceModelActionTypes<ActionType, CommonConfigType>, commonConfig : CommonConfigType) : ResourceModelActions<ActionType, CommonConfigType> => {
  return {
    create: Object.assign(
      (data, options?) => (<ActionType><any>{
        type: actionTypes.create,
        modelName,
        actionTypes,
        crudType: 'create',
        data,
        options,
      }),
      { actionType: actionTypes.create, creators: {} },
    ),
    read: Object.assign(
      (resourceId, options?) => (<ActionType><any>{
        type: actionTypes.read,
        modelName,
        actionTypes,
        crudType: 'read',
        id: resourceId,
        options,
      }),
      { actionType: actionTypes.read, creators: {} },
    ),
    update: Object.assign(
      (resourceId, data, options?) => (<ActionType><any>{
        type: actionTypes.update,
        modelName,
        actionTypes,
        crudType: 'update',
        id: resourceId,
        data,
        options,
      }),
      { actionType: actionTypes.update, creators: {} },
    ),
    delete: Object.assign(
      (resourceId, options?) => (<ActionType><any>{
        type: actionTypes.delete,
        modelName,
        actionTypes,
        crudType: 'delete',
        id: resourceId,
        options,
      }),
      { actionType: actionTypes.delete, creators: {} },
    ),
  };
};
