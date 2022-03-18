// @flow

const ActionTypes = {
  FETCH_DROPDOWN_REQUEST: 'type/fetchDropdown/request',
  FETCH_DROPDOWN_FAIL: 'type/fetchDropdown/fail',
  FETCH_DROPDOWN_YIELD_CACHE: 'type/fetchDropdown/yieldCache',
  FETCH_DROPDOWN: 'type/fetchDropdown',
  CONCAT_TYPE: 'type/contactType',
};

export const requestFetchDropdown = () => ({
  type: ActionTypes.FETCH_DROPDOWN_REQUEST,
});

export const concatType = (data) => ({
  type: ActionTypes.CONCAT_TYPE,
  data,
});
export default ActionTypes;
