// @flow
/* eslint-disable no-param-reassign */
import createReducer from 'store/createReducer';
import UserActions from './user.actions';

const initialState = {
  lastFetch: {},
  fetching: {},
};

export default createReducer(initialState, {
  [UserActions.FETCH_LIST]: (draft) => {
    draft.lastFetch.lists = Date.now();
    draft.fetching.lists = false;
  },
  [UserActions.FETCH_LIST_FAIL]: (draft) => {
    draft.fetching.lists = false;
  },
  [UserActions.FETCH_LIST_REQUEST]: (draft) => {
    draft.fetching.lists = true;
  },
});
