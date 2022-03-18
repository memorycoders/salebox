// @flow
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { hibernateStore } from './store.serializer';
import rootReducer from './root.reducer';
import sagas from './sagas';
import appListener from './app.listener';
import localForage from 'localforage';
import SocketMiddleware from '../lib/socket';

export type StoreT = {
  getState: () => {
    auth: {
      token: string,
    },
  },
  dispatch: ({}) => Promise<>,
  runSaga: ({}) => Promise<>,
};

type ConfigureStoreT = {
  initialState?: {},
  middleware?: Array<{}>,
};

const linkMiddleware = (worker) => (store) => (next) => (action) => {
  if (!action.__origin) {
    action.__origin = 'main';
    worker.postMessage({ action });
  }
  return next(action);
};

const setupWorker = () => {
  if (process.browser) {
    const StoreWorker = require('./store.worker.js');
    const worker = new StoreWorker();

    return worker;
  }
  return null;
};

let rootTask;

export const configureStore = ({ initialState = {}, middleware = [] }: ConfigureStoreT = {}): StoreT => {
  let composeEnhancers;
  if (process.env.NODE_ENV === 'development') {
    const reduxDevToolsInstalled =
      typeof window !== 'undefined' && typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function';
    const devtools =
      reduxDevToolsInstalled &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        actionsBlacklist: [],
      });
    composeEnhancers = devtools || compose;
  } else {
    composeEnhancers = compose;
  }

  if (!process.browser) {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
      rootReducer,
      initialState,
      composeEnhancers(applyMiddleware(...[thunk, sagaMiddleware].concat(...middleware)))
    );

    rootTask = sagaMiddleware.run(sagas);
    store.close = () => store.dispatch(END);
    return {
      ...store,
      runSaga: sagaMiddleware.run,
    };
  }
  if (window.store) {
    return new Promise((resolve) => resolve(window.store));
  }
  const storage = localForage.createInstance({
    name: 'SalesBox',
  });
  const worker = setupWorker();

  return hibernateStore(storage, initialState).then((persistedState) => {
    const store = createStore(
      rootReducer,
      persistedState,
      composeEnhancers(applyMiddleware(...[thunk, linkMiddleware(worker), SocketMiddleware()].concat(...middleware)))
    );
    appListener(store);
    worker.postMessage({ state: store.getState() });
    worker.onmessage = (event) => {
      const { data } = event;
      // console.group();
      // const start = Date.now()
      if (data.action) {
        store.dispatch(data.action);
      }
      // const end = Date.now()
      // console.groupEnd();
    };
    return store;
  });
};

export const getRootTask = () => rootTask;

export default configureStore;
