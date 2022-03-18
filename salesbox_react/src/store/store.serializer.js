//@flow
import merge from 'lodash.merge';

const blacklisted = {
  auth: true,
  router: false,
  form: true,
  ui: false,
  dashboard: true,
  entities: true,
  overview: true,
  dropdown: false,
  search: false,
  period: false,
  settings: false,
  profile: false,
  wizard: true,
  remember: false
};

export const hibernateStore = (storage, initialState) => {
  const keys = Object.keys(blacklisted).filter((key) => !blacklisted[key]);

  const promises = keys.map((key) => storage.getItem(key));
  const persistedState = {
    ...initialState,
  };
  return Promise.all(promises).then((result) => {
    for (let i = 0; i < result.length; i++) {
      const key = keys[i];
      persistedState[key] = merge(persistedState[key], result[i]);
    }
    return persistedState;
  });
};

export default (store, storage) => {
  let currentState = {};
  let timer = null;

  const persistStore = () => {
    const previousState = { ...currentState};
    currentState = store.getState();

    Object.keys(currentState).forEach(async (key) => {
      if (!blacklisted[key] && previousState[key] !== currentState[key]) {
        await storage.setItem(key, currentState[key], async ()=> {
          const data = await storage.getItem(key)
        });
      }
    });
  };

  const unsubscribe = store.subscribe(() => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      persistStore();
    }, 100);
  });
};

