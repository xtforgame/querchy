import { Epic, createEpicMiddleware, combineEpics } from 'pure-epic';
import {
  QcAction,
  AnyQueryActionCreatorWithProps,
} from '~/index';

import {
  MyState001,
  MyQcStore001,
  QcExtraActionCreators001,
  QcModelMap001,
  QcQueryCreatorMap001,
  MyQcExtraActionCreators001,
  MyQuerchy001,
  MyAxiosRunner001,
  MyCacher001,
  createEpicMiddleware001,
} from './types001';

export const crudToRestMap = {
  create: 'post',
  read: 'get',
  update: 'patch',
  delete: 'delete',
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

  const { httpBinRes } = querchy.actionCreatorSets;
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
  store.dispatch(httpBinRes.delete(
    1,
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
        queryPrefix: 'XX/',
      },
      models: {
        httpBinRes: {
          url: 'https://httpbin.org/post',
          crudNames: ['create', 'read', 'update', 'delete'],
          queryCreator: 'customPath',
          queryInfos: {
            create: {
              actionCreator: (data, options?) => ({ data, options }),
            },
            read: {
              actionCreator: (resourceId, options?) => ({ resourceId, options }),
            },
            update: {
              actionCreator: (resourceId, data, options?) => ({ resourceId, data, options }),
            },
            delete: {
              actionCreator: (resourceId, options?) => ({ resourceId, options }),
            },
          },
          actionNames: ['updateCache'],
          actionInfos: {
            updateCache: {
              actionCreator: (cacheChange, options?) => ({ cacheChange, options }),
            },
          },
        },
        httpBinRes2: {
          url: 'https://httpbin.org/post',
          crudNames: ['create', 'read', 'update', 'delete', 'getCollection'],
          queryInfos: {
            create: {
              actionCreator: (data, options?) => ({ data, options }),
            },
            read: {
              actionCreator: (resourceId, options?) => ({ resourceId, options }),
            },
            update: {
              actionCreator: (resourceId, data, options?) => ({ resourceId, data, options }),
            },
            delete: {
              actionCreator: (resourceId, options?) => ({ resourceId, options }),
            },
            getCollection: {
              actionCreator: (options?) => ({ options }),
            },
          },
          actionNames: ['updateCache'],
          actionInfos: {
            updateCache: {
              actionCreator: (cacheChange, options?) => ({ cacheChange, options }),
            },
          },
          queryCreator: 'customPath',
        },
      },
      queryCreators: {
        defaultCreator: {
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
      },
      extraActionCreators: new MyQcExtraActionCreators001(),
    });
    const cacher = new MyCacher001(querchy);
    testRun(querchy, cacher, resolve);
    querchy.actionCreatorSets.extra.xxxx('ddd', 1);
  });
};
