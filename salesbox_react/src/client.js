// @flow
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
// import createHistory from 'history/createBrowserHistory';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
// import { BrowserRouter } from 'react-router-dom';
import App from 'views/App/App';
import { configureStore } from 'store';
import 'imported';
import { rehydrateMarks } from 'react-imported-component';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import api from 'lib/apiClient';
import newApi from 'lib/apiClientNew';
import * as AppActions from 'components/App/app.actions';

const history = window.browserHistory || createBrowserHistory();
const middleware = routerMiddleware(history);
// const initialData = window.__INITIAL_DATA__ ? window.__INITIAL_DATA__ : {};
// const history = createHistory();

const middlewares = [
  middleware
];

if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);
  middlewares.push(logger);
}

configureStore({
  initialState: {},
  middleware: middlewares,
}).then((store) => {
  api.setStore(store);
  newApi.setStore(store);
  const app = (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  );

  rehydrateMarks().then(() => {
    render(app, document.getElementById('app'));
    store.dispatch(AppActions.init());
    // store.dispatch({ type: 'SOCKETS_CONNECT' });
    // store.dispatch(AppActions.redraw());
  });

  if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
      module.hot.accept();
    }

    if (!window.store || !window.browserHistory) {
      window.browserHistory = history;
      window.store = store;
    }
  }
});

// function noop() { }
// if (process.env.NODE_ENV === 'development') {
//   console.log = noop;
//   console.warn = noop;
//   console.error = noop;
// }

