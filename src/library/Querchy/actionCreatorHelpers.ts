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
} from '~/core/interfaces';

export const createModelActionTypes = <
  CommonConfigType extends CommonConfig,
  ResourceModelType extends ResourceModel<CommonConfigType>
>(
  modelName : string,
  commonConfig : CommonConfigType,
  model: ResourceModelType,
) : Required<ResourceModelType['actionTypes']> => {
  const { queryPrefix = '' } = commonConfig;
  const crudNames = model.crudNames!;
  const actionNames = model.actionNames!;
  return <Required<ResourceModelType['actionTypes']>><any>actionNames.reduce(
    (actionTypes, actionName) => ({
      ...actionTypes,
      [actionName]: commonConfig.getActionTypeName!(queryPrefix, `${modelName}_${actionName}`),
    }),
    crudNames.reduce(
      (actionTypes, crudType) => ({
        ...actionTypes,
        [crudType]: commonConfig.getActionTypeName!(queryPrefix, `${modelName}_${crudType}`),
      }),
      {},
    ),
  );
};

const createModelAction = <
  CommonConfigType extends CommonConfig,
  ResourceModelType extends ResourceModel<CommonConfigType>
>(
  modelName : string,
  actionTypes : Required<ResourceModelType['actionTypes']>,
  actionName: string,
  start : Function,
) : ModelActionCreator<Function> => {
  const startFunc : ModelActionCreator<Function> = <any>Object.assign(
    (...args : any[]) => {
      const requestTimestamp = new Date().getTime();
      const requestAction = {
        ...start(...args),
        type: actionTypes[actionName]!,
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
    { actionType: actionTypes[actionName] },
  );
  return startFunc;
};

const createModelCrudAction = <
  CommonConfigType extends CommonConfig,
  ResourceModelType extends ResourceModel<CommonConfigType>
>(
  modelName : string,
  actionTypes : Required<ResourceModelType['actionTypes']>,
  crudType: CrudType,
  start : Function,
) : QueryActionCreatorWithProps<
  Function, Function
> => {
  const QueryActionCreatorProps : QueryActionCreatorProps<
    Function
  > = <any>{
    creatorRefs: {},
  };

  const startFunc : QueryActionCreatorWithProps<
    Function, Function
  > = Object.assign(
    (...args : any[]) => {
      const requestTimestamp = new Date().getTime();
      const requestAction = {
        ...start(...args),
        type: actionTypes[crudType]!,
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
    { actionType: actionTypes[crudType] },
  );

  QueryActionCreatorProps.creatorRefs.start = startFunc;
  QueryActionCreatorProps.creatorRefs.respond = Object.assign(
    (response, responseType, options?) => ({
      type: `${actionTypes[crudType]}_RESPOND`,
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
    { actionType: `${actionTypes[crudType]}_RESPOND` },
  );
  QueryActionCreatorProps.creatorRefs.respondError = Object.assign(
    (error, options?) => ({
      type: `${actionTypes[crudType]}_ERROR`,
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
    { actionType: `${actionTypes[crudType]}_ERROR` },
  );
  QueryActionCreatorProps.creatorRefs.cancel = Object.assign(
    (reason, options?) => ({
      type: `${actionTypes[crudType]}_CANCEL`,
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

  return actionNames.reduce(
    (actionCreators, actionName) => {
      const actionInfo = actionInfos[actionName] || [];
      const func = createModelAction<
        CommonConfigType, ResourceModelType
      >(
        modelName, actionTypes, actionName, actionInfo.actionCreator,
      );
      return {
        ...actionCreators,
        [actionName]: func,
      };
    },
    <any>crudNames.reduce(
      (actionCreators, crudType) => {
        const queryInfo = queryInfos[crudType] || [];
        const func = createModelCrudAction<
          CommonConfigType, ResourceModelType
        >(
          modelName, actionTypes, crudType, queryInfo.actionCreator,
        );
        return {
          ...actionCreators,
          [crudType]: func,
        };
      },
      <any>{},
    ),
  );
};
