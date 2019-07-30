import {
  CommonConfig,
  ResourceModel,
  ModelMap,
  QueryCreatorMap,
  QuerchyDefinition,
  QueryCreatorDefinition,
  QcAction,
  QcStartAction,
  QcState,
  QcActionCreator,
  INIT_FUNC,
  InitFunctionKeyType,
  ActionCreatorsInitFunction,
} from './interfaces';

import {
  crudToRestMap,
} from './utils/rest-helpers';

import Querchy from '~/Querchy';
import AxiosRunner from '~/query-runners/AxiosRunner';

export * from './interfaces';
export * from './utils/helper-functions';
export * from './utils/rest-helpers';

export type QcModelMap<
  CommonConfigType extends CommonConfig
> = {
  httpBinRes: ResourceModel<CommonConfigType>;
  [s : string]: ResourceModel<CommonConfigType>;
};

export type QcQueryCreatorMap<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
> = {
  defaultCreator : QueryCreatorDefinition<CommonConfigType, ModelMapType>;
  customPath : QueryCreatorDefinition<CommonConfigType, ModelMapType>;
};

export class QcExtraActionCreators<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<
    CommonConfigType
  >,
  QueryCreatorMapType extends QueryCreatorMap<
    CommonConfigType, ModelMapType
  >,
> {
  [INIT_FUNC] : ActionCreatorsInitFunction;
  [s : string] : QcActionCreator;

  constructor() {
    this[INIT_FUNC] = () => {
      // console.log('constructor()');
    };
  }

  xxxx = (xxx : string, sss : number) : QcAction => {
    return <QcAction>{ type: 'xxxx' };
  }
}

class MyAxiosRunner extends AxiosRunner<
  QcState,
  CommonConfig,
  QcModelMap<CommonConfig>,
  QcQueryCreatorMap<CommonConfig, QcModelMap<CommonConfig>>,
  QcExtraActionCreators<CommonConfig, QcModelMap<CommonConfig>, QcQueryCreatorMap<CommonConfig, QcModelMap<CommonConfig>>>,
  QuerchyDefinition<
    CommonConfig, QcModelMap<CommonConfig>, QcQueryCreatorMap<CommonConfig, QcModelMap<CommonConfig>>,
    QcExtraActionCreators<CommonConfig, QcModelMap<CommonConfig>, QcQueryCreatorMap<CommonConfig, QcModelMap<CommonConfig>>>
  >,
  any
> {}

class MyQuerchy extends Querchy<
  CommonConfig,
  QcModelMap<CommonConfig>,
  QcQueryCreatorMap<CommonConfig, QcModelMap<CommonConfig>>,
  QcExtraActionCreators<
    CommonConfig,
    QcModelMap<CommonConfig>,
    QcQueryCreatorMap<CommonConfig, QcModelMap<CommonConfig>>
  >,
  QuerchyDefinition<
    CommonConfig, QcModelMap<CommonConfig>, QcQueryCreatorMap<CommonConfig, QcModelMap<CommonConfig>>,
    QcExtraActionCreators<
      CommonConfig,
      QcModelMap<CommonConfig>,
      QcQueryCreatorMap<CommonConfig, QcModelMap<CommonConfig>>
    >
  >,
  any
> {}

class MyQcExtraActionCreators extends QcExtraActionCreators<
  CommonConfig,
  QcModelMap<CommonConfig>,
  QcQueryCreatorMap<
    CommonConfig,
    QcModelMap<CommonConfig>
  >
> {}

export default (data : any, err : any) => {
  return new Promise((resolve, reject) => {
    if (err) {
      return reject(err);
    }
    const querchy = new MyQuerchy({
      commonConfig: {
        defaultQueryRunner: new MyAxiosRunner(),
        queryRunners: {
          customRunner: new MyAxiosRunner(),
        },
        queryPrefix: 'XX/',
      },
      models: {
        httpBinRes: {
          url: 'https://httpbin.org/post',
          queryCreator: 'customPath',
        },
      },
      queryCreators: {
        defaultCreator: {
          buildRequestConfig: (action: QcStartAction, { runnerType, commonConfig, models }) => {
            // console.log('action', action);
            if (!action.modelName) {
              return null;
            }
            return ({
              method: crudToRestMap[action.crudType],
              url: models[action.modelName].buildUrl!(action),
              headers: action.options.headers,
              query: action.options.query,
              body: action.data,
            });
          },
        },
        customPath: {
          buildRequestConfig: (action: QcStartAction, { runnerType, commonConfig, models }) => {
            // console.log('action', action);
            if (!action.modelName) {
              return null;
            }
            return ({
              method: crudToRestMap[action.crudType],
              url: `https://httpbin.org/${crudToRestMap[action.crudType]}`,
              headers: action.options.headers,
              query: action.options.query,
              body: action.data,
            });
          },
        },
      },
      extraActionCreators: new MyQcExtraActionCreators(),
    });
    querchy.testRun(resolve, data);
    querchy.actionCreatorSets.extra.xxxx('ddd', 1);
  });
};
