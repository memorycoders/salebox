// @flow
/* eslint-disable no-param-reassign */
import createReducer from 'store/createReducer';
import TagActions from 'components/Tag/tag.actions';

export const initialState = {
  dropdownFetching: false,
};

export default createReducer(initialState, {
  [TagActions.FETCH_DROPDOWN]: (draft) => {
    draft.dropdownFetching = false;
  },
  [TagActions.FETCH_DROPDOWN_FAIL]: (draft) => {
    draft.dropdownFetching = false;
  },
  [TagActions.FETCH_DROPDOWN_REQUEST]: (draft) => {
    draft.dropdownFetching = true;
  },
});
