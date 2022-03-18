// @flow
/* eslint-disable no-param-reassign */
import createReducer from 'store/createReducer';
import IndustryActions from 'components/Industry/industry.actions';

export const initialState = {
  dropdownFetching: false,
};

export default createReducer(initialState, {
  [IndustryActions.FETCH_DROPDOWN]: (draft) => {
    draft.dropdownFetching = false;
  },
  [IndustryActions.FETCH_DROPDOWN_YIELD_CACHE]: (draft) => {
    draft.dropdownFetching = false;
  },
  [IndustryActions.FETCH_DROPDOWN_FAIL]: (draft) => {
    draft.dropdownFetching = false;
  },
  [IndustryActions.FETCH_DROPDOWN_REQUEST]: (draft) => {
    draft.dropdownFetching = true;
  },
});
