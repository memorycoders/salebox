// @flow
/* eslint-disable no-param-reassign */
import createReducer from 'store/createReducer';
import UnitActionTypes from 'components/Unit/unit.actions';

export const initialState = {
  lastFetch: {},
  fetching: {},
};

export default createReducer(initialState, {
  [UnitActionTypes.FETCH]: (draft) => {
    draft.fetching.list = false;
    draft.lastFetch.list = Date.now();
  },
  [UnitActionTypes.FETCH_FAIL]: (draft) => {
    draft.fetching.list = false;
  },
  [UnitActionTypes.FETCH_YIELD_CACHE]: (draft) => {
    draft.fetching.list = false;
  },
  [UnitActionTypes.FETCH_REQUEST]: (draft) => {
    draft.fetching.list = true;
  },
});
