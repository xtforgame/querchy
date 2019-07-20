import {
  CommonConfig,
  ModelMap,
  QueryCreatorMap,
  QuerchyDefinition,
  QcAction,
  QcState,
} from './interfaces';

import Querchy from '~/Querchy';
import AxiosRunner from '~/query-runners/AxiosRunner';

export * from './interfaces';

export default (data : any, err : any) => {
  return new Promise((resolve, reject) => {
    if (err) {
      return reject(err);
    }
    const querchy = new Querchy<
      CommonConfig,
      ModelMap<CommonConfig>,
      QueryCreatorMap<CommonConfig, ModelMap<CommonConfig>>,
      QuerchyDefinition<CommonConfig, ModelMap<CommonConfig>, QueryCreatorMap<CommonConfig, ModelMap<CommonConfig>>>,
      any
    >(
      {
        commonConfig: {
          defaultQueryRunner: new AxiosRunner<
            QcAction,
            QcAction,
            QcState,
            CommonConfig,
            ModelMap<CommonConfig>,
            QueryCreatorMap<CommonConfig, ModelMap<CommonConfig>>,
            QuerchyDefinition<CommonConfig, ModelMap<CommonConfig>, QueryCreatorMap<CommonConfig, ModelMap<CommonConfig>>>,
            any
          >(),
          queryRunners: {
            xxxx: new AxiosRunner<
              QcAction,
              QcAction,
              QcState,
              CommonConfig,
              ModelMap<CommonConfig>,
              QueryCreatorMap<CommonConfig, ModelMap<CommonConfig>>,
              QuerchyDefinition<CommonConfig, ModelMap<CommonConfig>, QueryCreatorMap<CommonConfig, ModelMap<CommonConfig>>>,
              any
            >(),
          },
          queryPrefix: 'XX/',
        },
        models: {},
        queryCreators: {
          first: {
            queryRunner: 'xxxx',
            buildRequestConfig: (runnerType: string, commonConfig) => ({
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
      },
    );
    querchy.testRun(resolve, data);
  });
};
