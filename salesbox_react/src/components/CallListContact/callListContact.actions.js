// @flow

const ActionTypes = {
  // FETCH_ORGANISATION_DROPDOWN_REQUEST: 'contact/fetchDropdownForOrganisation/request',
  // FETCH_ORGANISATION_DROPDOWN_FAIL: 'contact/fetchDropdownForOrganisation/fail',
  // FETCH_ORGANISATION_DROPDOWN: 'contact/fetchDropdownForOrganisation',
  FETCH_CALL_LIST_CONTACT_REQUEST: 'contact/fetchContact/request',
  FETCH_CALL_LIST_CONTACT_FAIL: 'contact/fetchContact/fail',
  FETCH_CALL_LIST_CONTACT_START: 'contact/fetchContact/start',
  FETCH_CALL_LIST_CONTACT_SUCCESS: 'contact/fetchContact/success',
  // FETCH_COLLEAGUE_REQUEST: 'contact/fetchColleague/request',
  // FETCH_COLLEAGUE_FAIL: 'contact/fetchColleague/fail',
  // FETCH_COLLEAGUE_START: 'contact/fetchColleague/start',
  // FETCH_COLLEAGUE_SUCCESS: 'contact/fetchColleague/success',
  UPDATE: 'callListContact/update',
  // ADD_PHONE: 'contact/addPhone',
  // REMOVE_PHONE: 'contact/removePhone',
  // UPDATE_PHONE: 'contact/updatePhone',
  // MAKE_PHONE_MAIN: 'contact/makePhoneMain',
  // ADD_EMAIL: 'contact/addEmail',
  // REMOVE_EMAIL: 'contact/removeEmail',
  // UPDATE_EMAIL: 'contact/updateEmail',
  // MAKE_EMAIL_MAIN: 'contact/makeEmailMain',
  // CREATE_COLLEAGUE: 'contact/createColleague',
  // EDIT_CONTACT: 'contact/editContact',

  GET_CONTACT_ON_CALL_LIST: 'callListAccount/getContactOnCallList',
  GET_CONTACT_ON_CALL_LIST_SUCCESS: 'callListAccount/getContactOnCallListSuccess',
  GET_CONTACT_ON_CALL_LIST_FAILURE: 'callListAccount/getContactOnCallListFailure',
  ADD_EDIT_CONTACT_CALLLIST: 'callListContact/addEditCallList',
  FILTER_CONTACT_CALLLIST_SUBLIST: 'callListContact/filterSublist',
  DELETE_ROW_SUCCESS_CONTACT_ON_SUB_LIST: 'callListContact/deleteRowSuccessOnSublist',
  CHANGE_ON_MULTI_CALLLIST_CONTACT: 'callListContact/changeOnMultiCallList',
  DELETE_CONTACT_CALLLIST: 'callListContact/deleteCallListContact',
  ADD_CONTACT_TO_CALLLIST: 'callListContact/addContactToCallListContact',
  UPDATE_CALLLIST_CONTACT_BY_ID: 'callListContact/updateCallListContactById',
  SET_CONTACT : 'callListContact/setContact',
  REMOVE_CONTACT_FROM_CALLLIST_CONTACT: 'callListContact/removeContactFromCallListContact',
  REMOVE_CONTACT_FROM_CALLLIST_CONTACT_SUCCESS: 'callListContact/removeContactFromCallListContactSuccess',
  CLEAR_CREATE_ENTITY: 'callListContact/clearCreateEntity',

  STORE_NEW_VALUE: 'callListContact/storeNewValue',
  CLEAR_STORE_NEW_VALUE: 'callListContact/clearStoreNewValue',

};

// export const requestFetchDropdownForOrganisation = (organisationId: string, searchField: string) => ({
//   type: ActionTypes.FETCH_ORGANISATION_DROPDOWN_REQUEST,
//   organisationId,
//   searchField,
// });
//

//
// export const createColleague = (callListContactId: string) => ({
//   type: ActionTypes.CREATE_COLLEAGUE,
//   callListContactId,
// });
//
// export const editCallListContact = (callListContactId: string) => ({
//   type: ActionTypes.EDIT_CONTACT,
//   callListContactId,
// });

export const requestFetchCallListContact = (callListContactId: string) => ({
  type: ActionTypes.FETCH_CALL_LIST_CONTACT_REQUEST,
  callListContactId,
});

export const startFetchCallListContact = (callListContactId: string) => ({
  type: ActionTypes.FETCH_CALL_LIST_CONTACT_START,
  callListContactId,
});

export const failFetchCallListContact = (callListContactId: string) => ({
  type: ActionTypes.FETCH_CALL_LIST_CONTACT_FAIL,
  callListContactId,
});

export const succeedFetchCallListContact = (callListContactId: string, data: {}) => ({
  type: ActionTypes.FETCH_CALL_LIST_CONTACT_SUCCESS,
  callListContactId,
  ...data,
});
export const getContactOnCallList = (callListContactId: string, pageIndex, orderBy) => ({
  type: ActionTypes.GET_CONTACT_ON_CALL_LIST,
  callListContactId,
  pageIndex,
  orderBy
});

export const getContactOnCallListSuccess = (callListContactId: string, data: {}) => ({
  type: ActionTypes.GET_CONTACT_ON_CALL_LIST_SUCCESS,
  callListContactId,
  ...data,
});

export const getContactOnCallListFailure = (callListContactId: string, data: {}) => ({
  type: ActionTypes.GET_CONTACT_ON_CALL_LIST_FAILURE,
  callListContactId,
  ...data,
});

//
export const update = (callListContactId: string, updateData: {}) => ({
  type: ActionTypes.UPDATE,
  callListContactId,
  updateData,
});

export const addEditContactCallList = (isCreate, overviewType) => ({
  type: ActionTypes.ADD_EDIT_CONTACT_CALLLIST,
  isCreate
  , overviewType
});
//
// export const addPhone = (callListContactId) => ({
//   type: ActionTypes.ADD_PHONE,
//   callListContactId,
// });
//
// export const removePhone = (callListContactId, phoneId) => ({
//   type: ActionTypes.REMOVE_PHONE,
//   callListContactId,
//   phoneId,
// });
//
// export const makePhoneMain = (callListContactId, phoneId) => ({
//   type: ActionTypes.MAKE_PHONE_MAIN,
//   callListContactId,
//   phoneId,
// });
//
// export const updatePhone = (callListContactId, phoneId, values) => ({
//   type: ActionTypes.UPDATE_PHONE,
//   callListContactId,
//   phoneId,
//   values,
// });
//
// export const addEmail = (callListContactId) => ({
//   type: ActionTypes.ADD_EMAIL,
//   callListContactId,
// });
//
// export const removeEmail = (callListContactId, emailId) => ({
//   type: ActionTypes.REMOVE_EMAIL,
//   callListContactId,
//   emailId,
// });
//
// export const makeEmailMain = (callListContactId, emailId) => ({
//   type: ActionTypes.MAKE_EMAIL_MAIN,
//   callListContactId,
//   emailId,
// });
//
// export const updateEmail = (callListContactId, emailId, values) => ({
//   type: ActionTypes.UPDATE_EMAIL,
//   callListContactId,
//   emailId,
//   values,
// });
//
// export const requestFetchColleague = (callListContactId: string) => ({
//   type: ActionTypes.FETCH_COLLEAGUE_REQUEST,
//   callListContactId,
// });
//
// export const startFetchColleague = (callListContactId: string) => ({
//   type: ActionTypes.FETCH_COLLEAGUE_START,
//   callListContactId,
// });
//
// export const failFetchColleague = (callListContactId: string) => ({
//   type: ActionTypes.FETCH_COLLEAGUE_FAIL,
//   callListContactId,
// });
//
// export const succeedFetchColleague = (callListContactId: string, data: {}) => ({
//   type: ActionTypes.FETCH_COLLEAGUE_SUCCESS,
//   callListContactId,
//   ...data,
// });
export const filterSublistContactCalllist = (callListContactId, tagFilter) => ({
  type: ActionTypes.FILTER_CONTACT_CALLLIST_SUBLIST,
  callListContactId,
  tagFilter,
});

export const deleteRowSuccessContactOnSubList = (callListContactId,contactId: string) => ({
  type: ActionTypes.DELETE_ROW_SUCCESS_CONTACT_ON_SUB_LIST,
  callListContactId,
  contactId,
});

export const changeOnMultiMenu = (option, optionValue, overviewType) => ({
  type: ActionTypes.CHANGE_ON_MULTI_CALLLIST_CONTACT,
  option,
  optionValue,
  overviewType,
});

export const deleteContactCallList = (callListId, overviewType) => ({
  type: ActionTypes.DELETE_CONTACT_CALLLIST,
  callListId,
  overviewType
});

export const addContactToCallListContact = (callListId, contacts) => ({
  type: ActionTypes.ADD_CONTACT_TO_CALLLIST,
  callListId,
  contacts
});
export const updateCallListContactById = (callList) => ({
  type: ActionTypes.UPDATE_CALLLIST_CONTACT_BY_ID,
  callList
});
export const setContact = (overviewType: string, itemId: string) => ({
  type: ActionTypes.SET_CONTACT,
  overviewType,
  itemId,
});
export const removeContactFromCallListContact = (contactId, callListContactId) => ({
  type: ActionTypes.REMOVE_CONTACT_FROM_CALLLIST_CONTACT,
  contactId,
  callListContactId
});

export const removeContactFromCallListContactSuccess = (contactId, callListContactId) => ({
  type: ActionTypes.REMOVE_CONTACT_FROM_CALLLIST_CONTACT_SUCCESS,
  contactId,
  callListContactId
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
