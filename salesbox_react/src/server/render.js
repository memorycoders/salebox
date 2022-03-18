// @flow
import React from 'react';
import type { Saga } from 'redux-saga';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from 'views/App/App';
import reactTreeWalker from 'react-tree-walker';
import { getRootTask } from 'store';
import Html from './components/HTML';

type ReqT = {
  store: {
    getState(): {},
    dispatch({}): Promise<any>,
    runSaga(Saga<void>): { done: Promise<void> },
    close(): void,
  },
  url: string,
  messages: {},
};

type ResT = {
  send: (string) => {},
  locals: {
    assetPath(string): string,
  },
  messages: {},
};

type NextT = (any) => void;

const serverRenderer = () => (req: ReqT, res: ResT, next: NextT) => {
  const context = {};
  const { store } = req;
  const app = (
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </Provider>
  );

  // const promises = [];

  const visitor = (element, instance) => {
    if (instance) {
      if (instance.handlers && typeof instance.handlers.getData === 'function') {
        instance.handlers.getData();
      } else if (typeof instance.getData === 'function') {
        instance.getData();
      }
    }
    return true;
  };

  const finalize = () => {
    const initialData = JSON.stringify({
      state: store.getState(),
      messages: req.messages,
    });
    const content = renderToString(app);

    return res.send(
      renderToString(
        <Html
          css={[res.locals.assetPath('bundle.css'), res.locals.assetPath('vendor.css')]}
          scripts={[res.locals.assetPath('bundle.js'), res.locals.assetPath('vendor.js')]}
          initialData={initialData}
        >
          {content}
        </Html>
      )
    )
  }

  reactTreeWalker(app, visitor)
    .then(() => {
      store.close();
      return getRootTask().done;
    })
    .then(() => finalize())
    .catch((err) => next(err));
};

export default serverRenderer;
