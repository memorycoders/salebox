// @flow
const ActionTypes = {
  // DropDown
  FETCH_ORGANISATION_DROPDOWN_REQUEST: 'contact/fetchDropdownForOrganisation/request',
  FETCH_ORGANISATION_DROPDOWN_FAIL: 'contact/fetchDropdownForOrganisation/fail',
  FETCH_ORGANISATION_DROPDOWN: 'contact/fetchDropdownForOrganisation',

  // Create
  CREATE_REQUEST: 'contact/add/request',
  CREATE_SUCCESS: 'contact/add/success',

  // Update
  UPDATE_REQUEST: 'contact/update/request',
  UPDATE_SUCCESS: 'contact/update/success',
  // Update

  // Deactivate
  DEACTIVATE_REQUEST: 'contact/deactivate/request',
  DEACTIVATE_SUCCESS: 'contact/deactivate/success',

  // Form Edit
  UPDATE: 'contact/update',
  EDIT_CONTACT: 'contact/editContact',

  ADD_PHONE: 'contact/addPhone',
  REMOVE_PHONE: 'contact/removePhone',
  UPDATE_PHONE: 'contact/updatePhone',
  MAKE_PHONE_MAIN: 'contact/makePhoneMain',

  ADD_EMAIL: 'contact/addEmail',
  REMOVE_EMAIL: 'contact/removeEmail',
  UPDATE_EMAIL: 'contact/updateEmail',
  MAKE_EMAIL_MAIN: 'contact/makeEmailMain',

  // Actions
  CREATE_COLLEAGUE: 'contact/createColleague',

  // Get Detail
  FETCH_CONTACT_REQUEST: 'contact/fetchContact/request',
  FETCH_CONTACT_FAIL: 'contact/fetchContact/fail',
  FETCH_CONTACT_START: 'contact/fetchContact/start',
  FETCH_CONTACT_SUCCESS: 'contact/fetchContact/success',
  FETCH_CONTACT_DETAIL_TO_EDIT: 'contact/fetchContactDetailToEdit/request',
  FETCH_CONTACT_TO_EDIT_SUCCESS: 'contact/fetchContactToEditSuccess',
  CLEAR_CONTACT_DETAIL_TO_EDIT: 'contact/clearContactDetailToEdit',
  // Toggle Favourites
  TOGGLE_FAVORITE_REQUEST: 'contact/toggle/favorite/request',
  TOGGLE_FAVORITE_SUCCESS: 'contact/toggle/favorite/success',
  TOGGLE_FAVORITE_FAIL: 'contact/toggle/favorite/fail',

  // Detailed Panel
  // Card: Colleagues
  FETCH_COLLEAGUE_REQUEST: 'contact/fetchColleague/request',
  FETCH_COLLEAGUE_FAIL: 'contact/fetchColleague/fail',
  FETCH_COLLEAGUE_START: 'contact/fetchColleague/start',
  FETCH_COLLEAGUE_SUCCESS: 'contact/fetchColleague/success',

  // Card: Tasks
  FETCH_TASKS_REQUEST: 'contact/fetchTasks/request',
  FETCH_TASKS_SUCCESS: 'contact/fetchTasks/success',
  REFESH_TASK: 'contact/refeshTask',

  //Concact item
  CONTACT_ITEM: 'contact/contactItem',
  UPDATE_RESPONSIBLE_ONE_DEAL: 'contact/updateResponsibleOneDeal',
  UPDATE_RESPONSIBLE_ONE_DEAL_SUCCESS: 'contact/updateResponsibleOneDealSuccess',
  DELETE_ROW: 'contact/deleteRow',
  DEACTIVATE_ALL: 'contact/deactivateAll',

  //REFESH CONTACT DETAIL
  REFESH_CONTACT: 'contact/refeshContact',

  //REFESH_APPOINTMENT
  FETCH_APPOINTMENT: 'contact/refeshAppontment',
  FETCH_APPOINTMENT_SUCCESS: 'contact/fetchAppointment/success',

  //NOTE
  FETCH_NOTES_REQUEST: 'contact/fetchNotes/request',
  FETCH_NOTES_SUCCESS: 'contact/fetchNotes/success',

  //PHOTO
  FETCH_PHOTOS_REQUEST: 'contact/fetchPhotos/request',
  FETCH_PHOTOS_SUCCESS: 'contact/fetchPhotos/success',
  REFESH_DESCRIPTION_PHOTO: 'contact/refeshDescriptionPhoto',

  FETCH_ORDER_REQUEST: 'contact/fetchOrder/request',
  FETCH_ORDER_SUCCESS: 'contact/fetchOrder/success',
  LOAD_MORE_ORDER_ROWS: 'contact/loadMoreOrderRows',
  LOAD_MORE_ORDER_ROWS_SUCCESS: 'contact/loadMoreOrderRowsSuccess',

  //fet qualified
  FETCH_UNQUALIFIED_REQUEST: 'contact/fetchUnqualified/request',
  FETCH_UNQUALIFIED_SUCCESS: 'contact/fetchUnqualified/success',

  FETCH_QUALIFIED_REQUEST: 'contact/fetchQualified/request',
  FETCH_QUALIFIED_SUCCESS: 'contact/fetchQualified/success',

  //CALL LIST
  REMOVE_CALL_LIST_IN_CONTACT: 'contact/removeCallListInContact',
  REMOVE_CALL_LIST_IN_CONTACT_SUCCESS: 'contact/removeCallListInContactSuccess',
  UPDATE_CALL_LIST_IN_CONTACT: 'contact/updateCalllistInContact',

  //Avatar upload
  IMAGE_ON_CROP_ENABLED: 'contact/upload/image/crop/enabled',
  IMAGE_ON_SCALE: 'contact/upload/image/scale',
  IMAGE_ON_CROP_CHANGE: 'contact/upload/image/crop/change',
  IMAGE_CANCEL_UPLOAD_CROP: 'contact/upload/image/cancel/crop',
  IMAGE_SAVE_UPLOAD_CROP: 'contact/upload/image/save/crop',

  //Update error
  UPDATE_ERRORS: 'contact/uploadErrors',
  EDIT_ENTITY: 'contact/editEntity',
  CREATE_ENTITY: 'contact/createEntity',
  REQUEST_CREATE_QUALIFIED_MULTI: 'contact/requestCreateQualifiedMulti',

  ADD_CONTACT_TO_CALLLIST: 'contact/addContactToCalllist',
  CHANGE_ON_MULTI_ORGANISATION_MENU: 'contact/changeOnMultiMenu',

  //LAST COMMUNICATION
  FILTER_LASTEST_COMMUNICATION: 'contact/filterLastestComminication',
  FILTER_LASTEST_COMMUNICATION_SUCCESS: 'contact/filterLastestComminicationSuccess',
  REFESH_LASTEST_COMMUNICATION: 'contact/refeshLastestComminication',
  SORT_UNQUALIFIED_DEAL_SUBLIST: 'contact/sortUnqualifiedDealSublist',
  SORT_QUALIFIED_DEAL_SUBLIST: 'contact/sortQualifiedDealSublist',
  SORT_ORDER_SUBLIST: 'contact/sortOrderSublist',
  SORT_CONTACT_SUBLIST: 'contact/sortContactSublist',

  FILTER_SUBLIST_ORDER_IN_CONTACT: 'contact/filterSublistOrderInContact',
  SET_STATUS_MS_TEAMS_OF_CONTACT: 'contact/setStatusMsTeamsOfContact',
  CHECK_CONTACT_EXISTED_TEAMS  :'contact/checkIfContactExistedInTeams',
  SHOW_LIST_CHANNEL_MS_TEAM: 'contact/showListChannelMsTeam',
  ADD_LATEST_COMMUNICATION_LOG: 'contact/addLatestCommunicationLog',
  SHOW_INVITE_TO_TEAM: 'contact/showInviteToTeam',
  NOT_ALLOW_SHOW_INVITE_TO_TEAM: 'contact/notAllowShowInviteToTeam',
  CHECK_MISSING_EMAIL_BY_USER: 'contact/checkMissingEmailByUser',
  UPDATE_NUMBER_DOCUMENT_IN_DETAIL: 'contact/UPDATE_NUMBER_DOCUMENT_IN_DETAIL',
  UPDATE_CONTACT_LOCAL_FOR_CASE_CHANGE_COMPANY: 'contact/UPDATE_CONTACT_LOCAL_FOR_CASE_CHANGE_COMPANY'
};

export const updateContactLocalForCaseChangeCompany = (oldContactId, newData) => {
  return {
    type: ActionTypes.UPDATE_CONTACT_LOCAL_FOR_CASE_CHANGE_COMPANY,
    oldContactId,
    newData
  }
}
export const refeshLastestComminicationContact = (communicationId) => {
  return {
    type: ActionTypes.REFESH_LASTEST_COMMUNICATION,
    communicationId,
  };
};

export const filterLastestComminicationContactSuccess = (contactId, data, pageIndex) => {
  return {
    type: ActionTypes.FILTER_LASTEST_COMMUNICATION_SUCCESS,
    contactId,
    data,
    pageIndex,
  };
};

//removeCallList
export const removeCallListInSuccess = (contactId, callListContactId) => ({
  type: ActionTypes.REMOVE_CALL_LIST_IN_CONTACT_SUCCESS,
  contactId,
  callListContactId,
});

export const removeCallListInContact = (contactId, callListContactId) => ({
  type: ActionTypes.REMOVE_CALL_LIST_IN_CONTACT,
  contactId,
  callListContactId,
});

export const requestFetchContactUnqualified = (contactId) => {
  return {
    type: ActionTypes.FETCH_UNQUALIFIED_REQUEST,
    contactId,
  };
};

export const successFetchContactUnqualified = (contactId, data) => {
  return {
    type: ActionTypes.FETCH_UNQUALIFIED_SUCCESS,
    contactId,
    data,
  };
};

export const requestFetchContactQualified = (contactId) => {
  return {
    type: ActionTypes.FETCH_QUALIFIED_REQUEST,
    contactId,
  };
};

export const successFetchContactQualified = (contactId, data) => {
  return {
    type: ActionTypes.FETCH_QUALIFIED_SUCCESS,
    contactId,
    data,
  };
};

export const loadMoreOrderContactRows = (contactId, pageIndex) => {
  return {
    type: ActionTypes.LOAD_MORE_ORDER_ROWS,
    contactId,
    pageIndex,
  };
};

export const loadMoreOrderRowsSuccess = (contactId, orderRows) => {
  return {
    type: ActionTypes.LOAD_MORE_ORDER_ROWS_SUCCESS,
    contactId,
    orderRows,
  };
};

export const requestFetchContactOrder = (contactId) => {
  return {
    type: ActionTypes.FETCH_ORDER_REQUEST,
    contactId,
  };
};

export const successFetchContactOrder = (contactId, data, orderRows, totalOrderRow) => {
  return {
    type: ActionTypes.FETCH_ORDER_SUCCESS,
    contactId,
    data,
    orderRows,
    totalOrderRow,
  };
};

export const requestFetchAppointments = (contactId, history, orderBy) => ({
  type: ActionTypes.FETCH_APPOINTMENT,
  contactId,
  history,
  orderBy,
});

export const succeedFetchAppointments = (contactId: string, data) => ({
  type: ActionTypes.FETCH_APPOINTMENT_SUCCESS,
  contactId,
  data,
});

export const refeshDescriptionContactPhoto = (photoId, description) => ({
  type: ActionTypes.REFESH_DESCRIPTION_PHOTO,
  photoId,
  description,
});

export const requestFetchContactPhotos = (contactId) => {
  return {
    type: ActionTypes.FETCH_PHOTOS_REQUEST,
    contactId,
  };
};

export const successFetchPhotos = (contactId, data) => {
  return {
    type: ActionTypes.FETCH_PHOTOS_SUCCESS,
    contactId,
    data,
  };
};

export const requestFetchNotes = (contactId) => {
  return {
    type: ActionTypes.FETCH_NOTES_REQUEST,
    contactId,
  };
};

export const successFetchNotes = (contactId, data) => {
  return {
    type: ActionTypes.FETCH_NOTES_SUCCESS,
    contactId,
    data,
  };
};

export const refreshContact = (actionType) => ({
  type: ActionTypes.REFESH_CONTACT,
  actionType,
});

// DropDown
export const requestFetchDropdownForOrganisation = (organisationId: string, searchField: string) => ({
  type: ActionTypes.FETCH_ORGANISATION_DROPDOWN_REQUEST,
  organisationId,
  searchField,
});

// Create
export const requestCreate = (overviewType, avatar) => ({
  type: ActionTypes.CREATE_REQUEST,
  overviewType,
  avatar,
});
export const succeedCreate = () => ({
  type: ActionTypes.CREATE_SUCCESS,
});

// Update

// Deactivate
export const requestDeactivate = (contactId: string, name: string) => ({
  type: ActionTypes.DEACTIVATE_REQUEST,
  contactId,
  name,
});
export const succeedDeactivate = () => ({
  type: ActionTypes.DEACTIVATE_SUCCESS,
});

// Actions
export const createColleague = (contactId: string) => ({
  type: ActionTypes.CREATE_COLLEAGUE,
  contactId,
});

// Get Detail
export const startFetchContact = (contactId: string) => ({
  type: ActionTypes.FETCH_CONTACT_START,
  contactId,
});
export const failFetchContact = (contactId: string) => ({
  type: ActionTypes.FETCH_CONTACT_FAIL,
  contactId,
});
export const succeedFetchContact = (contactId: string, data: {}, originalData) => ({
  type: ActionTypes.FETCH_CONTACT_SUCCESS,
  contactId,
  ...data,
  originalData,
});
export const succeedFetchContactToEdit = (contactId: string, data: {}, originalData) => ({
  type: ActionTypes.FETCH_CONTACT_TO_EDIT_SUCCESS,
  contactId,
  ...data,
  originalData,
});
export const clearContactDetailToEdit = () => ({
  type: ActionTypes.CLEAR_CONTACT_DETAIL_TO_EDIT,
});
export const requestFetchContact = (contactId: string) => ({
  type: ActionTypes.FETCH_CONTACT_REQUEST,
  contactId,
});
export const requestFetchContactDetailToEdit = (contactId: string) => ({
  type: ActionTypes.FETCH_CONTACT_DETAIL_TO_EDIT,
  contactId,
});
// Form Edit
export const update = (contactId: string, updateData: {}) => ({
  type: ActionTypes.UPDATE,
  contactId,
  updateData,
});
export const editContact = (contactId: string) => ({
  type: ActionTypes.EDIT_CONTACT,
  contactId,
});
export const addPhone = (contactId, dial) => ({
  type: ActionTypes.ADD_PHONE,
  contactId,
  dial,
});
export const removePhone = (contactId, phoneId) => ({
  type: ActionTypes.REMOVE_PHONE,
  contactId,
  phoneId,
});
export const makePhoneMain = (contactId, phoneId) => ({
  type: ActionTypes.MAKE_PHONE_MAIN,
  contactId,
  phoneId,
});
export const updatePhone = (contactId, phoneId, values) => ({
  type: ActionTypes.UPDATE_PHONE,
  contactId,
  phoneId,
  values,
});
export const addEmail = (contactId) => ({
  type: ActionTypes.ADD_EMAIL,
  contactId,
});
export const removeEmail = (contactId, emailId) => ({
  type: ActionTypes.REMOVE_EMAIL,
  contactId,
  emailId,
});
export const makeEmailMain = (contactId, emailId) => ({
  type: ActionTypes.MAKE_EMAIL_MAIN,
  contactId,
  emailId,
});
export const updateEmail = (contactId, emailId, values) => ({
  type: ActionTypes.UPDATE_EMAIL,
  contactId,
  emailId,
  values,
});

// Favourites
export const toggleFavoriteRequest = (contactId: string, flag: boolean) => ({
  type: ActionTypes.TOGGLE_FAVORITE_REQUEST,
  contactId,
  flag,
});
export const toggleFavoriteSuccess = (contactId: string, flag: boolean) => ({
  type: ActionTypes.TOGGLE_FAVORITE_SUCCESS,
  contactId,
  flag,
});

// ====================================
// Action Menu Cards: Panes
// ------------------------------------
// TODO: Card: Unqualified Deals

// TODO: Card: Qualified Deals

// TODO: Card: Orders

// TODO: Card: Appointments

// Card: Tasks
export const requestFetchTasks = (contactId, history, tag, orderBy) => ({
  type: ActionTypes.FETCH_TASKS_REQUEST,
  contactId,
  history,
  tag,
  orderBy,
});
export const succeedFetchTasks = (contactId: string, data: {}) => ({
  type: ActionTypes.FETCH_TASKS_SUCCESS,
  contactId,
  ...data,
});

export const refeshTasks = () => ({
  type: ActionTypes.REFESH_TASK,
});

// Card: Colleagues
export const requestFetchColleague = (contactId: string, orderBy: string, pageIndex) => ({
  type: ActionTypes.FETCH_COLLEAGUE_REQUEST,
  contactId,
  orderBy,
  pageIndex
});
export const startFetchColleague = (contactId: string) => ({
  type: ActionTypes.FETCH_COLLEAGUE_START,
  contactId,
});
export const failFetchColleague = (contactId: string) => ({
  type: ActionTypes.FETCH_COLLEAGUE_FAIL,
  contactId,
});
export const succeedFetchColleague = (contactId: string, data: {}) => ({
  type: ActionTypes.FETCH_COLLEAGUE_SUCCESS,
  contactId,
  ...data,
});

export const updateResponsibleOneDeal = (contactId, userDTOList, overviewType) => ({
  type: ActionTypes.UPDATE_RESPONSIBLE_ONE_DEAL,
  contactId,
  userDTOList,
  overviewType,
});

export const updateResponsibleOneDealSuccess = (contactId, ownerAvatar) => ({
  type: ActionTypes.UPDATE_RESPONSIBLE_ONE_DEAL_SUCCESS,
  contactId,
  ownerAvatar,
});

// TODO: Card: Photos

// TODO: Card: Documents

// TODO: Card: Notes

// ====================================
export const contactItem = (data) => ({
  type: ActionTypes.CONTACT_ITEM,
  data,
});

export const deleteRow = (overviewType: string, itemId: string) => ({
  type: ActionTypes.DELETE_ROW,
  overviewType,
  itemId,
});
export const deactivateAll = (overviewType: string, itemId: string) => ({
  type: ActionTypes.DEACTIVATE_ALL,
  overviewType,
  itemId,
});
export const imageOnCropEnabled = (fakePath, fileData) => {
  return {
    type: ActionTypes.IMAGE_ON_CROP_ENABLED,
    fakePath,
    fileData,
  };
};

export const imageCancelUploadCrop = () => {
  return {
    type: ActionTypes.IMAGE_CANCEL_UPLOAD_CROP,
  };
};

export const imageOnCropChange = (imageData) => {
  return {
    type: ActionTypes.IMAGE_ON_CROP_CHANGE,
    imageData,
  };
};

export const imageSaveUploadCrop = (imageData) => {
  return {
    type: ActionTypes.IMAGE_SAVE_UPLOAD_CROP,
    imageData,
  };
};

export const uploadErrors = (updateData: {}) => {
  return {
    type: ActionTypes.UPDATE_ERRORS,
    updateData,
  };
};
export const changeOnMultiMenu = (option, optionValue, overviewType) => ({
  type: ActionTypes.CHANGE_ON_MULTI_ORGANISATION_MENU,
  option,
  optionValue,
  overviewType,
});

export const requestFetchAccountQualified = (contactId) => {
  return {
    type: ActionTypes.FETCH_QUALIFIED_REQUEST,
    contactId,
  };
};

export const successFetchAccountQualified = (contactId, data) => {
  return {
    type: ActionTypes.FETCH_QUALIFIED_SUCCESS,
    contactId,
    data,
  };
};

/*
export const requestFetchAccountUnqualified = (contactId) => {
  return {
    type: ActionTypes.FETCH_UNQUALIFIED_REQUEST,
    contactId
  }
}

export const successFetchAccountUnqualified = (contactId, data) => {
  return {
    type: ActionTypes.FETCH_UNQUALIFIED_SUCCESS,
    contactId,
    data
  }
}
*/

export const editEntity = (overviewType, contact) => ({
  type: ActionTypes.EDIT_ENTITY,
  overviewType,
  contact,
});

// Update
export const requestUpdate = (avatar) => ({
  type: ActionTypes.UPDATE_REQUEST,
  avatar,
});
export const succeedUpdate = () => ({
  type: ActionTypes.UPDATE_SUCCESS,
});
export const createEntity = (contact) => ({
  type: ActionTypes.CREATE_ENTITY,
  contact,
});
export const requestCreateQualifiedMulti = () => ({
  type: ActionTypes.REQUEST_CREATE_QUALIFIED_MULTI,
});

export const addContactToCalllist = (overviewType, callListContactId, contactIds) => ({
  type: ActionTypes.ADD_CONTACT_TO_CALLLIST,
  overviewType,
  callListContactId,
  contactIds,
});
//add call list
export const updateCalllistInContact = (callListContact) => ({
  type: ActionTypes.UPDATE_CALL_LIST_IN_CONTACT,
  callListContact,
});

export const sortUnqualifiedDealSublist = (orderBy) => ({
  type: ActionTypes.SORT_UNQUALIFIED_DEAL_SUBLIST,
  orderBy,
});

export const sortQualifiedDealSublist = (orderBy) => ({
  type: ActionTypes.SORT_QUALIFIED_DEAL_SUBLIST,
  orderBy,
});

export const sortOrderSublist = (uuid, orderBy) => ({
  type: ActionTypes.SORT_ORDER_SUBLIST,
  uuid,
  orderBy,
});

export const sortContactSublist = (orderBy) => ({
  type: ActionTypes.SORT_CONTACT_SUBLIST,
  orderBy,
});

export const filterSublistOrderInContact = (uuid, filterValue) => ({
  type: ActionTypes.FILTER_SUBLIST_ORDER_IN_CONTACT,
  uuid,
  filterValue,
});

export const setStatusMsTeamsOfContact = (status, msTeamsId) => ({
  type: ActionTypes.SET_STATUS_MS_TEAMS_OF_CONTACT,
  status,
  msTeamsId
})

export const checkIfContactExistedInTeams = (data) => ({
  type: ActionTypes.CHECK_CONTACT_EXISTED_TEAMS,
  data
})

export const showListChannelMsTeam = (status) => ({
  type: ActionTypes.SHOW_LIST_CHANNEL_MS_TEAM,
  status
})

export const addLatestCommunication = (contactId, data) => ({
  type: ActionTypes.ADD_LATEST_COMMUNICATION_LOG,
  contactId,
  data
});
export const showPopupInviteToTeam = (status) => ({
  type: ActionTypes.SHOW_INVITE_TO_TEAM,
  status
});
export const notAllowshowPopupInviteToTeam = () => ({
  type: ActionTypes.NOT_ALLOW_SHOW_INVITE_TO_TEAM
})
export const checkMissingEmailByUser = () => ({
  type: ActionTypes.CHECK_MISSING_EMAIL_BY_USER
});
export const updateNumberDocumentDetail = (count) => ({
  type: ActionTypes.UPDATE_NUMBER_DOCUMENT_IN_DETAIL,
  count
})
export default ActionTypes;
