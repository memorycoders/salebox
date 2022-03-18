// @flow
const ActionTypes = {
  // DropDown
  FETCH_DROPDOWN_REQUEST: 'organisation/fetchDropdown/request',
  FETCH_DROPDOWN_FAIL: 'organisation/fetchDropdown/fail',
  FETCH_DROPDOWN: 'organisation/fetchDropdown',

  // Create
  CREATE_REQUEST: 'organisation/add/request',
  CREATE_SUCCESS: 'organisation/add/success',

  // Update
  UPDATE_REQUEST: 'organisation/update/request',
  UPDATE_SUCCESS: 'organisation/update/success',

  // Deactivate
  DEACTIVATE_REQUEST: 'organisation/deactivate/request',
  DEACTIVATE_SUCCESS: 'organisation/deactivate/success',

  // Form Edit
  UPDATE: 'organisation/update',
  // EDIT_ORG?

  ADD_PHONE: 'organisation/addPhone',
  REMOVE_PHONE: 'organisation/removePhone',
  UPDATE_PHONE: 'organisation/updatePhone',
  MAKE_PHONE_MAIN: 'organisation/makePhoneMain',

  ADD_EMAIL: 'organisation/addEmail',
  REMOVE_EMAIL: 'organisation/removeEmail',
  UPDATE_EMAIL: 'organisation/updateEmail',
  MAKE_EMAIL_MAIN: 'organisation/makeEmailMain',

  // Get Detail
  FETCH_ORGANISATION_REQUEST: 'organisation/fetchOrganisation/request',
  FETCH_ORGANISATION_FAIL: 'organisation/fetchOrganisation/fail',
  FETCH_ORGANISATION_START: 'organisation/fetchOrganisation/start',
  FETCH_ORGANISATION_SUCCESS: 'organisation/fetchOrganisation/success',
  FETCH_ORGANISATION_REQUEST_TO_EDIT: 'organisation/fetchOrganisation/requestToEdit',
  // Toggle Favourites
  TOGGLE_FAVORITE_REQUEST: 'organisation/toggle/favorite/request',
  TOGGLE_FAVORITE_SUCCESS: 'organisation/toggle/favorite/success',
  TOGGLE_FAVORITE_FAIL: 'organisation/toggle/favorite/fail',

  // Detailed Panel
  // Card: Contacts
  FETCH_CONTACTS_REQUEST: 'organisation/fetchContacts/request',
  FETCH_CONTACTS_FAIL: 'organisation/fetchContacts/fail',
  FETCH_CONTACTS_START: 'organisation/fetchContacts/start',
  FETCH_CONTACTS_SUCCESS: 'organisation/fetchContacts/success',

  // Card: Tasks
  FETCH_TASKS_REQUEST: 'organisation/fetchTasks/request',
  FETCH_TASKS_SUCCESS: 'organisation/fetchTasks/success',
  REFESH_TASK: 'organisation/refeshTask',

  //REFESH_APPOINTMENT
  FETCH_APPOINTMENT: 'organisation/refeshAppontment',
  FETCH_APPOINTMENT_SUCCESS: 'organisation/fetchAppointment/success',

  //NOTE
  FETCH_NOTES_REQUEST: 'organisation/fetchNotes/request',
  FETCH_NOTES_SUCCESS: 'organisation/fetchNotes/success',

  //PHOTO
  FETCH_PHOTOS_REQUEST: 'organisation/fetchPhotos/request',
  FETCH_PHOTOS_SUCCESS: 'organisation/fetchPhotos/success',
  REFESH_DESCRIPTION_PHOTO: 'organisation/refeshDescriptionPhoto',
  //Concact item
  ORGANISATION_ITEM: 'organisation/concatItem',
  //refesh
  REFRESH_ORGANISATION: 'organisation/refreshOrganisation',
  DELETE_ROW: 'organisation/deleteRow',
  DEACTIVATE_ALL: 'organisation/deactivateAll',

  //CALL LIST
  REMOVE_CALL_LIST_IN_ACCOUNT: 'organisation/removeCallListInAccount',
  REMOVE_CALL_LIST_IN_ACCOUNT_SUCCESS: 'organisation/removeCallListInAccountSuccess',
  UPDATE_CALL_LIST_IN_ACCOUNT: 'organisation/updateCalllistInAccount',

  //APPOINTMENT TARGET
  UPDATE_APPOINTMENT_TARGET: 'organisation/updateAppointmentTarget',
  UPDATE_APPOINTMENT_TARGET_SUCCESS: 'organisation/updateAppointmentTargetSuccess',

  //SALE TARGET
  UPDATE_SALE_TARGET: 'organisation/updateSaleTarget',
  UPDATE_SALE_TARGET_SUCCESS: 'organisation/updateSaleTargetSuccess',

  CHANGE_ON_MULTI_ORGANISATION_MENU: 'organisation/changeOnMultiMenu',
  // FETCH_ORGANISATION_DETAIL: 'organisation/fetchDetail',
  SET_FAVORITE_DEAL: 'organisation/setFavoriteDeal',
  UPDATE_QUALIFIED_DEAL: 'organisation/updateDealInfo',

  //LAST COMMUNICATION
  FILTER_LASTEST_COMMUNICATION: 'organisation/filterLastestComminication',
  FILTER_LASTEST_COMMUNICATION_SUCCESS: 'organisation/filterLastestComminicationSuccess',
  REFESH_LASTEST_COMMUNICATION: 'organisation/refeshLastestComminication',

  //Avatar upload
  IMAGE_ON_CROP_ENABLED: 'organisation/upload/image/crop/enabled',
  IMAGE_ON_SCALE: 'organisation/upload/image/scale',
  IMAGE_ON_CROP_CHANGE: 'organisation/upload/image/crop/change',
  IMAGE_CANCEL_UPLOAD_CROP: 'organisation/upload/image/cancel/crop',
  IMAGE_SAVE_UPLOAD_CROP: 'organisation/upload/image/save/crop',

  //Update error
  UPDATE_ERRORS: 'organisation/uploadErrors',
  EDIT_ENTITY: 'organisation/editEntity',

  //fet qualified
  FETCH_UNQUALIFIED_REQUEST: 'organisation/fetchUnqualified/request',
  FETCH_UNQUALIFIED_SUCCESS: 'organisation/fetchUnqualified/success',

  FETCH_QUALIFIED_REQUEST: 'organisation/fetchQualified/request',
  FETCH_QUALIFIED_SUCCESS: 'organisation/fetchQualified/success',

  FETCH_ORDER_REQUEST: 'organisation/fetchOrder/request',
  FETCH_ORDER_SUCCESS: 'organisation/fetchOrder/success',
  LOAD_MORE_ORDER_ROWS: 'organisation/loadMoreOrderRows',
  LOAD_MORE_ORDER_ROWS_SUCCESS: 'organisation/loadMoreOrderRowsSuccess',

  UPDATE_RESPONSIBLE_ONE_DEAL: 'organisation/updateResponsibleOneDeal',
  UPDATE_RESPONSIBLE_ONE_DEAL_SUCCESS: 'organisation/updateResponsibleOneDealSuccess',

  ADD_ACCOUNT_TO_CALL_LIST: 'organisation/addAccountToCalllist',

  SORT_UNQUALIFIED_DEAL_SUBLIST: 'organisation/sortUnqualifiedDealSublist',
  SORT_QUALIFIED_DEAL_SUBLIST: 'organisation/sortQualifiedDealSublist',
  SORT_ORDER_SUBLIST: 'organisation/sortOrderSublist',
  SORT_CONTACT_SUBLIST: 'organisation/sortContactSublist',

  // Filter sublist Order
  FILTER_SUBLIST_ORDER: 'organisation/filterSublistOrder',

  //CREATE CONTACT ENTITY
  CREATE_CONTACT_ENTITY: 'organisation/createContactEntity',
  CREATE_CONTACT_REQUEST: 'organisation/createContactRequest',

  REQUEST_FETCH_DETAIL_TO_EDIT_SUCCESS: 'organisation/requestFetchDetailToEditSuccess',
  CLEAR_ACCOUNT_DETAIL_TO_EDIT: 'organisation/clearAccountDetailToEdit',
  UPDATE_NUMBER_DOCUMENT_IN_DETAIL: 'organisation/UPDATE_NUMBER_DOCUMENT_IN_DETAIL'

};

export const loadMoreOrderRows = (accountId, pageIndex) => {
  return {
    type: ActionTypes.LOAD_MORE_ORDER_ROWS,
    accountId,
    pageIndex,
  };
};

export const loadMoreOrderRowsSuccess = (accountId, orderRows) => {
  return {
    type: ActionTypes.LOAD_MORE_ORDER_ROWS_SUCCESS,
    accountId,
    orderRows,
  };
};
export const requestFetchAccountOrder = (accountId) => {
  return {
    type: ActionTypes.FETCH_ORDER_REQUEST,
    accountId,
  };
};

export const successFetchAccountOrder = (accountId, data, orderRows, totalOrderRow) => {
  return {
    type: ActionTypes.FETCH_ORDER_SUCCESS,
    accountId,
    data,
    orderRows,
    totalOrderRow,
  };
};

export const requestFetchAccountQualified = (accountId, orderBy) => {
  return {
    type: ActionTypes.FETCH_QUALIFIED_REQUEST,
    accountId,
    orderBy,
  };
};

export const successFetchAccountQualified = (accountId, data) => {
  return {
    type: ActionTypes.FETCH_QUALIFIED_SUCCESS,
    accountId,
    data,
  };
};

export const requestFetchAccountUnqualified = (accountId, orderBy) => {
  return {
    type: ActionTypes.FETCH_UNQUALIFIED_REQUEST,
    accountId,
    orderBy,
  };
};

export const successFetchAccountUnqualified = (accountId, data) => {
  return {
    type: ActionTypes.FETCH_UNQUALIFIED_SUCCESS,
    accountId,
    data,
  };
};

export const refeshLastestComminication = (communicationId) => {
  return {
    type: ActionTypes.REFESH_LASTEST_COMMUNICATION,
    communicationId,
  };
};

export const filterLastestComminication = (
  objectId,
  objectType = 'ACCOUNT',
  pageIndex,
  startDate,
  endDate,
  content,
  tag
) => {
  return {
    type: ActionTypes.FILTER_LASTEST_COMMUNICATION,
    objectId,
    objectType,
    pageIndex,
    startDate,
    endDate,
    content,
    tag,
  };
};

export const filterLastestComminicationSuccess = (accountId, data, pageIndex) => {
  return {
    type: ActionTypes.FILTER_LASTEST_COMMUNICATION_SUCCESS,
    accountId,
    data,
    pageIndex,
  };
};

export const refeshDescriptionAccountPhoto = (photoId, description) => ({
  type: ActionTypes.REFESH_DESCRIPTION_PHOTO,
  photoId,
  description,
});

export const requestFetchAccountPhotos = (accountId) => {
  return {
    type: ActionTypes.FETCH_PHOTOS_REQUEST,
    accountId,
  };
};

export const successFetchPhotos = (accountId, data) => {
  return {
    type: ActionTypes.FETCH_PHOTOS_SUCCESS,
    accountId,
    data,
  };
};

export const requestFetchNotes = (accountId) => {
  return {
    type: ActionTypes.FETCH_NOTES_REQUEST,
    accountId,
  };
};

export const successFetchNotes = (accountId, data) => {
  return {
    type: ActionTypes.FETCH_NOTES_SUCCESS,
    accountId,
    data,
  };
};

export const updateSaleTarget = (accountId, value) => ({
  type: ActionTypes.UPDATE_SALE_TARGET,
  accountId,
  value,
});

export const updateSaleTargetSuccess = (accountId, value) => ({
  type: ActionTypes.UPDATE_SALE_TARGET_SUCCESS,
  accountId,
  value,
});

export const updateAppointmentTarget = (accountId, value) => ({
  type: ActionTypes.UPDATE_APPOINTMENT_TARGET,
  accountId,
  value,
});

export const updateAppointmentTargetSuccess = (accountId, value) => ({
  type: ActionTypes.UPDATE_APPOINTMENT_TARGET_SUCCESS,
  accountId,
  value,
});

//removeCallList
export const removeCallListInAccountSuccess = (accountId, callListAccountId) => ({
  type: ActionTypes.REMOVE_CALL_LIST_IN_ACCOUNT_SUCCESS,
  accountId,
  callListAccountId,
});
//add call list
export const updateCalllistInAccount = (callListAccount) => ({
  type: ActionTypes.UPDATE_CALL_LIST_IN_ACCOUNT,
  callListAccount,
});

export const removeCallListInAccount = (accountId, callListAccountId) => ({
  type: ActionTypes.REMOVE_CALL_LIST_IN_ACCOUNT,
  accountId,
  callListAccountId,
});

export const refeshTasks = () => ({
  type: ActionTypes.REFESH_TASK,
});

// DropDown
export const requestFetchDropdown = (name: string) => ({ type: ActionTypes.FETCH_DROPDOWN_REQUEST, name });

// Create
export const requestCreate = (avatar, acceptAddDuplicate) => ({
  type: ActionTypes.CREATE_REQUEST,
  avatar,
  acceptAddDuplicate
});
export const succeedCreate = () => ({
  type: ActionTypes.CREATE_SUCCESS,
});

// Update
export const requestUpdate = (avatar) => ({
  type: ActionTypes.UPDATE_REQUEST,
  avatar,
});
export const succeedUpdate = () => ({
  type: ActionTypes.UPDATE_SUCCESS,
});

// Deactivate
export const requestDeactivate = (accountId: string, name: string) => ({
  type: ActionTypes.DEACTIVATE_REQUEST,
  accountId,
  name,
});
export const succeedDeactivate = () => ({
  type: ActionTypes.DEACTIVATE_SUCCESS,
});

// Get Detail
export const requestFetchOrganisation = (organisationId: string) => ({
  type: ActionTypes.FETCH_ORGANISATION_REQUEST,
  organisationId,
});
export const requestFetchOrganisationToEdit = (organisationId: string) => ({
  type: ActionTypes.FETCH_ORGANISATION_REQUEST_TO_EDIT,
  organisationId,
});
export const startFetchOrganisation = (organisationId: string) => ({
  type: ActionTypes.FETCH_ORGANISATION_START,
  organisationId,
});
export const failFetchOrganisation = (organisationId: string) => ({
  type: ActionTypes.FETCH_ORGANISATION_FAIL,
  organisationId,
});
export const succeedFetchOrganisation = (organisationId: string, data) => ({
  type: ActionTypes.FETCH_ORGANISATION_SUCCESS,
  organisationId,
  data,
});

// Form Edit
export const update = (organisationId: string, updateData: {}) => ({
  type: ActionTypes.UPDATE,
  organisationId,
  updateData,
});
export const addPhone = (organisationId, dial) => ({
  type: ActionTypes.ADD_PHONE,
  organisationId,
  dial,
});
export const removePhone = (organisationId, phoneId) => ({
  type: ActionTypes.REMOVE_PHONE,
  organisationId,
  phoneId,
});
export const updatePhone = (organisationId, phoneId, values) => ({
  type: ActionTypes.UPDATE_PHONE,
  organisationId,
  phoneId,
  values,
});
export const addEmail = (organisationId) => ({
  type: ActionTypes.ADD_EMAIL,
  organisationId,
});
export const removeEmail = (organisationId, emailId) => ({
  type: ActionTypes.REMOVE_EMAIL,
  organisationId,
  emailId,
});
export const updateEmail = (organisationId, emailId, values) => ({
  type: ActionTypes.UPDATE_EMAIL,
  organisationId,
  emailId,
  values,
});
export const makePhoneMain = (organisationId, phoneId) => ({
  type: ActionTypes.MAKE_PHONE_MAIN,
  organisationId,
  phoneId,
});
export const makeEmailMain = (organisationId, emailId) => ({
  type: ActionTypes.MAKE_EMAIL_MAIN,
  organisationId,
  emailId,
});

// Favourites
export const toggleFavoriteRequest = (organisationId: string, flag: boolean) => ({
  type: ActionTypes.TOGGLE_FAVORITE_REQUEST,
  organisationId,
  flag,
});
export const toggleFavoriteSuccess = (organisationId: string, flag: boolean) => ({
  type: ActionTypes.TOGGLE_FAVORITE_SUCCESS,
  organisationId,
  flag,
});

// ====================================
// Action Menu Cards: Panes
// ------------------------------------
// TODO: Card: Unqualified Deals

// TODO: Card: Qualified Deals

// TODO: Card: Orders

// TODO: Card: Appointments
export const requestFetchAppointments = (accountId, history, orderBy) => ({
  type: ActionTypes.FETCH_APPOINTMENT,
  accountId,
  history,
  orderBy,
});

export const succeedFetchAppointments = (accountId: string, data) => ({
  type: ActionTypes.FETCH_APPOINTMENT_SUCCESS,
  accountId,
  data,
});

// Card: Tasks
export const requestFetchTasks = (accountId: string, history, tag, orderBy) => ({
  type: ActionTypes.FETCH_TASKS_REQUEST,
  accountId,
  history,
  tag,
  orderBy,
});
export const succeedFetchTasks = (accountId: string, data: {}) => ({
  type: ActionTypes.FETCH_TASKS_SUCCESS,
  accountId,
  ...data,
});

// Card: Contacts
export const succeedFetchContacts = (accountId: string, data: {}) => ({
  type: ActionTypes.FETCH_CONTACTS_SUCCESS,
  accountId,
  ...data,
});
export const requestFetchContacts = (accountId: string, orderBy: string, pageIndex) => ({
  type: ActionTypes.FETCH_CONTACTS_REQUEST,
  accountId,
  orderBy,
  pageIndex
});
export const startFetchContacts = (accountId: string) => ({
  type: ActionTypes.FETCH_CONTACTS_START,
  accountId,
});
export const failFetchContacts = (accountId: string, message) => ({
  type: ActionTypes.FETCH_CONTACTS_FAIL,
  accountId,
  message
});

// TODO: Card: Photos

// TODO: Card: Documents

// TODO: Card: Notes

// ====================================
export const organisationItem = (data) => ({
  type: ActionTypes.ORGANISATION_ITEM,
  data,
});
export const refreshOrganisation = (actionType) => ({
  type: ActionTypes.REFRESH_ORGANISATION,
  actionType,
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

export const changeOnMultiMenu = (option, optionValue, overviewType) => ({
  type: ActionTypes.CHANGE_ON_MULTI_ORGANISATION_MENU,
  option,
  optionValue,
  overviewType,
});
// export const fetchOrganisationDetail = (itemId, isRefesh = true) => ({
//   type: ActionTypes.FETCH_ORGANISATION_DETAIL,
//   itemId,
//   isRefesh
// });
export const setFavoriteDeal = (organisationId, favorite) => ({
  type: ActionTypes.SET_FAVORITE_DEAL,
  organisationId,
  favorite,
});
export const updateQualifiedDeal = (data) => ({
  type: ActionTypes.UPDATE_QUALIFIED_DEAL,
  data,
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

export const updateResponsibleOneDeal = (organisationId, userDTOList, overviewType) => ({
  type: ActionTypes.UPDATE_RESPONSIBLE_ONE_DEAL,
  organisationId,
  userDTOList,
  overviewType,
});

export const updateResponsibleOneDealSuccess = (organisationId, ownerAvatar) => ({
  type: ActionTypes.UPDATE_RESPONSIBLE_ONE_DEAL_SUCCESS,
  organisationId,
  ownerAvatar,
});

export const editEntity = (overviewType, account) => ({
  type: ActionTypes.EDIT_ENTITY,
  overviewType,
  account,
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

export const addAccountToCalllist = (overviewType, callListAccountId, accountIds) => ({
  type: ActionTypes.ADD_ACCOUNT_TO_CALL_LIST,
  overviewType,
  callListAccountId,
  accountIds,
});

export const filterSublistOrder = (uuid, filterValue) => ({
  type: ActionTypes.FILTER_SUBLIST_ORDER,
  uuid,
  filterValue,
});

export const createContactEntity = (data) => ({
  type: ActionTypes.CREATE_CONTACT_ENTITY,
  data,
});

export const createContactRequest = (overviewType) => ({
  type: ActionTypes.CREATE_CONTACT_REQUEST,
  overviewType,
});

export const fetchAccountDetailToEditSuccess = (organisationId: string, data) => ({
  type: ActionTypes.REQUEST_FETCH_DETAIL_TO_EDIT_SUCCESS,
  organisationId,
  data,
});

export const clearAccountDetailToEdit = () => ({
  type: ActionTypes.CLEAR_ACCOUNT_DETAIL_TO_EDIT,
});
export const updateNumberDocumentDetail = (count) => ({
  type: ActionTypes.UPDATE_NUMBER_DOCUMENT_IN_DETAIL,
  count
})
export default ActionTypes;
