import { createEpicMiddleware, combineEpics } from 'pure-epic';
import {
  QcAction,
  AnyQueryActionCreatorWithProps,
  INIT_FUNC,
} from '../index';

import combineReducers from '../redux/combineReducers';

import {
  QuerchyX1,
  AxiosRunnerX1,
  CacherX1,
} from './typesX1';

import {
  StoreX1,
  Types,
} from './typesDefX1';

import CrudT1 from '../features/CrudT1';
import UpdateCacheT1 from '../features/UpdateCacheT1';
import CollectionT1 from '../features/CollectionT1';

export const crudT1 = new CrudT1();
export const updateCacheT1 = new UpdateCacheT1();
export const collectionT1 = new CollectionT1();

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

export type EpicMiddlewareCb = (next: Function) => (action: QcAction) => any;

const rootSliceKey = 'cache';

export class MyStore implements StoreX1 {
  state: Types['StateType'];
  cacher: CacherX1;
  epicMiddleware: (store: MyStore) => EpicMiddlewareCb;
  epicMiddlewareCb: EpicMiddlewareCb;
  cb: (action : QcAction) => any;
  rootReducer: (state: Types['StateType'], action : QcAction) => any;

  constructor(
    cacher : CacherX1,
    epicMiddleware: (store: MyStore) => EpicMiddlewareCb,
    cb: (action : QcAction) => any,
  ) {
    this.state = {};
    this.cacher = cacher;
    this.epicMiddleware = epicMiddleware;
    this.epicMiddlewareCb = this.epicMiddleware(this);
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
    if (action.response) {
      if (action.response.data.headers) {
        // console.log('action.response.data.headers :', action.response.data.headers);
      }
      if (action.response.data.args) {
        // console.log('action.response.data.args :', action.response.data.args);
      }
      // console.log();
    }
    this.state = this.rootReducer(this.getState(), action);
    this.epicMiddlewareCb(() => {})(action);
    if (action.response) {
      console.log('action.queryId :', action.queryId);
      // console.log('this.state[rootSliceKey] :', this.state[rootSliceKey]);
    }

    // const xxxx = this.cacher.selectorSet.httpBinRes2.selectQueryMap(this.state);
    // console.log('xxxx :', xxxx);

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

const testRun = (querchy : QuerchyX1, cacher : CacherX1, resolve: Function) => {
  const querchyRootEpic = querchy.getRootEpic();
  const cacherRootEpic = cacher.getRootEpic();

  const rootEpic = combineEpics(querchyRootEpic, cacherRootEpic);

  const epicMiddleware = createEpicMiddlewareX1();
  const cb = (action : QcAction) => {
    const actionCreator : AnyQueryActionCreatorWithProps = action.actionCreator;
    if (actionCreator) {
      const {
        respond,
        respondError,
        cancel,
      } = querchy.actionCreatorSets.httpBinRes.delete.creatorRefs; // actionCreator.creatorRefs;
      if (
        action.type === cancel.actionType
        || action.type === respond.actionType
        || action.type === respondError.actionType
      ) {
        resolve(1);
      }
    }
  };
  const store = new MyStore(
    cacher,
    epicMiddleware,
    cb,
  );

  const epicMiddlewareCb = store.epicMiddlewareCb;
  epicMiddleware.run(rootEpic);

  const { httpBinRes, httpBinRes2, extra } = querchy.actionCreatorSets;
  store.dispatch(httpBinRes.create(
    {},
    { queryPart: { id: 1 }, headers: { Ppp: 'xxx' } },
  ));
  store.dispatch(httpBinRes.read(
    1,
    { queryPart: { id: 1 }, headers: { Ppp: 'xxx' } },
  ));
  store.dispatch(httpBinRes.update(
    1,
    {},
    { queryPart: { id: 1 }, headers: { Ppp: 'xxx' } },
  ));
  store.dispatch(httpBinRes2.getCollection(
    { queryPart: { id: 1 }, headers: { Ppp: 'xxx' }, queryId: 'getCollection' },
  ));
  store.dispatch(httpBinRes.delete(
    1,
    { queryPart: { id: 1 }, headers: { Ppp: 'xxx' } },
  ));

  store.dispatch(extra.extraQuery1(
    { queryPart: { id: 1 }, headers: { Ppp: 'xxx' } },
  ));
  // epicMiddlewareCb(() => {})({ type: 'CANCEL' });

  setTimeout(
    () => {
      store.dispatch(httpBinRes.read(
        1,
        { queryPart: { id: 1 }, headers: { Ppp: 'xxx' } },
      ));
    },
    5000,
  );

  // const readAction = querchy.actionCreatorSets.httpBinRes.read('ss');
  // console.log('readAction :', readAction);
  // const updateAction = querchy.actionCreatorSets.httpBinRes.update('ss', {});
  // console.log('updateAction :', updateAction);
  // const deleteAction = querchy.actionCreatorSets.httpBinRes.delete('ss');
  // console.log('deleteAction :', deleteAction);
};

export default () => {
  return new Promise((resolve) => {
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
          queryInfos: {
            ...crudT1.getQueryInfos(),
            ...updateCacheT1.getQueryInfos(),
          },
          actionInfos: {
            ...crudT1.getActionInfos(),
            ...updateCacheT1.getActionInfos(),
          },
        },
        httpBinRes2: {
          url: 'https://httpbin.org/get',
          queryBuilderName: 'customPath',
          queryInfos: {
            ...crudT1.getQueryInfos(),
            ...updateCacheT1.getQueryInfos(),
            ...collectionT1.getQueryInfos(),
          },
          actionInfos: {
            ...crudT1.getActionInfos(),
            ...updateCacheT1.getActionInfos(),
            ...collectionT1.getActionInfos(),
            updateCache2: {
              actionCreator: cacheChange => ({ cacheChange }),
              resourceMerger: s => s,
            },
          },
        },
      },
      queryBuilders: {
        defaultBuilder: {
          buildRequestConfig: [
            ({ action, runnerType, commonConfig, models, modelRootState }, next) => {
              if (
                modelRootState.httpBinRes.resourceMap['1']
                && modelRootState.httpBinRes.resourceMap['1'].metadata.lastRequest
                && modelRootState.httpBinRes.resourceMap['1'].metadata.lastRequest.lastResponse
              ) {
                return {
                  overwriteQueryId: action.queryId
                    || modelRootState.httpBinRes.resourceMap['1'].metadata.lastRequest.queryId,
                  fromCache: true,
                  responseFromCache: modelRootState
                    .httpBinRes.resourceMap['1'].metadata.lastRequest.lastResponse,
                };
              }
              return next();
            },
            crudT1.getBuildRequestConfigMiddleware(),
            updateCacheT1.getBuildRequestConfigMiddleware(),
          ],
        },
        customPath: {
          queryRunner: 'customRunner',
          buildRequestConfig: [
            crudT1.getBuildRequestConfigMiddleware(),
            updateCacheT1.getBuildRequestConfigMiddleware(),
            collectionT1.getBuildRequestConfigMiddleware(),
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
                baseSelector(state).httpBinRes.resourceMap,
              )[0] || 'XX';
            };
          },
        },
      },
    });
    testRun(querchy, cacher, resolve);
  });
};
