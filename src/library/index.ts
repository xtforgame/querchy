import { Action } from 'pure-epic';
import {
  CommonConfig,
  ModelMap,
  QueryCreatorMap,
  QuerchyDefinition,
  QueryCreatorDefinition,
  QcAction,
  QcState,
  QcActionCreator,
} from './interfaces';

import Querchy from '~/Querchy';
import AxiosRunner from '~/query-runners/AxiosRunner';

export * from './interfaces';

export type QueryCreatorMapXxxx<
  Input extends Action,
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<Input, CommonConfigType>
> = {
  first : QueryCreatorDefinition<Input, CommonConfigType, ModelMapType>;
  postHttpBin : QueryCreatorDefinition<Input, CommonConfigType, ModelMapType>;
};

export interface ExtraActionCreatorsXxxx<
  ActionType extends Action,
> {
  xxxx : (xxx : string, sss : number) => ActionType;
  [s : string] : QcActionCreator<ActionType>;
}

export default (data : any, err : any) => {
  return new Promise((resolve, reject) => {
    if (err) {
      return reject(err);
    }
    const querchy = new Querchy<
      QcAction,
      CommonConfig,
      ModelMap<QcAction, CommonConfig>,
      QueryCreatorMapXxxx<QcAction, CommonConfig, ModelMap<QcAction, CommonConfig>>,
      QuerchyDefinition<QcAction, CommonConfig, ModelMap<QcAction, CommonConfig>, QueryCreatorMapXxxx<QcAction, CommonConfig, ModelMap<QcAction, CommonConfig>>>,
      ExtraActionCreatorsXxxx<QcAction>,
      any
    >(
      {
        commonConfig: {
          defaultQueryRunner: new AxiosRunner<
            QcAction,
            QcAction,
            QcState,
            CommonConfig,
            ModelMap<QcAction, CommonConfig>,
            QueryCreatorMapXxxx<QcAction, CommonConfig, ModelMap<QcAction, CommonConfig>>,
            QuerchyDefinition<QcAction, CommonConfig, ModelMap<QcAction, CommonConfig>, QueryCreatorMapXxxx<QcAction, CommonConfig, ModelMap<QcAction, CommonConfig>>>,
            any
          >(),
          queryRunners: {
            xxxx: new AxiosRunner<
              QcAction,
              QcAction,
              QcState,
              CommonConfig,
              ModelMap<QcAction, CommonConfig>,
              QueryCreatorMapXxxx<QcAction, CommonConfig, ModelMap<QcAction, CommonConfig>>,
              QuerchyDefinition<QcAction, CommonConfig, ModelMap<QcAction, CommonConfig>, QueryCreatorMapXxxx<QcAction, CommonConfig, ModelMap<QcAction, CommonConfig>>>,
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
          postHttpBin: {
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
    // querchy.actionCreators.xxxx()
  });
};
