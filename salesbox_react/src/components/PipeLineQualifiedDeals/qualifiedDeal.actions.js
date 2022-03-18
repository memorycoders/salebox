// @flow

const ActionTypes = {
  //FETCH DATA FOR UNQUALIFIED DEAL
  FETCH_QUALIFIED_DATA: 'qualified/fetchQualifiedData',
  FETCH_QUALIFIED_DATA_SUCESS: 'qualified/fetchQualifiedDataSuccess',

  //TRELLO ACTIONS SCREEN
  FETCH_COUNT_BY_STEPS: 'qualified/fetchCountBySteps',
  FETCH_COUNT_BY_STEPS_SUCCESS: 'qualified/fetchCountByStepsSuccess',
  UPDATE_STEPS: 'qualified/updateStep',
  UPDATE_SALE_METHOD_ACTIVE: 'qualified/updateSaleMethodActive',
  FETCH_LIST_SALE_PROCESS: 'qualified/fetchListSaleProcess',
  FETCH_LIST_SALE_PROCESS_SUCCESS: 'qualified/fetchListSaleProcessSuccess',

  FETCH_QUALIFIED_DETAIL: 'qualified/fetchDetail',
  FETCH_QUALIFIED_DETAIL_TO_EDIT: 'qualified/fetchDetailToEdit',
  FETCH_QUALIFIED_DETAIL_SUCCESS: 'qualified/fetchDetailSuccess',
  FETCH_QUALIFIED_DETAIL_TO_EDIT_SUCCESS: 'qualified/fetchDetailToEditSuccess',
  UPDATE_INFO_FOR_DETAIL_TO_EDIT: 'qualified/updateInfoForDetailToEdit',
  //Change to list show
  CLEAR_DETAIL_TO_EDIT: 'qualified/clearDetailToEdit',
  CHANGE_LIST_SHOW: 'qualified/changeListShow',
  CHANGE_ON_MULTI_QUALIFIED_MENU: 'qualified/changeOnMultiMenu',

  CREATE_ENTITY_QUALIFIED: 'qualified/createEntity',
  CREATE_ERRORS_QUALIFIED: 'qualified/createErrors',
  CREATE_ENTITY_FETCH: 'qualified/createFetch',
  CLEAR_CREATE_ENTITY: 'qualified/clearCreateEntity',

  //refesh
  REFESH_QUALIFIED_DEAL: 'qualified/refeshQualifiedDeal',
  REFESH_ORDER_DEAL : 'qualified/refeshOrderDeal',

  FETCH_TASKS: 'qualified/fetchTasks',
  FETCH_TASKS_SUCCESS: 'qualified/fetchTasksSuccess',
  REFESH_TASK: 'qualified/refeshTasks',
  REFESH_QUALIFIED_DETAIL: 'qualified/refreshQualifiedDetail',

  //APPOINTMENT
  FETCH_APPOINTMENTS: 'qualified/fetchAppointments',
  FETCH_APPOINTMENTS_SUCCESS: 'qualified/fetchAppointmentsSuccess',

  //RESQUEST FET NOTES
  FETCH_NOTES: 'qualified/fetchNotes',
  FETCH_NOTES_SUCCESS: 'qualified/fetchNotesSuccess',
  SET_FAVORITE_DEAL: 'qualified/setFavoriteDeal',
  SET_LOST_DEAL: 'qualified/setLostDeal',
  FETCH_ORDER_ROW_QUALIFIED_DEAL: 'qualified/getOrderRow',
  SET_WON_DEAL: 'qualified/setWonDeal',

  UPDATE_LIST_SALE_METHOD_USING: 'qualified/updateListSaleMethodUsing',
  FETCH_LIST_ACTIVITY: 'qualified/fetchListActivity',
  UPDATE_LIST_ACTIVITY: 'qualified/updateListActivity',
  FETCH_LIST_BY_SALE: 'qualified/fetchListBySale',
  UPDATE_SALE_ALL: 'qualified/updateSaleAll',
  UPDATE_QUALIFIED_DEAL: 'qualified/updateDealInfo',

  //SORT IN TRELLO
  SORT_ORDER_BY: 'qualified/sortOrderBy',
  PROGRESS_UPDATE: 'qualified/progressUpdate',
  DELETE_ROW: 'qualified/deleteRow',
  INIT_DELETE_ROW: 'qualified/initDeleteRow',
  DELETE_CONNECT_OBJECT: 'qualified/deleteConnectObject',
  DELETE_ROW_SUCCESS: 'qualified/deleteRow/success',

  //Change tab in create modal
  CHANGE_TAB: 'qualified/changeTabModal',
  ADD_ORDER: 'qualified/addOrder',

  //Action Plan
  FETCH_ACTION_PLAN: 'qualified/fetchActionPlan',
  FETCH_ACTION_PLAN_SUCCESS: 'qualified/fetchActionPlanSuccess',
  MOVE_STEP_ACTION_PLAN: 'qualified/moveStepActionPlan',
  REFESH_ACTION_PLAN: 'qualified/refeshActionPlan',
  MOVE_STEP_ACTION_PLAN_LOCAL: 'qualified/moveStepActionPlanLocal',
  LIST_CHANGE_NEXT_STEP: 'qualified/listChangeNextStep',

  //PRODUCT CARD
  FETCH_PRODUCTS: 'qualified/fetchProducts',
  FETCH_PRODUCTS_SUCCESS: 'qualified/fetchProductsSuccess',
  //getProspectLite
  FETCH_PROSPECT_LITE: 'qualified/fetchProspectLite',
  COPY_ENTITY_QUALIFIED: 'qualified/copyEntityQualified',
  COPY_ENTITY_ORDER: 'qualified/copyEntityOrder',
  //UPDATE RESPONSIBLE
  UPDATE_RESPONSIBLE_ONE_DEAL: 'qualified/updateResponsibleOneDeal',
  UPDATE_RESPONSIBLE_ONE_DEAL_SUCCESS: 'qualified/updateResponsibleOneDealSuccess',

  //GET OVERVIEW
  GET_OPPORT_UNITY_REPORT_INFO:'qualified/getOpportunityReportInfo',
  GET_OPPORT_UNITY_REPORT_INFO_SUCCESS: 'qualified/getOpportunityReportInfoSuccess',

  //EXPORT
  EXPORT_NEW_OPPORT_UNITY: 'qualified/exportNewOpportunity',
  //Update entity edit qualified
  UPDATE_ENTITY_QUALIFIED: 'qualified/updateEntity',
  UPDATE_QUALIFIED_FETCH: 'qualified/updateFetch',
  //PHOTO PANE
  FETCH_PHOTOS: 'qualified/fetchPhotos',
  FETCH_PHOTOS_SUCCESS: 'qualified/fetchPhotosSuccess',
  REFESH_DESCRIPTION_PHOTO: 'qualified/refeshDescriptionPhoto',


  CHANGE_ORDER_SALE: 'qualified/changeOrderSale',

  //DOCUMENT
  FETCH_DOCUMENTS_STORAGE: 'qualified/fetchDocumentsStorage',
  FETCH_DOCUMENTS_STORAGE_SUCCESS: 'qualified/fetchDocumentsStorageSuccess',

  FETCH_DOCUMENTS_ROOT_FOLDER: 'qualified/fetchRootFolder',
  FETCH_DOCUMENTS_ROOT_FOLDER_SUCCESS: 'qualified/fetchRootFolderSuccess',

  FETCH_DOCUMENTS_BY_FILEID: 'qualified/fetchDocumentsByFileId',
  FETCH_DOCUMENTS_BY_FILEID_SUCCESS: 'qualified/fetchDocumentsByFileIdSuccess',
  FETCH_DOCUMENTS_BY_FILEID_FAIL: 'qualified/fetchDocumentsByFileIdFail',

  CHANGE_DOCUMENT_SELECTED: 'qualified/changeDocumentSelected',
  DELETE_DOCUMENT_SELECTED: 'qualified/deleteDocumentSelected',

  // MOVE

  UPDATE_CREATE_ENTITY: 'qualified/UPDATE_CREATE_ENTITY',

  AUTO_FILL_FORM: 'qualified/autoFillForm',
  UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_CONTACT: 'qualified/UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_CONTACT',
  UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_COMPANY: 'qualified/UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_COMPANY',
  UPDATE_ENTITY_LIST_VIEW_MANUALLY: 'qualified/UPDATE_ENTITY_LIST_VIEW_MANUALLY',
  UPDATE_NUMBER_DOCUMENT_IN_DETAIL: 'qualified/UPDATE_NUMBER_DOCUMENT_IN_DETAIL'

};

export const updateEntityListViewManually = (data) => ({
  type: ActionTypes.UPDATE_ENTITY_LIST_VIEW_MANUALLY,
  data
});

export const refeshDescriptionPhoto = (photoId, description) => ({
  type: ActionTypes.REFESH_DESCRIPTION_PHOTO,
  photoId, description
});

export const fetchPhotos = (qualifiedDealId) => ({
  type: ActionTypes.FETCH_PHOTOS,
  qualifiedDealId
});

export const fetchPhotosSuccess = (qualifiedDealId, data) => ({
  type: ActionTypes.FETCH_PHOTOS_SUCCESS,
  data,
  qualifiedDealId
});

export const exportNewOpportunity = (qualifiedDealId) => ({
  type: ActionTypes.EXPORT_NEW_OPPORT_UNITY,
  qualifiedDealId
});

//getOpportunityReportInfoSuccess

export const getOpportunityReportInfoSuccess = (data) => ({
  type: ActionTypes.GET_OPPORT_UNITY_REPORT_INFO_SUCCESS,
  data
});

export const getOpportunityReportInfo = () => ({
  type: ActionTypes.GET_OPPORT_UNITY_REPORT_INFO
});

export const updateResponsibleOneDeal = (qualifiedDealId, userDTOList, overviewType) => ({
  type: ActionTypes.UPDATE_RESPONSIBLE_ONE_DEAL,
  qualifiedDealId, userDTOList, overviewType
});

export const updateResponsibleOneDealSuccess = (qualifiedDealId, ownerAvatar) => ({
  type: ActionTypes.UPDATE_RESPONSIBLE_ONE_DEAL_SUCCESS,
  qualifiedDealId,
  ownerAvatar
});

export const listChangeNexStep = (qualifiedDealId, firstNextStep, secondNextStep) => ({
  type: ActionTypes.LIST_CHANGE_NEXT_STEP,
  firstNextStep,
  secondNextStep,
  qualifiedDealId
});

export const succeedFetchProducts = (qualifiedDealId: string, products) => ({
  type: ActionTypes.FETCH_PRODUCTS_SUCCESS,
  qualifiedDealId,
  products,
});

export const requestFetchProducts = (qualifiedDealId) => ({
  type: ActionTypes.FETCH_PRODUCTS,
  qualifiedDealId,
});

export const moveStepActionPlanLocal = (stepId, newProgress) => ({
  type: ActionTypes.MOVE_STEP_ACTION_PLAN_LOCAL,
  stepId,
  newProgress
});

export const refeshActionPlan = () => ({
  type: ActionTypes.REFESH_ACTION_PLAN
});

export const moveStepActionPlan = (stepId, salesProcessId, qualifiedId, activityId, oldActivityId) => ({
  type: ActionTypes.MOVE_STEP_ACTION_PLAN,
  stepId,
  salesProcessId,
  qualifiedId,
  activityId,
  oldActivityId
});

export const succeedFetchActionPlan = (qualifiedDealId: string, actionPlan) => ({
  type: ActionTypes.FETCH_ACTION_PLAN_SUCCESS,
  qualifiedDealId,
  actionPlan,
});

export const requestFetchActionPlan = (qualifiedDealId) => ({
  type: ActionTypes.FETCH_ACTION_PLAN,
  qualifiedDealId,
});

export const progressUpdate = (uuid, finished, salesProcessId, prospectId) => ({
  type: ActionTypes.PROGRESS_UPDATE,
  uuid,
  finished,
  salesProcessId,
  prospectId
});

export const setOrderBy = (salesProcessId, orderBy) => ({
  type: ActionTypes.SORT_ORDER_BY,
  salesProcessId, orderBy
});

export const succeedFetchNotes = (qualifiedDealId: string, notes) => ({
  type: ActionTypes.FETCH_NOTES_SUCCESS,
  qualifiedDealId,
  notes,
});

export const requestFetchNotes = (qualifiedDealId) => ({
  type: ActionTypes.FETCH_NOTES,
  qualifiedDealId,
});

export const requestFetchAppointments = (qualifiedDealId, history, orderBy) => ({
  type: ActionTypes.FETCH_APPOINTMENTS,
  qualifiedDealId,
  history,
  orderBy,
});

export const succeedFetchAppointments = (qualifiedDealId: string, appointments) => ({
  type: ActionTypes.FETCH_APPOINTMENTS_SUCCESS,
  qualifiedDealId,
  appointments,
});

export const refeshQualifiedDeal = (actionType) => ({
  type: ActionTypes.REFESH_QUALIFIED_DEAL,
  actionType,
});

export const refeshOrderDeal = (actionType) => ({
  type: ActionTypes.REFESH_ORDER_DEAL,
  actionType,
});

export const refeshTasks = () => ({
  type: ActionTypes.REFESH_TASK,
});

export const succeedFetchTasks = (qualifiedDealId: string, data: {}) => ({
  type: ActionTypes.FETCH_TASKS_SUCCESS,
  qualifiedDealId,
  ...data,
});

export const requestFetchTasks = (qualifiedDealId, history, tag, orderBy) => ({
  type: ActionTypes.FETCH_TASKS,
  qualifiedDealId,
  history,
  tag,
  orderBy,
});

export const createEntity = (formKey, data) => ({
  type: ActionTypes.CREATE_ENTITY_QUALIFIED,
  formKey,
  data,
});

export const createErros = (data, formKey = '__ERRORS') => ({
  type: ActionTypes.CREATE_ERRORS_QUALIFIED,
  data,
  formKey,
});

export const createEntityFetch = (overviewType) => ({
  type: ActionTypes.CREATE_ENTITY_FETCH,
  overviewType,
});

export const clearCreateEntity = (formKey = '__CREATE') => ({
  type: ActionTypes.CLEAR_CREATE_ENTITY,
  formKey,
});

export const fetchListSaleProcess = (salesProcessId) => {
  return {
    type: ActionTypes.FETCH_LIST_SALE_PROCESS,
    salesProcessId,
  };
};

export const fetchListSaleProcessSuccess = (salesProcessId, data) => {
  return {
    type: ActionTypes.FETCH_LIST_SALE_PROCESS_SUCCESS,
    salesProcessId,
    data,
  };
};

export const changeListShow = () => ({
  type: ActionTypes.CHANGE_LIST_SHOW,
});

export const updateSaleMethodActive = (saleMethodId) => ({
  type: ActionTypes.UPDATE_SALE_METHOD_ACTIVE,
  saleMethodId,
});

export const fetchQualifiedDetail = (qualifiedDealId) => ({
  type: ActionTypes.FETCH_QUALIFIED_DETAIL,
  qualifiedDealId,
});
export const fetchQualifiedDetailToEdit = (qualifiedDealId) => ({
  type: ActionTypes.FETCH_QUALIFIED_DETAIL_TO_EDIT,
  qualifiedDealId,
});
export const clearDetailToEdit = () => ({
  type: ActionTypes.CLEAR_DETAIL_TO_EDIT
});
export const updateInfoForDetailToEdit = (data) => ({
  type: ActionTypes.UPDATE_INFO_FOR_DETAIL_TO_EDIT,
  data
})
export const updateSteps = (salesProcessId, newSteps) => {
  return {
    type: ActionTypes.UPDATE_STEPS,
    newSteps,
    salesProcessId,
  };
};

export const fetchQualifiedData = () => {
  return {
    type: ActionTypes.FETCH_QUALIFIED_DATA,
  };
};

export const fetchQualifiedDataSuccess = (salesMethodDTOList, salesMethodUsing) => {
  return {
    type: ActionTypes.FETCH_QUALIFIED_DATA_SUCESS,
    salesMethodDTOList,
    salesMethodUsing,
  };
};

export const fetchCountBySteps = (salesProcessId) => {
  return {
    type: ActionTypes.FETCH_COUNT_BY_STEPS,
    salesProcessId,
  };
};

export const fetchCountByStepsSuccess = (salesProcessId, data) => {
  return {
    type: ActionTypes.FETCH_COUNT_BY_STEPS_SUCCESS,
    salesProcessId,
    data,
  };
};

export const setFavoriteDeal = (prospecId, favorite) => ({
  type: ActionTypes.SET_FAVORITE_DEAL,
  prospecId,
  favorite,
});

export const setLostDeal = (overviewType, data) => ({
  type: ActionTypes.SET_LOST_DEAL,
  overviewType,
  data,
});

export const fetchNumberOrderRow = (prospecId, overviewType) => ({
  type: ActionTypes.FETCH_ORDER_ROW_QUALIFIED_DEAL,
  prospecId,
  overviewType
});

export const changeOnMultiMenu = (option, optionValue, overviewType) => ({
  type: ActionTypes.CHANGE_ON_MULTI_QUALIFIED_MENU,
  option,
  optionValue,
  overviewType,
});

export const refreshQualifiedDetail = (actionType) => ({
  type: ActionTypes.REFESH_QUALIFIED_DETAIL,
  actionType,
});

export const updateListSaleMethodUsing = (data) => ({
  type: ActionTypes.UPDATE_LIST_SALE_METHOD_USING,
  data,
});

export const updateListActivity = (data) => ({
  type: ActionTypes.UPDATE_LIST_ACTIVITY,
  data,
});

export const fetchListActivity = () => ({
  type: ActionTypes.FETCH_LIST_ACTIVITY,
});

export const fetchListBysale = (saleId, objectTypes) => ({
  type: ActionTypes.FETCH_LIST_BY_SALE,
  objectTypes,
  saleId,
});

export const updateSaleAll = () => ({
  type: ActionTypes.UPDATE_SALE_ALL,
});

export const updateQualifiedDeal = (data) => ({
  type: ActionTypes.UPDATE_QUALIFIED_DEAL,
  data
});
export const deleteRow = (overviewType: string, itemId: string, isRemoveUserFromOppTeam: false) => ({
  type: ActionTypes.DELETE_ROW,
  overviewType,
  itemId,
  isRemoveUserFromOppTeam
});
export const initDeleteRow = (overviewType: string, itemId: string) => ({
  type: ActionTypes.INIT_DELETE_ROW,
  overviewType,
  itemId,
});
export const removeConnectedObject = (overviewType: string, itemId: string) => ({
  type: ActionTypes.DELETE_CONNECT_OBJECT,
  overviewType,
  itemId,
});
export const changeTab = (overviewType, tab) => ({
  type: ActionTypes.CHANGE_TAB,
  overviewType,
  tab,
});
export const addOrder = (overviewType) => ({
  type: ActionTypes.ADD_ORDER,
  overviewType,
});
export const fetchProspectLite = (uuid, overviewType) => ({
  type: ActionTypes.FETCH_PROSPECT_LITE,
  uuid,
  overviewType,
});
export const copyEntityQualified = (data) => ({
  type: ActionTypes.COPY_ENTITY_QUALIFIED,
  data,
});
export const updateEntity = (overviewType) => ({
  type: ActionTypes.UPDATE_ENTITY_QUALIFIED,
  overviewType,
});
export const updateFetch = (overviewType) => ({
  type: ActionTypes.UPDATE_QUALIFIED_FETCH,
  overviewType,
});
export const changeOrderSale = (isAll, saleId) => ({
  type: ActionTypes.CHANGE_ORDER_SALE,
  isAll,
  saleId,
});
export const copyEntityOrder = (data) => ({
  type: ActionTypes.COPY_ENTITY_ORDER,
  data,
});
export const fetchDocumentsStorage = () => ({
  type: ActionTypes.FETCH_DOCUMENTS_STORAGE,
});
export const fetchDocumentsStorageSuccess = (data) => ({
  type: ActionTypes.FETCH_DOCUMENTS_STORAGE_SUCCESS,
  data,
});
export const fetchGetRootFolder = (uuid) => ({
  type: ActionTypes.FETCH_DOCUMENTS_ROOT_FOLDER,
  uuid,
});
export const fetchGetRootFolderSuccess = (data) => ({
  type: ActionTypes.FETCH_DOCUMENTS_ROOT_FOLDER_SUCCESS,
  data,
});
export const fetchDocumentsByFileId = (uuid, fileId) => ({
  type: ActionTypes.FETCH_DOCUMENTS_BY_FILEID,
  uuid,
  fileId,
});
export const fetchDocumentsByFileIdSuccess = (data, clear = true) => ({
  type: ActionTypes.FETCH_DOCUMENTS_BY_FILEID_SUCCESS,
  data,
  clear,
});
export const fetchDocumentsByFileIdFail = () => ({
  type: ActionTypes.FETCH_DOCUMENTS_BY_FILEID_FAIL,
});
export const changeDocumentSelected = (node) => ({
  type: ActionTypes.CHANGE_DOCUMENT_SELECTED,
  node,
});
export const deleteDocumentSelected = (fileId) => ({
  type: ActionTypes.DELETE_DOCUMENT_SELECTED,
  fileId,
});
export const updateCreateEntityQualified = (data, overviewType) => ({
  type: ActionTypes.UPDATE_CREATE_ENTITY,
  data,
  overviewType
});

export const autoFillForm = (data) => ({
  type: ActionTypes.AUTO_FILL_FORM,
  data
})
export const updateCreateEditEntityAfterAddContact= (companyId,contactId) =>({
  type: ActionTypes.UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_CONTACT,
  companyId,contactId
})
export const updateCreateEditEntityAfterAddCompany= (companyId) =>({
  type: ActionTypes.UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_COMPANY,
  companyId
});

export const updateNumberDocumentDetail = (count) => ({
  type: ActionTypes.UPDATE_NUMBER_DOCUMENT_IN_DETAIL,
  count
})

export default ActionTypes;
