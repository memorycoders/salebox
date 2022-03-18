// @flow

const ActionTypes = {
  FETCH_DROPDOWN_REQUEST: 'tag/fetchDropdown/request',
  FETCH_DROPDOWN_FAIL: 'tag/fetchDropdown/fail',
  FETCH_DROPDOWN: 'tag/fetchDropdown',
};

export const requestFetchDropdown = () => ({ type: ActionTypes.FETCH_DROPDOWN_REQUEST });

export default ActionTypes;
