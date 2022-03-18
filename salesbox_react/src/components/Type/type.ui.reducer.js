// @flow
/* eslint-disable no-param-reassign */
import createReducer from 'store/createReducer';
import TypeActionTypes from 'components/Type/type.actions';

export const initialState = {
  dropdownFetching: false,
};

export default createReducer(initialState, {
  [TypeActionTypes.FETCH_DROPDOWN]: (draft) => {
    draft.dropdownFetching = false;
  },
  [TypeActionTypes.FETCH_DROPDOWN_YIELD_CACHE]: (draft) => {
    draft.dropdownFetching = false;
  },
  [TypeActionTypes.FETCH_DROPDOWN_FAIL]: (draft) => {
    draft.dropdownFetching = false;
  },
  [TypeActionTypes.FETCH_DROPDOWN_REQUEST]: (draft) => {
    draft.dropdownFetching = true;
  },
});
