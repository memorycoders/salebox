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

  FETCH_UNQUALIFIED_DETAIL: 'unqualified/fetchUnqualifiedDetail',
  REFESH_UNQUALIFIED_DETAIL: 'unqualified/refeshUnqualifiedDetail',
  FETCH_UNQUALIFIED_DETAIL_SUCCESS: 'lead/fetchUnqualifiedDetailSuccess',

  //DETAIL

  START_FETCH_DETAIL: 'unqualified/startFetchDetail',
  SUCCESS_FETCH_DETAIL: 'unqualified/successFetchDetail',
  // request tasks

  FETCH_TASKS: 'unqualified/fetchTasks',
  FETCH_TASKS_SUCCESS: 'unqualified/fetchTasksSuccess',
  FETCH_SUCCESS: 'unqualified/fetSuccess',

  CREATE_ERRORS_UNQUALIFIED: 'unqualified/createErrors',
  CREATE_ENTITY_UNQUALIFIED: 'unqualified/createEntity',
  CREATE_ENTITY_FETCH: 'unqualified/createFetch',
  CLEAR_CREATE_ENTITY: 'unqualified/clearCreateEntity',
  CLEAR_ERRORS_UNQUALIFIED: 'CLEAR_ERRORS_UNQUALIFIED',
  DELEGATE_UNQUALIFIED: 'unqualified/delegate',
  UPDATE_UNQUALIFIED: 'unqualified/updateUnqualified',
  UPDATE_EDIT_UNQUALIFIED: 'UPDATE_EDIT_UNQUALIFIED',
  UPDATE_ENTITY_FETCH: 'UPDATE_ENTITY_FETCH',
  CHANGE_ON_MULTI_UNQUALIFIED_MENU: 'unqualified/changeOnMultiMenu',
  UPDATE_STATUS_UNQUALIFIED: 'UPDATE_STATUS_UNQUALIFIED',
  SET_UNQUALIFIED_DONE: 'SET_UNQUALIFIED_DONE',
  CLEAR_UPDATE_ENTITY: 'CLEAR_UPDATE_ENTITY',

  DELEGATE_ACCEPT: 'unqualified/delegate/accept',
  DELEGATE_DECLINE: 'unqualified/delegate/decline',

  //RESQUEST FET NOTES
  FETCH_NOTES: 'unqualified/fetchNotes',
  UPDATE_NOTE_ON_LEAD: 'unqualified/updateNoteOnLead',
  DELETE_NOTE_ON_LEAD: 'unqualified/deleteNoteOnLead',
  FETCH_NOTES_SUCCESS: 'unqualified/fetchNotesSuccess',


  DELETE_ROW: 'unqualified/deleteRow',

  //RESQUEST FETCH APPOINTMENT
  FETCH_APPOINTMENTS: 'unqualified/fetchAppointments',
  FETCH_APPOINTMENTS_SUCCESS: 'unqualified/fetchAppointmentsSuccess',
  UPDATE_CREATE_ENTITY: 'unqualified/UPDATE_CREATE_ENTITY',
  UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_CONTACT: 'unqualified/UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_CONTACT',
  UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_COMPANY: 'unqualified/UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_COMPANY',

};


export const requestFetchAppointments = (unqualifiedDealId, history, orderBy) => ({
  type: ActionTypes.FETCH_APPOINTMENTS,
  unqualifiedDealId,
  history,
  orderBy
});

export const deleteNote = (noteId) => ({
  type: ActionTypes.DELETE_NOTE_ON_LEAD,
  noteId
});

export const updateNoteOnLead = (noteId, note, subject) => ({
  type: ActionTypes.UPDATE_NOTE_ON_LEAD,
  noteId, note, subject
});

export const succeedFetchNotes = (unqualifiedDealId: string, notes) => ({
  type: ActionTypes.FETCH_NOTES_SUCCESS,
  unqualifiedDealId,
  notes,
});
//succeedFetchAppointments

export const succeedFetchAppointments = (unqualifiedDealId: string, appointments) => ({
  type: ActionTypes.FETCH_APPOINTMENTS_SUCCESS,
  unqualifiedDealId,
  appointments,
});

export const requestFetchNotes = (unqualifiedDealId) => ({
  type: ActionTypes.FETCH_NOTES,
  unqualifiedDealId,
});

export const succeedFetchTasks = (unqualifiedDealId: string, data: {}) => ({
  type: ActionTypes.FETCH_TASKS_SUCCESS,
  unqualifiedDealId,
  ...data,
});

export const requestFetchTasks = (unqualifiedDealId, history, tag, orderBy) => ({
  type: ActionTypes.FETCH_TASKS,
  unqualifiedDealId,
  history,
  tag,
  orderBy
});

export const fetchUnqualifiedDetail = (unqualifiedDealId, isRefesh = true) => ({
  type: ActionTypes.FETCH_UNQUALIFIED_DETAIL,
  unqualifiedDealId,
  isRefesh
});

export const refeshUnqualifiedDetail = (actionType) => ({
  type: ActionTypes.REFESH_UNQUALIFIED_DETAIL,
  actionType
});

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

export const fetchAccountOnCallList = (callListAccountId: string) => ({
  type: ActionTypes.FETCH_ACCOUNT_ON_CALL_LIST,
  callListAccountId,
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
export const delegateUnqualified = (userId: string, uuid: sting, overviewType: string) => ({
  type: ActionTypes.DELEGATE_UNQUALIFIED,
  userId,
  uuid,
  overviewType,
});
export const updateUnqualified = (uuid: string, updateData: {}) => ({
  type: ActionTypes.UPDATE_UNQUALIFIED,
  uuid,
  updateData,
});

export const createErros = (data) => ({
  type: ActionTypes.CREATE_ERRORS_UNQUALIFIED,
  data,
});

export const createEntity = (formKey: string, data: any) => ({
  type: ActionTypes.CREATE_ENTITY_UNQUALIFIED,
  formKey,
  data,
});

export const createEntityFetch = (overviewType) => ({
  type: ActionTypes.CREATE_ENTITY_FETCH,
  overviewType
});

export const clearCreateEntity = () => ({
  type: ActionTypes.CLEAR_CREATE_ENTITY,
});

export const clearErrors = () => ({
  type: ActionTypes.CLEAR_ERRORS_UNQUALIFIED,
});

export const updateEdit = (data: any) => {
  return {
    type: ActionTypes.UPDATE_EDIT_UNQUALIFIED,
    data,
  };
};

export const updateEntityFetch = (overviewType) => ({
  type: ActionTypes.UPDATE_ENTITY_FETCH,
  overviewType,
});
export const changeOnMultiMenu = (option, optionValue, overviewType) => ({
  type: ActionTypes.CHANGE_ON_MULTI_UNQUALIFIED_MENU,
  option,
  optionValue,
  overviewType,
});

export const setUnqualifiedDone = (overviewType, uuid) => ({
  type: ActionTypes.SET_UNQUALIFIED_DONE,
  overviewType,
  uuid,
});

export const updateStatusUnqualifiedDeal = (overviewType, uuid, status) => ({
  type: ActionTypes.UPDATE_STATUS_UNQUALIFIED,
  overviewType,
  uuid,
  status,
});

export const delegateAccept = (userId: string, uuid: sting, overviewType: string, accepted: boolean) => ({
  type: ActionTypes.DELEGATE_ACCEPT,
  userId,
  uuid,
  overviewType,
  accepted,
});

export const delegateDecline = (userId: string, uuid: sting, overviewType: string, accepted: boolean) => ({
  type: ActionTypes.DELEGATE_DECLINE,
  userId,
  uuid,
  overviewType,
  accepted,
});
export const deleteRow = (overviewType: string, itemId: string) => ({
  type: ActionTypes.DELETE_ROW,
  overviewType,
  itemId,
});
export const clearUpdateEntity = () => ({
  type: ActionTypes.CLEAR_UPDATE_ENTITY,
});
// export const updateCreateUnqualified = (uuid: string, updateData: {}) => ({
//   type: ActionTypes.UPDATE_CREATE_ENTITY,
//   uuid,
//   updateData,
// });
export const updateCreateEntityUnqualified = (data, overviewType) => ({
  type: ActionTypes.UPDATE_CREATE_ENTITY,
  data,
  overviewType
});

export const updateCreateEditEntityAfterAddContact= (companyId,contactId) =>({
  type: ActionTypes.UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_CONTACT,
  companyId,contactId
})
export const updateCreateEditEntityAfterAddCompany= (companyId) =>({
  type: ActionTypes.UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_COMPANY,
  companyId
})

export default ActionTypes;
