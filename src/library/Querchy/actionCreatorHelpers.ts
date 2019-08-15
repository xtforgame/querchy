import {
  ModelActionCreator,
  ResourceModelActions,
} from '~/common/interfaces';

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
} from '~/core/interfaces';

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
    respondError: `${actionType}_ERROR`,
    cancel: `${actionType}_CANCEL`,
  };

  const startFunc : QueryActionCreatorWithProps<
    Function, Function
  > = Object.assign(
    (...args : any[]) => {
      const requestTimestamp = new Date().getTime();
      const requestAction = {
        ...start(...args),
        type: actionType,
        actionCreator: startFunc,
        modelName,
        actionTypes,
        crudType,
        crudSubType: 'start',
        requestTimestamp,
        transferables: {},
      };
      requestAction.transferables = {
        requestTimestamp,
        requestAction,
      };
      return requestAction;
    },
    QueryActionCreatorProps,
    { actionType },
  );

  QueryActionCreatorProps.creatorRefs.start = startFunc;
  QueryActionCreatorProps.creatorRefs.respond = Object.assign(
    (response, responseType, options?) => ({
      type: `${actionType}_RESPOND`,
      actionCreator: QueryActionCreatorProps.creatorRefs.respond,
      response,
      responseType,
      modelName,
      actionTypes,
      crudType,
      crudSubType: <CrudSubType>'respond',
      responseTimestamp: new Date().getTime(),
      requestTimestamp: options
        && options.transferables
        && options.transferables.requestTimestamp,
      transferables: {
        ...options
          && options.transferables
          && options.transferables.requestAction.transferables,
        ...options && options.transferables,
      },
      options,
    }),
    QueryActionCreatorProps,
    { actionType: `${actionType}_RESPOND` },
  );
  QueryActionCreatorProps.creatorRefs.respondError = Object.assign(
    (error, options?) => ({
      type: `${actionType}_ERROR`,
      actionCreator: QueryActionCreatorProps.creatorRefs.respondError,
      error,
      modelName,
      actionTypes,
      crudType,
      crudSubType: <CrudSubType>'respondError',
      errorTimestamp: new Date().getTime(),
      requestTimestamp: options
        && options.transferables
        && options.transferables.requestTimestamp,
      transferables: {
        ...options
          && options.transferables
          && options.transferables.requestAction.transferables,
        ...options && options.transferables,
      },
      options,
    }),
    QueryActionCreatorProps,
    { actionType: `${actionType}_ERROR` },
  );
  QueryActionCreatorProps.creatorRefs.cancel = Object.assign(
    (reason, options?) => ({
      type: `${actionType}_CANCEL`,
      actionCreator: QueryActionCreatorProps.creatorRefs.cancel,
      reason,
      modelName,
      actionTypes,
      crudType,
      crudSubType: <CrudSubType>'cancel',
      cancelTimestamp: new Date().getTime(),
      requestTimestamp: options
        && options.transferables
        && options.transferables.requestTimestamp,
      transferables: {
        ...options
          && options.transferables
          && options.transferables.requestAction.transferables,
        ...options && options.transferables,
      },
      options,
    }),
    QueryActionCreatorProps,
    { actionType: `${actionType}_CANCEL` },
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
