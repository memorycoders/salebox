// @flow
/* eslint-disable no-param-reassign */
import createReducer from 'store/createReducer';
import FocusActions from 'components/Focus/focus.actions';

export const initialState = {
  dropdownFetching: false,
  activityDropdownFetching: false,
};

export default createReducer(initialState, {
  [FocusActions.FETCH_DROPDOWN]: (draft) => {
    draft.dropdownFetching = false;
  },
  [FocusActions.FETCH_DROPDOWN_YIELD_CACHE]: (draft) => {
    draft.dropdownFetching = false;
  },
  [FocusActions.FETCH_DROPDOWN_FAIL]: (draft) => {
    draft.dropdownFetching = false;
  },
  [FocusActions.FETCH_DROPDOWN_REQUEST]: (draft) => {
    draft.dropdownFetching = true;
  },
  [FocusActions.FETCH_ACTIVITY_DROPDOWN]: (draft) => {
    draft.activityDropdownFetching = false;
  },
  [FocusActions.FETCH_ACTIVITY_DROPDOWN_YIELD_CACHE]: (draft) => {
    draft.activityDropdownFetching = false;
  },
  [FocusActions.FETCH_ACTIVITY_DROPDOWN_FAIL]: (draft) => {
    draft.activityDropdownFetching = false;
  },
  [FocusActions.FETCH_ACTIVITY_DROPDOWN_REQUEST]: (draft) => {
    draft.activityDropdownFetching = true;
  },
});
