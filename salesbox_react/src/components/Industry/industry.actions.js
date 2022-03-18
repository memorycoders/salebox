// @flow
const ActionTypes = {
  FETCH_DROPDOWN_REQUEST: 'industry/fetchDropdown/request',
  FETCH_DROPDOWN_YIELD_CACHE: 'industry/fetchDropdown/yieldCache',
  FETCH_DROPDOWN_FAIL: 'industry/fetchDropdown/fail',
  FETCH_DROPDOWN: 'industry/fetchDropdown',
};

export const requestFetchDropdown = () => ({ type: ActionTypes.FETCH_DROPDOWN_REQUEST });

export default ActionTypes;
