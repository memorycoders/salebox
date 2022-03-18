// @flow
import uuid from 'uuid/v4';

const ActionTypes = {
  REGISTER: 'advancedSearch/register',
  SETUP: 'advancedSearch/setup',
  BREAK_DOWN: 'advancedSearch/breakDown',
  SHOW: 'advancedSearch/show',
  HIDE: 'advancedSearch/hide',
  ADD_GROUP: 'advancedSearch/addGroup',
  REMOVE_GROUP: 'advancedSearch/removeGroup',
  ADD_ROW: 'advancedSearch/addRow',
  UPDATE_ROW: 'advancedSearch/updateRow',
  REMOVE_ROW: 'advancedSearch/removeRow',
  SELECT_SAVED: 'advancedSearch/selectSaved',
  GET_SEARCH_INFO: 'advancedSearch/getSearchInfo',
  GET_SEARCH_INFO_FAIL: 'advancedSearch/getSearchInfo/fail',
  GET_SEARCH_INFO_REQUEST: 'advancedSearch/getSearchInfo/request',
  SAVE: 'advancedSearch/save',
  SAVE_FAIL: 'advancedSearch/save/fail',
  SAVE_REQUEST: 'advancedSearch/save/request',
  COPY: 'advancedSearch/copy',
  COPY_FAIL: 'advancedSearch/copy/fail',
  COPY_REQUEST: 'advancedSearch/copy/request',
  SHARE: 'advancedSearch/share',
  SHARE_FAIL: 'advancedSearch/share/fail',
  SHARE_REQUEST: 'advancedSearch/share/request',
  REMOVE: 'advancedSearch/remove',
  REMOVE_FAIL: 'advancedSearch/remove/fail',
  REMOVE_REQUEST: 'advancedSearch/remove/request',
  SET_ACTION: 'advancedSearch/setAction',
  SET_NAME: 'advancedSearch/setName',
  SET_TERM: 'advancedSearch/setTerm',
  SET_TAG: 'advancedSearch/setTag',
  SAVE_SEARCH: 'advancedSearch/saveSearch',
  PERFORM_SEARCH: 'advancedSearch/performSearch',
  SHARE_WITH: 'advancedSearch/shareWith',
  SHARE_WITH_ENTITY: 'advancedSearch/shareWithEntity',
  SET_FILTER: 'advancedSearch/setFilter',
  ENABLE_HISTORY: 'advancedSearch/enableHistory',
  BLOCK_HISTORY: 'advancedSearch/blockHistory',
  SET_ORDERBY: 'advancedSearch/setOrderBy',
  CLEAR_TERM: 'advancedSearh/clearTerm',
  CLEAR_ORDERBY: 'advancedSearh/clearOrderby',
  FETCH_FIELD_VALUE_DROPDOWN: 'advancedSearch/fetchFieldValueDropdown',
  UPDATE_DROPDOWN_VALUE: 'advancedSearch/updateDropdownValue',
  UPDATE_STATUS_FETCHING_DROPDOWN_VALUE: 'advancedSearch/updateStatusFetchingDropdownValue',
  SEND_EMAIL_IN_BATCH: 'advancedSearch/sendEmailInBatch',
  UPDATE_SALE_PROCESS_AND_MODE: 'advancedSearch/updateSaleProcessAndMode',
  UPDATE_SPECIAL_FIELD: 'advancedSearch/updateSpecialField'
};

export const PERFORM_SEARCH = ActionTypes.PERFORM_SEARCH
export const HIDE_SEARCH = ActionTypes.HIDE
export const SELECT_SAVED = ActionTypes.SELECT_SAVED

export const clearTerm = (objectType: string) => ({ type: ActionTypes.CLEAR_TERM, objectType });
export const clearOrderby = (objectType: string) => ({ type: ActionTypes.CLEAR_ORDERBY, objectType });
export const register = (objectType: string) => ({ type: ActionTypes.REGISTER, objectType });
export const show = (objectType: string) => ({ type: ActionTypes.SHOW, objectType });
export const hide = (objectType: string) => ({ type: ActionTypes.HIDE, objectType });
export const setup = (objectType: string) => ({
  type: ActionTypes.SETUP,
  objectType,
  groupId: uuid(),
  rowId: uuid(),
});
export const breakDown = (objectType: string) => ({ type: ActionTypes.BREAK_DOWN, objectType });
export const addGroup = (objectType: string) => ({
  type: ActionTypes.ADD_GROUP,
  objectType,
  groupId: uuid(),
  rowId: uuid(),
});
export const removeGroup = (objectType: string, groupId: string) => ({
  type: ActionTypes.REMOVE_GROUP,
  objectType,
  groupId,
});
export const setAction = (objectType: string, action: string) => ({
  type: ActionTypes.SET_ACTION,
  objectType,
  action,
});
export const addRow = (objectType: string, groupId: string) => ({
  type: ActionTypes.ADD_ROW,
  objectType,
  groupId,
  rowId: uuid(),
});

export const removeRequest = (objectType: string) => ({
  type: ActionTypes.REMOVE_REQUEST,
  objectType,
});
export const remove = (objectType: string, searchId: string) => ({
  type: ActionTypes.REMOVE,
  objectType,
  searchId,
});
export const setName = (objectType: string, name: string) => ({
  type: ActionTypes.SET_NAME,
  objectType,
  name,
});
export const setTerm = (objectType: string, term: string) => ({
  type: ActionTypes.SET_TERM,
  objectType,
  term,
});
export const setTag = (objectType: string, tag: string) => ({
  type: ActionTypes.SET_TAG,
  objectType,
  tag,
});
export const shareWith = (objectType: string, sharedWith: string) => ({
  type: ActionTypes.SHARE_WITH,
  objectType,
  sharedWith,
});
export const performSearch = (objectType: string) => ({
  type: ActionTypes.PERFORM_SEARCH,
  objectType,
});
export const shareWithEntity = (objectType: string, entity: string, selected: Array<string>) => ({
  type: ActionTypes.SHARE_WITH_ENTITY,
  objectType,
  entity,
  selected,
});
export const saveRequest = (objectType: string) => ({
  type: ActionTypes.SAVE_REQUEST,
  objectType,
});
export const save = (objectType: string, data: {}, update: boolean) => ({
  type: ActionTypes.SAVE,
  objectType,
  data,
  update,
});
export const saveFail = (objectType: string) => ({
  type: ActionTypes.SAVE_FAIL,
  objectType,
});
export const copyRequest = (objectType: string) => ({
  type: ActionTypes.COPY_REQUEST,
  objectType,
});
export const copy = (objectType: string, data: {}) => ({
  type: ActionTypes.COPY,
  objectType,
  data,
});
export const copyFail = (objectType: string) => ({
  type: ActionTypes.COPY_FAIL,
  objectType,
});
export const removeFail = (objectType: string, message: string) => ({
  type: ActionTypes.REMOVE_FAIL,
  objectType,
  message,
});
export const shareFail = (objectType: string, message: string) => ({
  type: ActionTypes.SHARE_FAIL,
  objectType,
  message,
});
export const share = (objectType: string, data: {}) => ({
  type: ActionTypes.SHARE,
  objectType,
  data,
});
export const shareRequest = (objectType: string) => ({
  type: ActionTypes.SHARE_REQUEST,
  objectType,
});
export const removeRow = (objectType: string, groupId: string, rowId: string) => ({
  type: ActionTypes.REMOVE_ROW,
  objectType,
  groupId,
  rowId,
});
export const updateRow = (objectType: string, rowId: string, values: string) => ({
  type: ActionTypes.UPDATE_ROW,
  objectType,
  rowId,
  values,
});
export const requestGetSearchInfo = (objectType: string) => ({ type: ActionTypes.GET_SEARCH_INFO_REQUEST, objectType });
export const getSearchInfoFail = (objectType: string, message: string) => ({
  type: ActionTypes.GET_SEARCH_INFO_REQUEST,
  objectType,
  message,
});
export const getSearchInfo = (objectType: string, fields: string, saved: string) => ({
  type: ActionTypes.GET_SEARCH_INFO,
  objectType,
  fields,
  saved,
});
export const selectSaved = (objectType: string, selected: string) => ({
  type: ActionTypes.SELECT_SAVED,
  objectType,
  selected,
});

export const setFilter = (objectType: string, filter: string) => ({
  type: ActionTypes.SET_FILTER,
  objectType,
  filter,
});

export const setOrderBy = (objectType: string, orderBy: string) => ({
  type: ActionTypes.SET_ORDERBY,
  objectType,
  orderBy
});

export const enableHistory = (objectType: string) => ({ type: ActionTypes.ENABLE_HISTORY, objectType });
export const blockHistory = (objectType: string) => ({ type: ActionTypes.BLOCK_HISTORY, objectType });
export const fetchFieldValueDropdown = (rowId: string, objectType: string, fieldType: string) => ({
  type: ActionTypes.FETCH_FIELD_VALUE_DROPDOWN,
  rowId,
  objectType,
  fieldType
})
export const updateDropdownValue = (objectType: string, data: Array, rowId: string) => ({
  type: ActionTypes.UPDATE_DROPDOWN_VALUE,
  objectType,
  data,
  rowId
})
export const updateStatusFetchingDropdownValue = (objectType: string, status: Boolean, rowId: string) => ({
  type: ActionTypes.UPDATE_STATUS_FETCHING_DROPDOWN_VALUE,
  objectType,
  status,
  rowId
})
export const sendEmailInBatch = (data: Object) => ({
  type: ActionTypes.SEND_EMAIL_IN_BATCH,
  data
})
export const updateSalesProcessAndMode = (objectType, salesProcessId, mode) => ({
  type: ActionTypes.UPDATE_SALE_PROCESS_AND_MODE,
  objectType,
  salesProcessId,
  mode
})
export const updateSpecialField = (objectType, field, value) => ({
  type: ActionTypes.UPDATE_SPECIAL_FIELD,
  objectType,
  field,
  value,
})
export default ActionTypes;
