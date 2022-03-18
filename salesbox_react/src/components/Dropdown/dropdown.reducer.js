// @flow
/* eslint-disable no-param-reassign */
import createReducer from 'store/createReducer';
import DropdownActionTypes from 'components/Dropdown/dropdown.actions';
import AuthActionTypes from 'components/Auth/auth.actions';
export const createTemplate = () => ({
  lastFetch: 0,
  isFetching: false,
  pristine: true,
  searchTerm: null,
});

const ensureDropdown = (draft, objectType) => {
  if (!draft[objectType]) {
    draft[objectType] = createTemplate();
  }
  return draft[objectType];
};

export const initialState = {};

export default createReducer(initialState, {
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },
  [DropdownActionTypes.FETCH_REQUEST]: (draft, { objectType, searchTerm }) => {
    const dropdown = ensureDropdown(draft, objectType);
    dropdown.searchTerm = searchTerm;
  },
  [DropdownActionTypes.FETCH_START]: (draft, { objectType }) => {
    const dropdown = ensureDropdown(draft, objectType);
    dropdown.isFetching = true;
  },
  [DropdownActionTypes.SET_SEARCH_TERM]: (draft, { objectType, searchTerm }) => {
    const dropdown = ensureDropdown(draft, objectType);
    dropdown.searchTerm = searchTerm;
  },
  [DropdownActionTypes.FETCH_SUCCESS]: (draft, { objectType }) => {
    const dropdown = ensureDropdown(draft, objectType);
    dropdown.isFetching = false;
    dropdown.pristine = false;
    dropdown.lastFetch = new Date();
  },
  [DropdownActionTypes.FETCH_FAIL]: (draft, { objectType }) => {
    const dropdown = ensureDropdown(draft, objectType);
    dropdown.isFetching = false;
  },
  [DropdownActionTypes.SET_SEARCH_TERM]: (draft, { objectType, searchTerm }) => {
    const dropdown = ensureDropdown(draft, objectType);
    dropdown.searchTerm = searchTerm;
  },
});
