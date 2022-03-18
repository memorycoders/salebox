// @flow
/* eslint-disable no-param-reassign */
import createReducer from 'store/createReducer';
import MultiRelationActionTypes from './multi-relation.actions';

export const initialState = {
  fetching: {},
  lastFetch: {},
};

export default createReducer(initialState, {
  [MultiRelationActionTypes.FETCH_START]: (draft, { objectType, objectId }) => {
    draft.fetching[objectType] = draft.fetching[objectType] || {};
    draft.fetching[objectType][objectId] = true;
  },
  [MultiRelationActionTypes.FETCH_SUCCESS]: (draft, { objectType, objectId }) => {
    draft.fetching[objectType] = draft.fetching[objectType] || {};
    draft.lastFetch[objectType] = draft.lastFetch[objectType] || {};
    draft.fetching[objectType][objectId] = false;
    draft.lastFetch[objectType][objectId] = Date.now();
  },
  [MultiRelationActionTypes.FETCH_FAIL]: (draft, { objectType, objectId }) => {
    draft.fetching[objectType] = draft.fetching[objectType] || {};
    draft.fetching[objectType][objectId] = false;
  },
});
