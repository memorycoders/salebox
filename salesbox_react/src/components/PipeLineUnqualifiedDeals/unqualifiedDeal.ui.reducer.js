// @flow
/* eslint-disable no-param-reassign */
import createReducer from 'store/createReducer';
import ContactActionTypes from 'components/CallListAccount/callListAccount.actions';

export const initialState = {
  dropdownFetching: false,
  lastFetch: {},
  fetching: {},
};

export default createReducer(initialState, {
  [ContactActionTypes.FETCH_DROPDOWN]: (draft) => {
    draft.dropdownFetching = false;
  },
  [ContactActionTypes.FETCH_DROPDOWN_FAIL]: (draft) => {
    draft.dropdownFetching = false;
  },
  [ContactActionTypes.FETCH_DROPDOWN_START]: (draft) => {
    draft.dropdownFetching = true;
  },
  [ContactActionTypes.FETCH_CONTACT]: (draft, { contact }) => {
    draft.lastFetch[contact] = Date.now();
    draft.fetching[contact] = false;
  },
  [ContactActionTypes.FETCH_CONTACT_FAIL]: (draft, { contact }) => {
    draft.fetching[contact] = false;
  },
  [ContactActionTypes.FETCH_CONTACT_REQUEST]: (draft, { contact }) => {
    draft.fetching[contact] = true;
  },
});
