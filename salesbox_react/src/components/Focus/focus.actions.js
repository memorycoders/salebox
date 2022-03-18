// @flow

const ActionTypes = {
  FETCH_DROPDOWN_REQUEST: 'focus/fetchDropdown/request',
  FETCH_DROPDOWN_FAIL: 'focus/fetchDropdown/fail',
  FETCH_DROPDOWN_YIELD_CACHE: 'focus/fetchDropdown/yieldCache',
  FETCH_DROPDOWN: 'focus/fetchDropdown',
  FETCH_ACTIVITY_DROPDOWN_REQUEST: 'focus/fetchActivityDropdown/request',
  FETCH_ACTIVITY_DROPDOWN_YIELD_CACHE: 'focus/fetchActivityDropdown/yieldCache',
  FETCH_ACTIVITY_DROPDOWN_FAIL: 'focus/fetchActivityDropdown/fail',
  FETCH_ACTIVITY_DROPDOWN: 'focus/fetchActivityDropdown',
  SAVE_FOCUS: 'SAVE_FOCUS',
};

export const requestFetchDropdown = (taskId, focusType = 'PROSPECT') => ({
  type: ActionTypes.FETCH_DROPDOWN_REQUEST,
  taskId,
  focusType,
});
export const requestFetchActivityDropdown = () => ({ type: ActionTypes.FETCH_ACTIVITY_DROPDOWN_REQUEST });

export const saveFocus = (name: string, discProfile: string, description: string) => ({
  type: ActionTypes.SAVE_FOCUS,
  name,
  discProfile,
  description,
});
export default ActionTypes;
