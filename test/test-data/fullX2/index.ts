import { createEpicMiddleware, combineEpics } from 'pure-epic';
import {
  QcAction,
  AnyQueryActionCreatorWithProps,
  INIT_FUNC,
  createQuerchyMiddleware,

  SUCCESS_ACTION,
  SUCCESS_CALLBACK,
  PASS_ANYWAY,
  createFeatureGroup,
} from 'library';

import combineReducers from 'library/redux/combineReducers';

import {
  QuerchyX1,
  AxiosRunnerX1,
  CacherX1,

  StoreX1,
  Types,
} from './typesX1';

import CrudT1 from 'library/features/CrudT1';
import UpdateCacheT1 from 'library/features/UpdateCacheT1';
import CollectionT1 from 'library/features/CollectionT1';

export const crudT1 = new CrudT1();
export const updateCacheT1 = new UpdateCacheT1();
export const collectionT1 = new CollectionT1();

export const crudUpdateCacheT1 = createFeatureGroup(
  crudT1,
  updateCacheT1,
);

export const crudUpdateCacheCollectionT1 = createFeatureGroup(
  crudUpdateCacheT1,
  collectionT1,
);
// // or use this way
// export const crudUpdateCacheCollectionT1 = createFeatureGroup(
//   crudT1,
//   updateCacheT1,
//   collectionT1,
// );

export const crudToRestMap = {
  create: 'post',
  read: 'get',
  update: 'patch',
  delete: 'delete',
  getCollection: 'get',
};

export const createEpicMiddlewareX1 = (...args : any[]) => createEpicMiddleware<
  QcAction,
  Types['StateType'],
  StoreX1,
  any
>(...args);

export const createQuerchyMiddlewareX1 = (...args : any[]) => createQuerchyMiddleware<
  QcAction,
  Types['StateType'],
  StoreX1
>(...args);

export type EpicMiddlewareCb = (next: Function) => (action: QcAction) => any;
export type QuerchyMiddlewareCb = (next: Function) => (action: QcAction) => any;

const rootSliceKey = 'cache';

export class MyStore implements StoreX1 {
  state: Types['StateType'];
  cacher: CacherX1;
  epicMiddleware: (store: MyStore) => EpicMiddlewareCb;
  querchyMiddleware: (store: MyStore) => QuerchyMiddlewareCb;
  epicMiddlewareCb: EpicMiddlewareCb;
  querchyMiddlewareCb: QuerchyMiddlewareCb;
  cb: (action : QcAction) => any;
  rootReducer: (state: Types['StateType'], action : QcAction) => any;

  constructor(
    cacher : CacherX1,
    epicMiddleware: (store: MyStore) => EpicMiddlewareCb,
    querchyMiddleware: (store: MyStore) => QuerchyMiddlewareCb,
    cb: (action : QcAction) => any,
  ) {
    this.state = {};
    this.cacher = cacher;
    this.epicMiddleware = epicMiddleware;
    this.epicMiddlewareCb = this.epicMiddleware(this);
    this.querchyMiddleware = querchyMiddleware;
    this.querchyMiddlewareCb = this.querchyMiddleware(this);
    this.cb = cb;
    this.rootReducer = combineReducers({
      [rootSliceKey]: this.cacher.rootReducer,
    });
  }

  dispatch = (action : QcAction) => {
    console.log('action.type :', action.type);
    if (action.crudSubType === 'respond') {
      // console.log('action.response.data :', action.response.data);
    } else if (action.crudSubType === 'respondError') {
      // console.log('action :', action);
    }
    if (action.response && action.response.data) {
      if (action.response.data.headers) {
        // console.log('action.response.data.headers :', action.response.data.headers);
      }
      if (action.response.data.args) {
        // console.log('action.response.data.args :', action.response.data.args);
      }
      // console.log();
    }
    this.state = this.rootReducer(this.getState(), action);
    this.epicMiddlewareCb(() => this.querchyMiddlewareCb(() => {})(action))(action);
    if (action.response) {
      // console.log('action.queryId :', action.queryId);
      // console.log('this.state[rootSliceKey] :', this.state[rootSliceKey]);
    }

    // const xxxx = this.cacher.selectorSet.httpBinRes.selectResourceMapValues(this.state);
    // console.log('xxxx :', xxxx);

    const xxxxx = this.cacher.selectorSet.httpBinRes2.xxxx(this.state);
    console.log('xxxxx :', xxxxx);

    const selectedForHttpBinResExtra = this.cacher.selectorSet
      .httpBinRes.extraSelectorX1(this.state);
    console.log('selectedForHttpBinResExtra :', selectedForHttpBinResExtra);

    const selectedForHttpBinResExtra2 = this.cacher.selectorCreatorSet
      .httpBinRes.extraSelectorX1()(this.state);
    console.log('selectedForHttpBinResExtra2 :', selectedForHttpBinResExtra2);

    this.cb(action);
  }

  getState = () => this.state;
}

const testRun = (querchy : QuerchyX1, cacher : CacherX1) => {
  const querchyRootEpic = querchy.getRootEpic();
  const cacherRootEpic = cacher.getRootEpic();

  const rootEpic = combineEpics(querchyRootEpic, cacherRootEpic);

  const epicMiddleware = createEpicMiddlewareX1();
  const querchyMiddleware = createQuerchyMiddlewareX1();
  const cb = (action : QcAction) => {
    const actionCreator : AnyQueryActionCreatorWithProps = action.actionCreator;
    if (actionCreator) {
      const {
        respond,
        respondError,
        cancel,
      } = querchy.actionCreatorSets.httpBinRes.delete.creatorRefs; // actionCreator.creatorRefs;
    }
  };
  const store = new MyStore(
    cacher,
    epicMiddleware,
    querchyMiddleware,
    cb,
  );

  const epicMiddlewareCb = store.epicMiddlewareCb;
  epicMiddleware.run(rootEpic);

  const { httpBinRes, httpBinRes2, extra } = querchy.promiseActionCreatorSets;
  return httpBinRes.create(
    {},
    { queryPart: { id: 1 }, headers: { Ppp: 'xxx' } },
  )
  .then(() => httpBinRes.read(
    1,
    { queryPart: { id: 1 }, headers: { Ppp: 'xxx' } },
  ))
  .then(() => httpBinRes.update(
    1,
    {},
    { queryPart: { id: 1 }, headers: { Ppp: 'xxx' } },
  ))
  .then(() => httpBinRes.updateCache(
    '1',
    { queryPart: { id: 1 }, headers: { Ppp: 'xxx' } },
  ))
  .then(() => httpBinRes.clearAllCache())
  .then(() => httpBinRes.read(
    1,
    {
      queryPart: { id: 1 },
      headers: { Ppp: 'xxx' },
      actionProps: {
        // [SUCCESS_ACTION]: PASS_ANYWAY,
        [SUCCESS_CALLBACK]: (a) => {
          // console.log('a :', a);
          // console.log('==============a============ :', a);
          // console.log('a :', a);
        },
      },
    },
  ))
  .then(() => httpBinRes2.getCollection(
    { queryPart: { id: 1 }, headers: { Ppp: 'xxx' }, queryId: 'getCollection' },
  ))
  .then(() => extra.extraQuery1(
    { queryPart: { id: 1 }, headers: { Ppp: 'xxx' } },
  ))
  .then(() => httpBinRes.delete(
    1,
    { queryPart: { id: 1 }, headers: { Ppp: 'xxx' } },
  ));
  // epicMiddlewareCb(() => {})({ type: 'CANCEL' });

  // const readAction = querchy.actionCreatorSets.httpBinRes.read('ss');
  // console.log('readAction :', readAction);
  // const updateAction = querchy.actionCreatorSets.httpBinRes.update('ss', {});
  // console.log('updateAction :', updateAction);
  // const deleteAction = querchy.actionCreatorSets.httpBinRes.delete('ss');
  // console.log('deleteAction :', deleteAction);
};

export default () => {
  const querchy = new QuerchyX1({
    commonConfig: {
      // defaultBuildUrl: (modelBaseUrl, action) => {
      //   if (action.crudType === 'create') {
      //     return modelBaseUrl;
      //   }
      //   return `${modelBaseUrl}/${action.id}`;
      // },
      defaultBuildUrl: (
        modelBaseUrl,
        action,
      ) => `${modelBaseUrl}/${crudToRestMap[action.crudType]}`,
      defaultQueryRunner: new AxiosRunnerX1(),
      queryRunners: {
        customRunner: new AxiosRunnerX1(),
      },
      actionTypePrefix: 'QC_ACTS/',
    },
    baseSelector: (s) => {
      return s[rootSliceKey];
    },
    models: {
      httpBinRes: {
        url: 'https://httpbin.org',
        buildUrl: (modelBaseUrl, action) => `${modelBaseUrl}/${crudToRestMap[action.crudType]}`,
        queryInfos: {},
        actionInfos: {},
        feature: crudUpdateCacheT1,
        featureDeps: {
          getId: (action) => {
            return (
              action.response
              && action.response.data
              && action.response.data.args
              && action.response.data.args.id
            );
          },
        },
      },
      httpBinRes2: {
        url: 'https://httpbin.org/get',
        queryBuilderName: 'customPath',
        queryInfos: {},
        actionInfos: {
          updateCache2: {
            actionCreator: cacheChange => ({ cacheChange }),
            resourceMerger: s => s,
          },
        },
        feature: crudUpdateCacheCollectionT1,
        featureDeps: {
          getId: (action) => {
            return (
              action.response
              && action.response.data
              && action.response.data.args
              && action.response.data.args.id
            );
          },
          parseResponse: (s, action) => ({
            update: {
              '1': action.response.data,
              '2': action.response.data,
            },
          }),
        },
      },
    },
    queryBuilders: {
      defaultBuilder: {
        buildRequestConfig: [
          ({ action, runnerType, commonConfig, models, modelRootState, requestConfig }, next) => {
            const resourceId : string = action.resourceId;
            const modelName = action.modelName;
            if (
              resourceId && modelName
              && modelRootState[modelName].resourceMap.metadata[resourceId]
              && modelRootState[modelName].resourceMap.metadata[resourceId].lastUpdate
              && modelRootState[modelName].resourceMap.metadata[resourceId].lastUpdate!.updateData
            ) {
              return {
                overwriteQueryId: resourceId,
                fromCache: true,
                responseFromCache: modelRootState
                  [modelName].resourceMap.metadata[resourceId].lastUpdate!.updateData,
              };
            }
            return next(requestConfig);
          },
          crudUpdateCacheT1.getBuildRequestConfigMiddleware(),
        ],
      },
      customPath: {
        queryRunner: 'customRunner',
        buildRequestConfig: [
          crudUpdateCacheCollectionT1.getBuildRequestConfigMiddleware(),
        ],
      },
      forExtra: {
        queryRunner: 'customRunner',
        buildRequestConfig: [
          ({ action, runnerType, commonConfig, models }, next) => {
            let overwriteQueryId : any = action.queryId;
            if (!overwriteQueryId) {
              if (action.resourceId) {
                overwriteQueryId = `${action.crudType}?resourceId=${action.resourceId}`;
              } else {
                overwriteQueryId = action.crudType;
              }
            }
            return {
              overwriteQueryId,
              method: 'get',
              url: 'https://httpbin.org/get',
              headers: action.options.headers,
              query: action.options.queryPart,
              body: action.data,
            };
          },
        ],
      },
    },
    extraActionCreators: {
      [INIT_FUNC]: (models) => {
        // console.log('models :', models);
      },
      queryInfos: {
        extraQuery1: {
          actionCreator: (options?) => ({ options }),
          queryBuilderName: 'forExtra',
          globalMerger: (s) => {
            // delete s.httpBinRes.resourceMap['1'];
            delete s.httpBinRes.resourceMap['2'];
            delete s.httpBinRes2.resourceMap['1'];
            delete s.httpBinRes2.resourceMap['2'];
            // console.log('===================== s :', s);
            return s;
          },
        },
      },
      actionInfos: {
        extraAction1: {
          actionCreator: (options) => {
            return {
              cacheChange: null,
            };
          },
        },
      },
    },
  });
  const cacher = new CacherX1(querchy, {
    httpBinRes: {
      extraSelectorX1: {
        creatorCreator: (baseSelector) => {
          return () => (state) => {
            return Object.keys(
              baseSelector(state).httpBinRes.resourceMap.values,
            )[0] || 'XX';
          };
        },
      },
    },
  });
  return testRun(querchy, cacher);
};
