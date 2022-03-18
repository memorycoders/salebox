// @flow
/* eslint-disable no-param-reassign */
import createReducer from 'store/createReducer';
import CategoryActions from 'components/Category/category.actions';

export const initialState = {
  dropdownFetching: false,
};

export default createReducer(initialState, {
  [CategoryActions.FETCH_DROPDOWN]: (draft) => {
    draft.dropdownFetching = false;
  },
  [CategoryActions.FETCH_DROPDOWN_FAIL]: (draft) => {
    draft.dropdownFetching = false;
  },
  [CategoryActions.FETCH_DROPDOWN_REQUEST]: (draft) => {
    draft.dropdownFetching = true;
  },
});
