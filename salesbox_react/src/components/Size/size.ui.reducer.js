// @flow
/* eslint-disable no-param-reassign */
import createReducer from 'store/createReducer';
import SizeActionTypes from 'components/Size/size.actions';

export const initialState = {
  dropdownFetching: false,
};

export default createReducer(initialState, {
  [SizeActionTypes.FETCH_DROPDOWN]: (draft) => {
    draft.dropdownFetching = false;
  },
  [SizeActionTypes.FETCH_DROPDOWN_YIELD_CACHE]: (draft) => {
    draft.dropdownFetching = false;
  },
  [SizeActionTypes.FETCH_DROPDOWN_FAIL]: (draft) => {
    draft.dropdownFetching = false;
  },
  [SizeActionTypes.FETCH_DROPDOWN_REQUEST]: (draft) => {
    draft.dropdownFetching = true;
  },
});
