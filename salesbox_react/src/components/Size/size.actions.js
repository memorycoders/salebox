// @flow

const ActionTypes = {
  FETCH_DROPDOWN_REQUEST: 'size/fetchDropdown/request',
  FETCH_DROPDOWN_FAIL: 'size/fetchDropdown/fail',
  FETCH_DROPDOWN_YIELD_CACHE: 'size/fetchDropdown/yieldCache',
  FETCH_DROPDOWN: 'size/fetchDropdown',
};

export const requestFetchDropdown = () => ({
  type: ActionTypes.FETCH_DROPDOWN_REQUEST,
});

export default ActionTypes;
