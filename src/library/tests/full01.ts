import { createEpicMiddleware, combineEpics } from 'pure-epic';
import {
  QcAction,
  AnyQueryActionCreatorWithProps,
  INIT_FUNC,
} from '../index';

import combineReducers from '../redux/combineReducers';

import {
  MyQuerchy001,
  MyAxiosRunner001,
  MyCacher001,
} from './types001';

import {
  MyQcStore001,
  Types,
} from './typesDef001';

import {
  getBasicQueryInfos,
  getBasicActionInfos,
  resMergerForColl,
} from './helpers';

export const crudToRestMap = {
  create: 'post',
  read: 'get',
  update: 'patch',
  delete: 'delete',
  getCollection: 'get',
};

export const createEpicMiddleware001 = (...args : any[]) => createEpicMiddleware<
  QcAction,
  Types['StateType'],
  MyQcStore001,
  any
>(...args);

export type EpicMiddlewareCb = (next: Function) => (action: QcAction) => any;

const rootSliceKey = 'cache';

export class MyStore implements MyQcStore001 {
  state: Types['StateType'];
  cacher: MyCacher001;
  epicMiddleware: (store: MyStore) => EpicMiddlewareCb;
  epicMiddlewareCb: EpicMiddlewareCb;
  cb: (action : QcAction) => any;
  rootReducer: (state: Types['StateType'], action : QcAction) => any;

  constructor(
    cacher : MyCacher001,
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
      console.log('this.state[rootSliceKey] :', this.state[rootSliceKey]);
    }

    // const xxxx = this.cacher.selectorSet.httpBinRes.resourceMapSelector(this.state);
    // console.log('xxxx :', xxxx);

    this.cb(action);
  }

  getState = () => this.state;
}

const testRun = (querchy : MyQuerchy001, cacher : MyCacher001, resolve: Function) => {
  const querchyRootEpic = querchy.getRootEpic();
  const cacherRootEpic = cacher.getRootEpic();

  const rootEpic = combineEpics(querchyRootEpic, cacherRootEpic);

  const epicMiddleware = createEpicMiddleware001();
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
    { query: { id: 1 }, headers: { Ppp: 'xxx' } },
  ));
  store.dispatch(httpBinRes.read(
    1,
    { query: { id: 1 }, headers: { Ppp: 'xxx' } },
  ));
  store.dispatch(httpBinRes.update(
    1,
    {},
    { query: { id: 1 }, headers: { Ppp: 'xxx' } },
  ));
  store.dispatch(httpBinRes2.getCollection(
    { query: { id: 1 }, headers: { Ppp: 'xxx' } },
  ));
  store.dispatch(httpBinRes.delete(
    1,
    { query: { id: 1 }, headers: { Ppp: 'xxx' } },
  ));

  store.dispatch(extra.extraQuery1(
    { query: { id: 1 }, headers: { Ppp: 'xxx' } },
  ));
  // epicMiddlewareCb(() => {})({ type: 'CANCEL' });

  setTimeout(() => {
    store.dispatch(httpBinRes.read(
      1,
      { query: { id: 1 }, headers: { Ppp: 'xxx' } },
    ));
  }, 5000);

  // const readAction = querchy.actionCreatorSets.httpBinRes.read('ss');
  // console.log('readAction :', readAction);
  // const updateAction = querchy.actionCreatorSets.httpBinRes.update('ss', {});
  // console.log('updateAction :', updateAction);
  // const deleteAction = querchy.actionCreatorSets.httpBinRes.delete('ss');
  // console.log('deleteAction :', deleteAction);
};

export default () => {
  return new Promise((resolve) => {
    const querchy = new MyQuerchy001({
      commonConfig: {
        defaultQueryRunner: new MyAxiosRunner001(),
        queryRunners: {
          customRunner: new MyAxiosRunner001(),
        },
        actionTypePrefix: 'QC_ACTS/',
      },
      baseSelector: (s) => {
        return s[rootSliceKey];
      },
      models: {
        httpBinRes: {
          url: 'https://httpbin.org',
          buildUrl: action => `https://httpbin.org/${crudToRestMap[action.crudType]}`,
          queryInfos: getBasicQueryInfos(),
          actionInfos: getBasicActionInfos(),
        },
        httpBinRes2: {
          url: 'https://httpbin.org/post',
          queryBuilderName: 'customPath',
          queryInfos: {
            ...getBasicQueryInfos(),
            getCollection: {
              actionCreator: (options?) => ({ options }),
              resourceMerger: resMergerForColl,
            },
          },
          actionInfos: getBasicActionInfos(),
        },
      },
      queryBuilders: {
        defaultBuilder: {
          buildRequestConfig: (action, { runnerType, commonConfig, models, modelRootState }) => {
            if (
              modelRootState.httpBinRes.resourceMap['1']
              && modelRootState.httpBinRes.resourceMap['1'].metadata.lastRequest
              && modelRootState.httpBinRes.resourceMap['1'].metadata.lastRequest.lastResponse
            ) {
              return {
                fromCache: true,
                responseFromCache: modelRootState
                  .httpBinRes.resourceMap['1'].metadata.lastRequest.lastResponse,
              };
            }

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
          queryRunner: 'customRunner',
          buildRequestConfig: (action, { runnerType, commonConfig, models }) => {
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
        forExtra: {
          queryRunner: 'customRunner',
          buildRequestConfig: (action, { runnerType, commonConfig, models }) => {
            return ({
              method: 'get',
              url: 'https://httpbin.org/get',
              headers: action.options.headers,
              query: action.options.query,
              body: action.data,
            });
          },
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
          updateCacheExtra: {
            actionCreator: (options) => {
              return {
                cacheChange: null,
              };
            },
          },
        },
      },
    });
    const cacher = new MyCacher001(querchy);
    testRun(querchy, cacher, resolve);
  });
};
