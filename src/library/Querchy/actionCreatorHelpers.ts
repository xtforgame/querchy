import {
  ModelActionCreator,
  ResourceModelActions,
} from '../common/interfaces';
import { toUnderscore } from '../common/common-functions';

import {
  CrudType,
  CrudSubType,

  CommonConfig,
  ResourceModel,
  ResourceModelActionTypes,
  ResourceModelQueryActions,

  QueryActionCreatorProps,
  QueryActionCreatorWithProps,
  ModelQueryActionCreator,
  ActionInfoBase,
  ExtraActionCreatorsLike,
} from '../core/interfaces';

export const createActionTypes = <
  CommonConfigType extends CommonConfig
>(
  actionTypePrefix2 : string,
  commonConfig : CommonConfigType,
  names: string[],
) : { [s : string]: string } => {
  const { actionTypePrefix = '' } = commonConfig;
  return names.reduce(
    (actionTypes, actionName) => ({
      ...actionTypes,
      [actionName]: commonConfig.getActionTypeName!(actionTypePrefix, `${actionTypePrefix2}${actionName}`),
    }),
    {},
  );
};

export const wrapActionCreator = <
  CommonConfigType extends CommonConfig,
>(
  modelName : string,
  actionTypes: { [s : string]: string; },
  actionName: string,
  actionInfo : ActionInfoBase<Function>,
) : ModelActionCreator<Function> => {
  const start = actionInfo.actionCreator;
  const actionType = actionTypes[actionName]!;
  actionInfo.name = actionName;
  actionInfo.actionType = actionType;

  const startFunc : ModelActionCreator<Function> = <any>Object.assign(
    (...args : any[]) => {
      const requestTimestamp = new Date().getTime();
      const requestAction = {
        ...start(...args),
        type: actionType,
        actionCreator: startFunc,
        modelName,
        actionTypes,
        actionName,
        transferables: {},
      };
      requestAction.transferables = {
        requestTimestamp,
        requestAction,
      };
      return requestAction;
    },
    { actionType: actionType },
  );
  return startFunc;
};

export const wrapQueryActionCreator = <
  CommonConfigType extends CommonConfig,
>(
  modelName : string,
  actionTypes : { [s : string]: string },
  crudType: CrudType,
  actionInfo : ActionInfoBase<Function>,
) : QueryActionCreatorWithProps<
  Function, Function
> => {
  const QueryActionCreatorProps : QueryActionCreatorProps<
    Function
  > = <any>{
    creatorRefs: {},
  };

  const start = actionInfo.actionCreator;
  const actionType = actionTypes[crudType]!;
  actionInfo.name = crudType;
  actionInfo.actionType = actionType;
  actionInfo.querySubActionTypes = {
    start: actionType,
    respond: `${actionType}_RESPOND`,
    respondError: `${actionType}_RESPOND_ERROR`,
    cancel: `${actionType}_CANCEL`,
  };

  const querySubActionTypes = actionInfo.querySubActionTypes;

  const startFunc : QueryActionCreatorWithProps<
    Function, Function
  > = Object.assign(
    (...args : any[]) => {
      const requestTimestamp = new Date().getTime();
      const result = start(...args);
      const requestAction = {
        ...result,
        type: actionType,
        actionCreator: startFunc,
        modelName,
        actionTypes,
        crudType,
        crudSubType: 'start',
        requestTimestamp,
        transferables: {},
        options: result.options,
      };
      requestAction.transferables = {
        ...result.transferables,
        requestTimestamp,
        requestAction,
      };
      const queryId = result.options && result.options.queryId;
      if (queryId) {
        requestAction.queryId = queryId;
        requestAction.transferables.queryId = queryId;
      }
      return requestAction;
    },
    QueryActionCreatorProps,
    { actionType },
  );

  const getQueryBuiltinProps = (crudSubType : string, options?) : any => {
    let transferables : any = options && options.transferables || {};
    transferables = {
      ...transferables.requestAction
        && transferables.requestAction.transferables,
      ...transferables,
    };
    if (options.queryId) {
      transferables.queryId = options.queryId;
    }
    const result : any = {
      type: querySubActionTypes[crudSubType],
      actionCreator: QueryActionCreatorProps.creatorRefs[crudSubType],
      modelName,
      actionTypes,
      crudType,
      crudSubType: <CrudSubType>crudSubType,
      requestTimestamp: transferables.requestTimestamp,
      transferables,
      options,
    };
    if (transferables.queryId) {
      result.queryId = transferables.queryId;
    }
    return result;
  };

  QueryActionCreatorProps.creatorRefs.start = startFunc;
  QueryActionCreatorProps.creatorRefs.respond = Object.assign(
    (response, responseType, options?) => ({
      response,
      responseType,
      responseTimestamp: new Date().getTime(),
      ...getQueryBuiltinProps('respond', options),
    }),
    QueryActionCreatorProps,
    { actionType: querySubActionTypes.respond },
  );
  QueryActionCreatorProps.creatorRefs.respondError = Object.assign(
    (error, options?) => ({
      error,
      errorTimestamp: new Date().getTime(),
      ...getQueryBuiltinProps('respondError', options),
    }),
    QueryActionCreatorProps,
    { actionType: querySubActionTypes.respondError },
  );
  QueryActionCreatorProps.creatorRefs.cancel = Object.assign(
    (reason, options?) => ({
      reason,
      cancelTimestamp: new Date().getTime(),
      ...getQueryBuiltinProps('cancel', options),
    }),
    QueryActionCreatorProps,
    { actionType: querySubActionTypes.cancel },
  );
  return startFunc;
};

export const createModelActionTypes = <
  CommonConfigType extends CommonConfig,
  ResourceModelType extends ResourceModel<CommonConfigType>
>(
  modelName : string,
  commonConfig : CommonConfigType,
  model: ResourceModelType,
) : { [s : string]: string } => {
  return {
    ...createActionTypes<CommonConfigType>(`${modelName}_`, commonConfig, model.crudNames!),
    ...createActionTypes<CommonConfigType>(`${modelName}_`, commonConfig, model.actionNames!),
  };
};

export const createModelActionCreators = <
  CommonConfigType extends CommonConfig,
  ResourceModelType extends ResourceModel<CommonConfigType>
>(
  commonConfigType: CommonConfigType,
  modelName : string,
  model: ResourceModelType,
) : ResourceModelQueryActions<
  Required<ResourceModelType['queryInfos']>
> & ResourceModelActions<
  Required<ResourceModelType['actionInfos']>
> => {
  const actionTypes : Required<ResourceModelType['actionTypes']> = <any>model.actionTypes!;
  const queryInfos = model.queryInfos!;
  const crudNames = model.crudNames!;

  const actionInfos = model.actionInfos!;
  const actionNames = model.actionNames!;

  return {
    ...crudNames.reduce(
      (actionCreators, crudType) => ({
        ...actionCreators,
        [crudType]: wrapQueryActionCreator<CommonConfigType>(
          modelName, <any>actionTypes, crudType, queryInfos[crudType],
        ),
      }),
      <any>{},
    ),
    ...actionNames.reduce(
      (actionCreators, actionName) => ({
        ...actionCreators,
        [actionName]: wrapActionCreator<CommonConfigType>(
          modelName, <any>actionTypes, actionName, actionInfos[actionName],
        ),
      }),
      <any>{},
    ),
  };
};

export const createExtraActionTypes = <
  CommonConfigType extends CommonConfig,
  ExtraActionCreatorsType extends ExtraActionCreatorsLike
>(
  commonConfig : CommonConfigType,
  extraActionCreators: ExtraActionCreatorsType,
) : { [s : string]: string } => {
  const extraSetName = 'extra/';
  return {
    ...createActionTypes(
      extraSetName,
      commonConfig,
      Object.keys(extraActionCreators.queryInfos),
    ),
    ...createActionTypes(
      extraSetName,
      commonConfig,
      Object.keys(extraActionCreators.actionInfos),
    ),
  };
};

export const createExtraActionCreators = <
  CommonConfigType extends CommonConfig,
  ExtraActionCreatorsType extends ExtraActionCreatorsLike
>(
  commonConfigType: CommonConfigType,
  extraActionCreators: ExtraActionCreatorsType,
) : ResourceModelQueryActions<
  Required<ExtraActionCreatorsType['queryInfos']>
> & ResourceModelActions<
  Required<ExtraActionCreatorsType['actionInfos']>
> => {
  const actionTypes : Required<ExtraActionCreatorsType['actionTypes']> = <any>extraActionCreators.actionTypes!;
  const queryInfos = extraActionCreators.queryInfos!;
  const crudNames = Object.keys(queryInfos);

  const actionInfos = extraActionCreators.actionInfos!;
  const actionNames = Object.keys(actionInfos);

  return {
    ...crudNames.reduce(
      (actionCreators, crudType) => ({
        ...actionCreators,
        [crudType]: wrapQueryActionCreator<CommonConfigType>(
          '', <any>actionTypes, crudType, queryInfos[crudType],
        ),
      }),
      <any>{},
    ),
    ...actionNames.reduce(
      (actionCreators, actionName) => ({
        ...actionCreators,
        [actionName]: wrapActionCreator<CommonConfigType>(
          '', <any>actionTypes, actionName, actionInfos[actionName],
        ),
      }),
      <any>{},
    ),
  };
};
