// @flow

const ActionTypes = {
  FETCH_REQUEST: 'unit/fetch/request',
  FETCH_FAIL: 'unit/fetch/fail',
  FETCH_YIELD_CACHE: 'unit/fetch/yieldCache',
  FETCH: 'unit/fetch',
};

export const requestFetch = () => ({
  type: ActionTypes.FETCH_REQUEST,
});

export const fetchYieldCache = () => ({
  type: ActionTypes.FETCH_YIELD_CACHE,
});

export const fetch = (data) => ({
  type: ActionTypes.FETCH,
  ...data,
});

export const fetchFail = (error: string) => ({
  type: ActionTypes.FETCH_FAIL,
  error,
});

export default ActionTypes;
