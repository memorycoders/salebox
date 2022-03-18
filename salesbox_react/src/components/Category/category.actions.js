// @flow

const ActionTypes = {
  FETCH_DROPDOWN_REQUEST: 'category/fetchDropdown/request',
  FETCH_DROPDOWN_FAIL: 'category/fetchDropdown/fail',
  FETCH_DROPDOWN: 'category/fetchDropdown',
  SAVE_CATEGORY: 'SAVE_CATEGORY',
};

export const requestFetchDropdown = () => ({ type: ActionTypes.FETCH_DROPDOWN_REQUEST });

export const saveCategory = (enterpriseID: string, token: string, name:string) => ({
  type: ActionTypes.SAVE_CATEGORY,
  enterpriseID,
  token,
  name
});
export default ActionTypes;
