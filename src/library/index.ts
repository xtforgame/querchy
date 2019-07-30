import {
  CommonConfig,
  ResourceModel,
  ModelMap,
  QueryCreatorMap,
  QuerchyDefinition,
  QueryCreatorDefinition,
  QcAction,
  QcState,
  QcActionCreator,
  INIT_FUNC,
  InitFunctionKeyType,
  ActionCreatorsInitFunction,
} from './interfaces';

import Querchy from '~/Querchy';
import AxiosRunner from '~/query-runners/AxiosRunner';

export * from './interfaces';

export type QcModelMap<
  CommonConfigType extends CommonConfig
> = {
  httpBinRes: ResourceModel<CommonConfigType>;
  // [s : string] : any;
};

export type QcQueryCreatorMap<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
> = {
  defaultCreator : QueryCreatorDefinition<CommonConfigType, ModelMapType>;
  customCreate : QueryCreatorDefinition<CommonConfigType, ModelMapType>;
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
          queryCreator: 'customCreate',
        },
      },
      queryCreators: {
        defaultCreator: {
          buildRequestConfig: (action: QcAction, runnerType: string, commonConfig) => ({
            method: 'post',
            url: 'https://httpbin.org/post',
            query: {
              queryKey1: 1,
            },
            body: {
              dataKey1: 1,
            },
          }),
        },
        customCreate: {
          buildRequestConfig: (action: QcAction, runnerType: string, commonConfig) => ({
            method: 'post',
            url: 'https://httpbin.org/post',
            query: {
              queryKey1: 1,
            },
            body: {
              dataKey1: 1,
            },
          }),
        },
      },
      extraActionCreators: new MyQcExtraActionCreators(),
    });
    querchy.testRun(resolve, data);
    querchy.actionCreatorSets.extra.xxxx('ddd', 1);
  });
};
