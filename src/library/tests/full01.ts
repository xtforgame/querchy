import { Epic, createEpicMiddleware, combineEpics } from 'pure-epic';
import {
  QcAction,
  AnyQueryActionCreatorWithProps,
  ResourceMetadata,
  Merger,
  QcBasicAction,
} from '~/index';

import {
  MyState001,
  MyQcStore001,
  QcModelMap001,
  QcQueryBuilderMap001,
  QcExtraActionCreators001,
  MyQuerchy001,
  MyAxiosRunner001,
  MyCacher001,
  createEpicMiddleware001,
} from './types001';

import {
  basicQueryInfos,
  basicActionInfos,
} from './builtin-t1';

export const crudToRestMap = {
  create: 'post',
  read: 'get',
  update: 'patch',
  delete: 'delete',
  getCollection: 'get',
};

export type EpicMiddlewareCb = (next: Function) => (action: QcAction) => any;

export class MyStore implements MyQcStore001 {
  state: MyState001;
  cacher: MyCacher001;
  epicMiddleware: (store: MyStore) => EpicMiddlewareCb;
  epicMiddlewareCb: EpicMiddlewareCb;
  cb: (action : QcAction) => any;

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
  }

  dispatch = (action : QcAction) => {
    console.log('action.type :', action.type);
    if (action.crudSubType === 'respond') {
      // console.log('action.response.data :', action.response.data);
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
    this.state = this.cacher.reduce(this.getState(), action);
    this.epicMiddlewareCb(() => {})(action);
    // console.log('this.state :', this.state);

    this.cb(action);
  }

  getState = () => this.state;
}

const testRun = (querchy : MyQuerchy001, cacher : MyCacher001, resolve: Function) => {
  const querchyRootEpic = querchy.getRootEpic();
  const cacherRootEpic = cacher.getRootEpic();

  const rootEpic = combineEpics(querchyRootEpic, cacherRootEpic);

  const epicMiddleware = createEpicMiddleware001({
    dependencies: querchy.deps,
  });
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

  const { httpBinRes, httpBinRes2 } = querchy.actionCreatorSets;
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

  store.dispatch(querchy.actionCreatorSets.extra.extraAction1(
    { query: { id: 1 }, headers: { Ppp: 'xxx' } },
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
  return new Promise((resolve) => {
    const querchy = new MyQuerchy001({
      commonConfig: {
        defaultQueryRunner: new MyAxiosRunner001(),
        queryRunners: {
          customRunner: new MyAxiosRunner001(),
        },
        actionTypePrefix: 'XX/',
      },
      models: {
        httpBinRes: {
          url: 'https://httpbin.org',
          buildUrl: action => `https://httpbin.org/${crudToRestMap[action.crudType]}`,
          queryInfos: basicQueryInfos,
          actionInfos: basicActionInfos,
        },
        httpBinRes2: {
          url: 'https://httpbin.org/post',
          queryBuilderName: 'customPath',
          queryInfos: {
            ...basicQueryInfos,
            getCollection: {
              actionCreator: (options?) => ({ options }),
            },
          },
          actionInfos: basicActionInfos,
        },
      },
      queryBuilders: {
        defaultBuilder: {
          buildRequestConfig: (action, { runnerType, commonConfig, models }) => {
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
      extraActionCreators: new QcExtraActionCreators001(),
    });
    const cacher = new MyCacher001(querchy);
    testRun(querchy, cacher, resolve);
  });
};
