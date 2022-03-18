// @flow
import '@babel/polyfill';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import api from 'lib/apiClient';
import localForage from 'localforage';
import sagas from './sagas';
import rootReducer from './root.reducer';
import storeSerializer from './store.serializer';
import newApi from 'lib/apiClientNew';

type StoreT = {
  initialState: {},
  middleware: Array<() => void>,
};

declare var postMessage: ({}) => void;
// declare var onmessage: ({}) => void;

const sagaMiddleware = createSagaMiddleware();

const linkMiddleware = (store) => (next) => (action) => {
  if (!action.__origin) {
    action.__origin = 'worker';
    postMessage({ action });
  }
  return next(action);
};

const storage = localForage.createInstance({
  name: 'SalesBox',
});


export const configureStore = ({ initialState, middleware = [] }: StoreT = {}) => {

  const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...[thunk, sagaMiddleware, linkMiddleware].concat(...middleware)))
  );

  sagaMiddleware.run(sagas);
  api.setStore(store);
  newApi.setStore(store);
  return store;
};

let store;

const handleActions = (event: {}): void => {
  const { data } = event;
  if (data.action) {
    store.dispatch(data.action);
  }
};

onmessage = (event) => {
  const { data } = event;
  if (data.state) {
    store = configureStore({
      initialState: data.state,
      middleware: [],
    });
    storeSerializer(store, storage);
    onmessage = handleActions;
  }
};

export default configureStore;
