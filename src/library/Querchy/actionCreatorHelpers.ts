import { Action } from 'pure-epic';
import {
  ModelActionCreator,
  ResourceModelActions,
} from '../common/interfaces';
import { toUnderscore, PreservePromise } from '../common/common-functions';

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

import {
  symbolList,
  SUCCESS_ACTION,
  SUCCESS_CALLBACK,
  ERROR_ACTION,
  ERROR_CALLBACK,
  PASS_ANYWAY,
  PASS_NEVER,
} from '../utils/createWatcherMiddleware';

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
      [actionName]: commonConfig.getActionTypeName!(
        actionTypePrefix, `${actionTypePrefix2}${actionName}`,
      ),
    }),
    {},
  );
};

const createBasicAction = (
  type : string,
  actionCreator : Function,
  result: any,
  props: any = {},
  transferables: any = {},
) => {
  const requestAction = {
    ...result,
    type,
    actionCreator,
    ...props,
    transferables: {
      ...(result.options && result.options.transferables),
    },
    ...(result.options && result.options.actionProps),
  };
  if (requestAction.options) {
    symbolList.forEach((s) => {
      if (!requestAction[s] && requestAction.options[s]) {
        requestAction[s] = requestAction.options[s];
      }
    });
  }
  requestAction.transferables = {
    ...result.transferables,
    requestAction,
    ...transferables,
  };
  return requestAction;
};

const createQueryAction = (
  type : string,
  actionCreator : Function,
  result: any,
  extraProps: any = {},
  extraTransferables: any = {},
) => {
  const requestTimestamp = new Date().getTime();
  const basicResult = createBasicAction(
    type,
    actionCreator,
    result,
    { requestTimestamp, ...extraProps },
    { requestTimestamp, ...extraTransferables },
  );
  const queryId = basicResult.options && basicResult.options.queryId;
  if (queryId) {
    basicResult.queryId = queryId;
    basicResult.transferables.queryId = queryId;
  }
  return basicResult;
};

export const wrapActionCreator = <
  CommonConfigType extends CommonConfig,
>(
  modelName : string,
  actionTypes: { [s : string]: string; },
  actionName: string,
  actionInfo : ActionInfoBase<Function>,
  rawFuncWrapper : (f : Function) => Function = (f => f),
  finalFuncWrapper : (f : Function) => Function = (f => f),
) : ModelActionCreator<Function> => {
  const start = rawFuncWrapper(actionInfo.actionCreator);
  const actionType = actionTypes[actionName]!;
  actionInfo.name = actionName;
  actionInfo.actionType = actionType;

  const startFunc : ModelActionCreator<Function> = <any>Object.assign(
    finalFuncWrapper((...args : any[]) => createBasicAction(
      actionType,
      startFunc,
      start(...args),
      {
        modelName,
        actionTypes,
        actionName,
      },
      { requestTimestamp: new Date().getTime() },
    )),
    { actionType },
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
  rawFuncWrapper : (f : Function) => Function = (f => f),
  finalFuncWrapper : (f : Function) => Function = (f => f),
) : QueryActionCreatorWithProps<
  Function, Function
> => {
  const queryActionCreatorProps : QueryActionCreatorProps<
    Function
  > = <any>{
    creatorRefs: {},
  };

  const start = rawFuncWrapper(actionInfo.actionCreator);
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
    finalFuncWrapper((...args : any[]) => createQueryAction(
      actionType,
      startFunc,
      start(...args),
      {
        modelName,
        actionTypes,
        crudType,
        crudSubType: 'start',
      },
    )),
    queryActionCreatorProps,
    { actionType },
  );

  const getQueryBuiltinProps = (crudSubType : string, options?) : any => {
    const transferables : any = (options && options.transferables) || {};
    return createQueryAction(
      querySubActionTypes[crudSubType],
      queryActionCreatorProps.creatorRefs[crudSubType],
      { options },
      {
        modelName,
        actionTypes,
        crudType,
        crudSubType,
      },
      {
        ...transferables.requestAction
          && transferables.requestAction.transferables,
        ...transferables,
      },
    );
  };

  queryActionCreatorProps.creatorRefs.start = startFunc;
  queryActionCreatorProps.creatorRefs.respond = Object.assign(
    (response, responseType, options?) => ({
      response,
      responseType,
      responseTimestamp: new Date().getTime(),
      ...getQueryBuiltinProps('respond', options),
    }),
    queryActionCreatorProps,
    { actionType: querySubActionTypes.respond },
  );
  queryActionCreatorProps.creatorRefs.respondError = Object.assign(
    (error, options?) => ({
      error,
      errorTimestamp: new Date().getTime(),
      ...getQueryBuiltinProps('respondError', options),
    }),
    queryActionCreatorProps,
    { actionType: querySubActionTypes.respondError },
  );
  queryActionCreatorProps.creatorRefs.cancel = Object.assign(
    (reason, options?) => ({
      reason,
      cancelTimestamp: new Date().getTime(),
      ...getQueryBuiltinProps('cancel', options),
    }),
    queryActionCreatorProps,
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

const getRawFuncWrapperForAction = () => f => (...args) => {
  const result = f(...args);
  const pp = new PreservePromise<Action>();
  const symbol = Symbol('req_action');
  result._pp = pp;
  result.options = {
    ...result.options,
    actionProps: {
      ...(result.options && result.options.actionProps),
      _symbol: symbol,
    },
  };
  const getCheckFunc = (crudSubType : CrudSubType) => (action : any) => {
    return action.crudSubType === crudSubType
      && action.transferables
      && action.transferables.requestAction
      && action.transferables.requestAction._symbol === symbol;
  };
  result.options.actionProps[SUCCESS_ACTION] = result.options.actionProps[SUCCESS_ACTION]
    || getCheckFunc('respond');
  const originSuccess = result.options.actionProps[SUCCESS_CALLBACK] || (() => {});
  result.options.actionProps[SUCCESS_CALLBACK] = (a) => {
    originSuccess(a);
    pp.resolve(a);
  };
  result.options.actionProps[ERROR_ACTION] = result.options.actionProps[ERROR_ACTION]
    || getCheckFunc('respondError');
  const originError = result.options.actionProps[ERROR_CALLBACK] || (() => {});
  result.options.actionProps[ERROR_CALLBACK] = (a) => {
    originError(a);
    pp.reject(a);
  };
  return result;
};

const getRawFuncWrapperForQueryAction = () => f => (...args) => {
  const result = f(...args);
  const pp = new PreservePromise<Action>();
  const symbol = Symbol('req_action');
  result._pp = pp;
  result.options = {
    ...result.options,
    actionProps: {
      ...(result.options && result.options.actionProps),
      _symbol: symbol,
    },
  };
  const getCheckFunc = (crudSubType : CrudSubType) => (action : any) => {
    return action.crudSubType === crudSubType
      && action.transferables
      && action.transferables.requestAction
      && action.transferables.requestAction._symbol === symbol;
  };
  result.options.actionProps[SUCCESS_ACTION] = result.options.actionProps[SUCCESS_ACTION]
    || getCheckFunc('respond');
  const originSuccess = result.options.actionProps[SUCCESS_CALLBACK] || (() => {});
  result.options.actionProps[SUCCESS_CALLBACK] = (a) => {
    originSuccess(a);
    pp.resolve(a);
  };
  result.options.actionProps[ERROR_ACTION] = result.options.actionProps[ERROR_ACTION]
    || getCheckFunc('respondError');
  const originError = result.options.actionProps[ERROR_CALLBACK] || (() => {});
  result.options.actionProps[ERROR_CALLBACK] = (a) => {
    originError(a);
    pp.reject(a);
  };
  return result;
};

const getFinalFuncWrapper = dispatch => f => (...args) => {
  const result = f(...args);
  const { _pp: pp } : { _pp: PreservePromise<Action> } = result;
  delete result._pp;
  dispatch(result);
  return pp.promise;
};

export const createPromiseModelActionCreators = <
  CommonConfigType extends CommonConfig,
  ResourceModelType extends ResourceModel<CommonConfigType>
>(
  dispatch: (action: Action) => any,
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
          getRawFuncWrapperForQueryAction(),
          getFinalFuncWrapper(dispatch),
        ),
      }),
      <any>{},
    ),
    ...actionNames.reduce(
      (actionCreators, actionName) => ({
        ...actionCreators,
        [actionName]: wrapActionCreator<CommonConfigType>(
          modelName, <any>actionTypes, actionName, actionInfos[actionName],
          getRawFuncWrapperForAction(),
          getFinalFuncWrapper(dispatch),
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
  const actionTypes
    : Required<ExtraActionCreatorsType['actionTypes']> = <any>extraActionCreators.actionTypes!;
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

export const createExtraPromiseModelActionCreators = <
  CommonConfigType extends CommonConfig,
  ExtraActionCreatorsType extends ExtraActionCreatorsLike
>(
  dispatch: (action: Action) => any,
  commonConfigType: CommonConfigType,
  extraActionCreators: ExtraActionCreatorsType,
) : ResourceModelQueryActions<
  Required<ExtraActionCreatorsType['queryInfos']>
> & ResourceModelActions<
  Required<ExtraActionCreatorsType['actionInfos']>
> => {
  const actionTypes
    : Required<ExtraActionCreatorsType['actionTypes']> = <any>extraActionCreators.actionTypes!;
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
          getRawFuncWrapperForQueryAction(),
          getFinalFuncWrapper(dispatch),
        ),
      }),
      <any>{},
    ),
    ...actionNames.reduce(
      (actionCreators, actionName) => ({
        ...actionCreators,
        [actionName]: wrapActionCreator<CommonConfigType>(
          '', <any>actionTypes, actionName, actionInfos[actionName],
          getRawFuncWrapperForAction(),
          getFinalFuncWrapper(dispatch),
        ),
      }),
      <any>{},
    ),
  };
};
