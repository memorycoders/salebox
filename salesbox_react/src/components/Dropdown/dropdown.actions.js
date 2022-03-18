// @flow
const ActionTypes = {
  FETCH_REQUEST: '@dropdown/requestFetch',
  FETCH_START: '@dropdown/startFetch',
  FETCH_SUCCESS: '@dropdown/succeedFetch',
  FETCH_FAIL: '@dropdown/failFetch',
  SET_SEARCH_TERM: '@dropdown/setSearchTerm',
};

export const requestFetch = (objectType: string, searchTerm: string, filter: any) => ({
  type: ActionTypes.FETCH_REQUEST,
  objectType,
  searchTerm,
  filter,
});

export const startFetch = (objectType: string) => ({
  type: ActionTypes.FETCH_START,
  objectType,
});

export const succeedFetch = (objectType: string, entities: {}) => ({
  type: ActionTypes.FETCH_SUCCESS,
  objectType,
  entities,
});

export const failFetch = (objectType: string, error: string) => ({
  type: ActionTypes.FETCH_FAIL,
  objectType,
  error,
});

export const setSearchTerm = (objectType: string, searchTerm: string) => ({
  type: ActionTypes.SET_SEARCH_TERM,
  objectType,
  searchTerm,
});

export default ActionTypes;
