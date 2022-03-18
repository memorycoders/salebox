// @flow

const ActionTypes = {
  FETCH_ORGANISATION_DROPDOWN_REQUEST: 'callListAccount/fetchDropdownForOrganisation/request',
  FETCH_ORGANISATION_DROPDOWN_FAIL: 'callListAccount/fetchDropdownForOrganisation/fail',
  FETCH_ORGANISATION_DROPDOWN: 'callListAccount/fetchDropdownForOrganisation',
  FETCH_CALL_LIST_ACCOUNT_REQUEST: 'callListAccount/fetchCallListAccount/request',
  FETCH_CALL_LIST_ACCOUNT_FAIL: 'callListAccount/fetchCallListAccount/fail',
  FETCH_CALL_LIST_ACCOUNT_START: 'callListAccount/fetchCallListAccount/start',
  FETCH_CALL_LIST_ACCOUNT_SUCCESS: 'callListAccount/fetchCallListAccount/success',
  FETCH_COLLEAGUE_REQUEST: 'callListAccount/fetchColleague/request',
  FETCH_COLLEAGUE_FAIL: 'callListAccount/fetchColleague/fail',
  FETCH_COLLEAGUE_START: 'callListAccount/fetchColleague/start',
  FETCH_COLLEAGUE_SUCCESS: 'callListAccount/fetchColleague/success',
  UPDATE: 'callListAccount/update',
  ADD_PHONE: 'callListAccount/addPhone',
  REMOVE_PHONE: 'callListAccount/removePhone',
  UPDATE_PHONE: 'callListAccount/updatePhone',
  MAKE_PHONE_MAIN: 'callListAccount/makePhoneMain',
  ADD_EMAIL: 'callListAccount/addEmail',
  REMOVE_EMAIL: 'callListAccount/removeEmail',
  UPDATE_EMAIL: 'callListAccount/updateEmail',
  MAKE_EMAIL_MAIN: 'callListAccount/makeEmailMain',
  CREATE_COLLEAGUE: 'callListAccount/createColleague',
  EDIT_CALL_LIST_ACCOUNT: 'callListAccount/editCallListAccount',
  FETCH_ACCOUNT_ON_CALL_LIST: 'callListAccount/fetchAccountOnCallList',
  FETCH_ACCOUNT_ON_CALL_LIST_SUCCESS: 'callListAccount/fetchAccountOnCallListSuccess',
  FETCH_ACCOUNT_ON_CALL_LIST_FAILURE: 'callListAccount/fetchAccountOnCallListFailure',
  FETCH_CALL_LIST_ACCOUNT_BY_HISTORY: 'callListAccount/fetchCallListAccountByHistory',
  FETCH_CALL_LIST_ACCOUNT_BY_HISTORY_SUCCESS: 'callListAccount/fetchCallListAccountByHistorySuccess',
  FETCH_CALL_LIST_ACCOUNT_BY_HISTORY_FAILURE: 'callListAccount/fetchCallListAccountByHistoryFailure',
  FILTER_ACCOUNT_CALLLIST_SUBLIST: 'callListAccount/filterSublist',
  ADD_EDIT_ACCOUNT_CALLLIST: 'callListAccount/addEditCallList',
  DELETE_ACCOUNT_CALLLIST: 'callListAccount/deleteAccountCallList',
  ADD_ACCOUNT_TO_CALLLIST: 'callListAccount/addAccountToCalllist',
  CHANGE_ON_MULTI_CALLLIST_ACCOUNT: 'callListAccount/changeOnMultiCallList',
  REMOVE_ACCOUNT_FROM_CALLLIST_ACCOUNT: 'callListAccount/removeAccountFromCallListAccount',
  REMOVE_ACCOUNT_FROM_CALLLIST_ACCOUNT_SUCCESS: 'callListAccount/removeAccountFromCallListAccountSuccess',
  DELETE_ROW_SUCCESS_CONTACT_ON_SUB_LIST: 'callListAccount/deleteRowSuccessOnSublist',
  UPDATE_CALLLIST_ACCOUNT_BY_ID: 'callListAccount/updateCallListAccountById',
  SET_ACCOUNT : 'callListAccount/setAccount',
  CLEAR_CREATE_ENTITY: 'callListAccount/clearCreateEntity',
  STORE_NEW_VALUE: 'callListAccount/storeNewValue',
  CLEAR_STORE_NEW_VALUE: 'callListAccount/clearStoreNewValue',
};

export const requestFetchDropdownForOrganisation = (organisationId: string, searchField: string) => ({
  type: ActionTypes.FETCH_ORGANISATION_DROPDOWN_REQUEST,
  organisationId,
  searchField,
});

export const requestFetchCallListAccount = (callListAccountId: string) => ({
  type: ActionTypes.FETCH_CALL_LIST_ACCOUNT_REQUEST,
  callListAccountId,
});

export const createColleague = (callListAccountId: string) => ({
  type: ActionTypes.CREATE_COLLEAGUE,
  callListAccountId,
});

export const editCallListAccount = (callListAccountId: string) => ({
  type: ActionTypes.EDIT_CALL_LIST_ACCOUNT,
  callListAccountId,
});

export const startFetchCallListAccount = (callListAccountId: string) => ({
  type: ActionTypes.FETCH_CALL_LIST_ACCOUNT_START,
  callListAccountId,
});

export const failFetchCallListAccount = (callListAccountId: string) => ({
  type: ActionTypes.FETCH_CALL_LIST_ACCOUNT_FAIL,
  callListAccountId,
});

export const succeedFetchCallListAccount = (callListAccountId: string, data: {}) => ({
  type: ActionTypes.FETCH_CALL_LIST_ACCOUNT_SUCCESS,
  callListAccountId,
  ...data,
});

export const update = (callListAccountId: string, updateData: {}) => ({
  type: ActionTypes.UPDATE,
  callListAccountId,
  updateData,
});

export const addPhone = (callListAccountId) => ({
  type: ActionTypes.ADD_PHONE,
  callListAccountId,
});

export const removePhone = (callListAccountId, phoneId) => ({
  type: ActionTypes.REMOVE_PHONE,
  callListAccountId,
  phoneId,
});

export const makePhoneMain = (callListAccountId, phoneId) => ({
  type: ActionTypes.MAKE_PHONE_MAIN,
  callListAccountId,
  phoneId,
});

export const updatePhone = (callListAccountId, phoneId, values) => ({
  type: ActionTypes.UPDATE_PHONE,
  callListAccountId,
  phoneId,
  values,
});

export const addEmail = (callListAccountId) => ({
  type: ActionTypes.ADD_EMAIL,
  callListAccountId,
});

export const removeEmail = (callListAccountId, emailId) => ({
  type: ActionTypes.REMOVE_EMAIL,
  callListAccountId,
  emailId,
});

export const makeEmailMain = (callListAccountId, emailId) => ({
  type: ActionTypes.MAKE_EMAIL_MAIN,
  callListAccountId,
  emailId,
});

export const updateEmail = (callListAccountId, emailId, values) => ({
  type: ActionTypes.UPDATE_EMAIL,
  callListAccountId,
  emailId,
  values,
});

export const requestFetchColleague = (callListAccountId: string) => ({
  type: ActionTypes.FETCH_COLLEAGUE_REQUEST,
  callListAccountId,
});

export const startFetchColleague = (callListAccountId: string) => ({
  type: ActionTypes.FETCH_COLLEAGUE_START,
  callListAccountId,
});

export const failFetchColleague = (callListAccountId: string) => ({
  type: ActionTypes.FETCH_COLLEAGUE_FAIL,
  callListAccountId,
});

export const succeedFetchColleague = (callListAccountId: string, data: {}) => ({
  type: ActionTypes.FETCH_COLLEAGUE_SUCCESS,
  callListAccountId,
  ...data,
});

export const fetchAccountOnCallList = (callListAccountId: string, orderBy: string, pageIndex) => ({
  type: ActionTypes.FETCH_ACCOUNT_ON_CALL_LIST,
  callListAccountId,
  orderBy,
  pageIndex,
});

export const fetchAccountOnCallListSuccess = (callListAccountId: string, data: {}) => {
  return {
    type: ActionTypes.FETCH_ACCOUNT_ON_CALL_LIST_SUCCESS,
    callListAccountId,
    ...data,
  };
};

export const fetchAccountOnCallListFailure = (callListAccountId: string) => ({
  type: ActionTypes.FETCH_ACCOUNT_ON_CALL_LIST_FAILURE,
  callListAccountId,
});

export const fetchCallListAccountByHistory = () => ({
  type: ActionTypes.FETCH_CALL_LIST_ACCOUNT_BY_HISTORY,
});

export const fetchCallListAccountByHistorySuccess = (data: {}) => {
  return {
    type: ActionTypes.FETCH_CALL_LIST_ACCOUNT_BY_HISTORY_SUCCESS,
    ...data,
  };
};

export const fetchCallListAccountByHistoryFailure = () => ({
  type: ActionTypes.FETCH_CALL_LIST_ACCOUNT_BY_HISTORY_FAILURE,
});

export const filterSublistAccountCalllist = (callListAccountId, tagFilter) => ({
  type: ActionTypes.FILTER_ACCOUNT_CALLLIST_SUBLIST,
  callListAccountId,
  tagFilter,
});

export const addEditAccountCallList = (isCreate) => ({
  type: ActionTypes.ADD_EDIT_ACCOUNT_CALLLIST,
  isCreate
});

export const addAccountToCalllist = (callListId, numberAdded) => ({
  type: ActionTypes.ADD_ACCOUNT_TO_CALLLIST,
  callListId,
  numberAdded
});

export const deleteAccountCallList = (callListId, overviewType) => ({
  type: ActionTypes.DELETE_ACCOUNT_CALLLIST,
  callListId,
  overviewType
});

export const setAccount = (overviewType: string, itemId: string) => ({
  type: ActionTypes.SET_ACCOUNT,
  overviewType,
  itemId,
});

export const changeOnMultiMenu = (option, optionValue, overviewType) => ({
  type: ActionTypes.CHANGE_ON_MULTI_CALLLIST_ACCOUNT,
  option,
  optionValue,
  overviewType,
});

export const removeAccountFromCallListAccount = (accountId, callListAccountId) => ({
  type: ActionTypes.REMOVE_ACCOUNT_FROM_CALLLIST_ACCOUNT,
  accountId,
  callListAccountId
});

export const removeAccountFromCallListAccountSuccess = (accountId, callListAccountId) => ({
  type: ActionTypes.REMOVE_ACCOUNT_FROM_CALLLIST_ACCOUNT_SUCCESS,
  accountId,
  callListAccountId
})
export const deleteRowSuccessContactOnSubList = (callListAccountId, organisationId: string) => ({
  type: ActionTypes.DELETE_ROW_SUCCESS_CONTACT_ON_SUB_LIST,
  callListAccountId,
  organisationId,
});

export const updateCallListAccountById = (callList) => ({
  type: ActionTypes.UPDATE_CALLLIST_ACCOUNT_BY_ID,
  callList
})
export const clearCreateEntity = (ownerId) => ({
  type: ActionTypes.CLEAR_CREATE_ENTITY,
  ownerId
});

export const storeNewValue = (callListAccount) => ({
  type: ActionTypes.STORE_NEW_VALUE,
  callListAccount
});
export const clearStoreNewValue = () => ({
  type: ActionTypes.CLEAR_STORE_NEW_VALUE,
});

export default ActionTypes;
