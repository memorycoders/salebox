// @flow

const ActionTypes = {
  FETCH_DROPDOWN_REQUEST: 'salesMethod/fetchDropdown/request',
  FETCH_DROPDOWN_FAIL: 'salesMethod/fetchDropdown/fail',
  FETCH_DROPDOWN_YIELD_CACHE: 'salesMethod/fetchDropdown/yieldCache',
  FETCH_DROPDOWN: 'salesMethod/fetchDropdown',
  DELETE_SALES_METHOD: 'c'
};

export const deleteSalesMethod = (id) => {
  return {
    type: ActionTypes.DELETE_SALES_METHOD,
    id
  }
}
export const requestFetchDropdown = () => ({
  type: ActionTypes.FETCH_DROPDOWN_REQUEST,
});

export default ActionTypes;
