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

// https://stackoverflow.com/questions/50011616/typescript-change-function-type-so-that-it-returns-new-value
type ArgumentTypes<T> = T extends (... args: infer U ) => infer R ? U: never;
type ReplaceReturnType<T, TNewReturn> = (...a: ArgumentTypes<T>) => TNewReturn;
type WithOptional = ReplaceReturnType<(n?: number) => string, Promise<string>>;

interface ActionCreators {
  a: (s : string) => any;
  [s : string] : (...args) => string;
}

type Y<T extends { [s : string] : (...args) => string }> = {
  [P in keyof T] : ReplaceReturnType<T[P], Promise<string>> & {pp : string};
};

const testx = () => {
  const wrapActionCreator : (actionCreators : ActionCreators) => Y<ActionCreators> = () => { return <any>null; };

  const x = wrapActionCreator({
    a: (dd : string) => 's',
  });
  x.a.pp = '';
};

type Y2<T extends { [s : string] : ActionCreators }> = {
  [P in keyof T] : ReplaceReturnType<T[P]['a'], Promise<string>> & {pp : string};
};

interface ActionCreatorsx {
  a: ActionCreators;
  [s : string] : ActionCreators;
}

const testxx = () => {
  const wrapActionCreator : (actionCreatorsx : ActionCreatorsx) => Y2<ActionCreatorsx> = () => { return <any>null; };

  const x = wrapActionCreator({
    a: {
      a: (dd : string) => 's',
    },
  });
  x.a('s');
};

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
