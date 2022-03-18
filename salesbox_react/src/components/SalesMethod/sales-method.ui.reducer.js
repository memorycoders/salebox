// @flow
/* eslint-disable no-param-reassign */
import createReducer from 'store/createReducer';
import SalesMethodActions from 'components/SalesMethod/sales-method.actions';

export const initialState = {
  dropdownFetching: false,
};

export default createReducer(initialState, {
  [SalesMethodActions.FETCH_DROPDOWN]: (draft) => {
    draft.dropdownFetching = false;
  },
  [SalesMethodActions.FETCH_DROPDOWN_YIELD_CACHE]: (draft) => {
    draft.dropdownFetching = false;
  },
  [SalesMethodActions.FETCH_DROPDOWN_FAIL]: (draft) => {
    draft.dropdownFetching = false;
  },
  [SalesMethodActions.FETCH_DROPDOWN_REQUEST]: (draft) => {
    draft.dropdownFetching = true;
  },
});
