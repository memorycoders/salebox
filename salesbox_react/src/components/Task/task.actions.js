// @flow

export const ActionTypes = {
  UPDATE_TASK: 'task/updateTask',
  CHANGE_NOTE: 'task/changeNote',
  CHANGE_NOTE_SAGA: 'task/updateNoteSaga',
  SORT_BY_DATE: 'task/sortByDate',
  HANDLE_SHOW_HISTORY: 'task/handleShowHistoryTask',
  FILTER_BY_TAG: 'task/filterByTag',
  DELEGATE_TASK: 'task/delegate',
  DELEGATE_ACCEPT: 'task/delegate/accept',
  DELEGATE_DECLINE: 'task/delegate/decline',
  CHANEG_TAG_TASK: 'task/change/tag',
  CHANGE_ON_MUTIL_TASK_MENU: 'task/changeOnMutilTaskMenu',
  CREATE_ENTITY: 'task/createEntity',
  CREATE_ENTITY_FETCH: 'task/createEntity/fetch',
  CREATE_ENTITY_SUCCESS: 'task/createEntity/success',
  CREATE_ENTITY_FAIL: 'task/createEntity/fail',
  CLEAR_CREATE_ENTITY: 'task/clearCreateEntity',
  UPDATE_ENTITY_FETCH: 'task/updateEntity/fetch',
  UPDATE_EDIT_TASK: 'task/updateEdit',
  UPDATE_CREATE_TASK: 'task/updateCreate',
  CREATE_ERRORS_TASK: 'task/createError',
  CLEAR_TASK_ERRORS: 'CLEAR_TASK_ERRORS',
  FETCH_LEAD_BY_TASK: 'task/fetchlead',
  CONNECT_QUALIFIED_DEAL: 'task/connectQualifiedDeal',
  UPDATE_CONNECT_QUALIFIED_DEAL: 'task/updateConnectQualifiedDeal',
  UPDATE_TASK_LEAD: 'task/updateLead',
  ADD_MAILCHIMP: 'ADD_MAILCHIMP',
  AD_DQUANLIFI: 'task/addQuanlifi',
  UPDATE_CREATE_ENTITY: 'UPDATE_CREATE_ENTITY',
  ASSIGN: 'task/assign',
  ASSIGN_TO_ME: 'task/assignToMe',
  UPDATE_TASK_DETAIL: 'task/updateTaskDetail',
  SET_CURRENT_SPECIAL_TASK: 'task/setCurrentSpecialTask',
  ADD_QUALIFY_LEAD: 'task/addQualifyLead',
  FILL_FORM_CREATE_TASK: 'task/fillFormCreateTask',
  UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_DEAL: 'task/UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_DEAL',
  UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_CONTACT: 'task/UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_CONTACT',
  UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_COMPANY: 'task/UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_COMPANY',

};

export const updateTaskDetail = (task) => ({
  type: ActionTypes.UPDATE_TASK_DETAIL,
  task
});

export const updateAddQualifi = (taskId: string, note: string) => ({
  type: ActionTypes.AD_DQUANLIFI,
  taskId,
  prospect,
});

export const changeOnMutilTaskMenu = (option, optionValue, overviewType) => ({
  type: ActionTypes.CHANGE_ON_MUTIL_TASK_MENU,
  option,
  optionValue,
  overviewType
});

export const changeNote = (taskId: string, note: string) => ({
  type: ActionTypes.CHANGE_NOTE,
  taskId,
  note,
});

export const updateNoteSaga = (taskId: string, note: string) => ({
  type: ActionTypes.CHANGE_NOTE_SAGA,
  taskId,
  note,
});

export const updateTask = (taskId: string, updateData: {}) => ({
  type: ActionTypes.UPDATE_TASK,
  taskId,
  updateData,
});

export const sortByDate = (sortValue: string) => ({
  type: ActionTypes.SORT_BY_DATE,
  sortValue,
});

export const handleHistoryTask = (showHistory: string) => ({
  type: ActionTypes.HANDLE_SHOW_HISTORY,
  showHistory,
});

export const filterByTag = (filterValue: string) => ({
  type: ActionTypes.FILTER_BY_TAG,
  filterValue,
});

export const delegateTask = (userId: string, taskId: sting, overviewType: string) => ({
  type: ActionTypes.DELEGATE_TASK,
  userId,
  taskId,
  overviewType,
});

export const delegateAccept = (userId: string, taskId: sting, overviewType: string, accepted: boolean) => ({
  type: ActionTypes.DELEGATE_ACCEPT,
  userId,
  taskId,
  overviewType,
  accepted,
});

export const delegateDecline = (userId: string, taskId: sting, overviewType: string, accepted: boolean) => ({
  type: ActionTypes.DELEGATE_DECLINE,
  userId,
  taskId,
  overviewType,
  accepted,
});

export const changeTagTask = (
  enterpriseID: string,
  token: string,
  taskId: string,
  tagId: string,
  overviewType: string
) => ({
  type: ActionTypes.CHANEG_TAG_TASK,
  enterpriseID,
  token,
  taskId,
  tagId,
  overviewType,
});

export const refreshListTask = (overviewType: string) => ({
  type: ActionTypes.REFERSH_LIST_TASK,
  overviewType,
});

export const createEntity = (formKey: string, data: any) => ({
  type: ActionTypes.CREATE_ENTITY,
  formKey,
  data,
});

export const createEntityFetch = (overviewType) => ({
  type: ActionTypes.CREATE_ENTITY_FETCH,
  overviewType,
});

export const clearCreateEntity = () => ({
  type: ActionTypes.CLEAR_CREATE_ENTITY,
});

export const updateEntityFetch = (overviewType) => ({
  type: ActionTypes.UPDATE_ENTITY_FETCH,
  overviewType
});

export const updateEdit = (data: any) => {
  return {
    type: ActionTypes.UPDATE_EDIT_TASK,
    data,
  };
};

export const updateCreate = (data: any) => {
  return {
    type: ActionTypes.UPDATE_CREATE_TASK,
    data,
  };
};

export const createError = (data: any) => {
  return {
    type: ActionTypes.CREATE_ERRORS_TASK,
    data,
  };
};

export const clearErrors = () => ({
  type: ActionTypes.CLEAR_TASK_ERRORS,
});

export const fetchLead = (taskId: string) => ({
  type: ActionTypes.FETCH_LEAD_BY_TASK,
  taskId,
});

export const connectQualifiedDeal = (userId: string, taskId: sting, overviewType: string) => ({
  type: ActionTypes.CONNECT_QUALIFIED_DEAL,
  userId,
  taskId,
  overviewType,
});

export const updateTaskConnectToOpportunity = (taskDTO) => ({
  type: ActionTypes.UPDATE_CONNECT_QUALIFIED_DEAL,
  taskDTO,
});

export const updateTaskLead = (leadId) => ({
  type: ActionTypes.UPDATE_TASK_LEAD,
  leadId,
});

export const addMailchimp = (data) => ({
  type: ActionTypes.ADD_MAILCHIMP,
  data,
});

export const updateCreateEntity = (data, overviewType) => ({
  type: ActionTypes.UPDATE_CREATE_ENTITY,
  data,
  overviewType
});

export const assignToMe = ( taskId: sting, overviewType: string) => ({
  type: ActionTypes.ASSIGN_TO_ME,
  taskId,
  overviewType,
});

export const setCurrentSpecialTask = (status, typeTask, title, taskId, options) => ({
  type: ActionTypes.SET_CURRENT_SPECIAL_TASK,
  status,
  typeTask,
  title,
  taskId,
  options
})

export const addQualifyLead=(typeTask, mode) => ({
  type: ActionTypes.ADD_QUALIFY_LEAD,
  typeTask,
  mode
})

export const fillFormCreateTask = (data) => ({
  type: ActionTypes.FILL_FORM_CREATE_TASK,
  data
})
export const updateCreateEditEntityAfterAddDeal = (qualifiedId,unqualifiedId,companyId,contactIds) =>({
  type: ActionTypes.UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_DEAL,
  qualifiedId,unqualifiedId,companyId,contactIds
})
export const updateCreateEditEntityAfterAddContact= (companyId,contactId) =>({
  type: ActionTypes.UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_CONTACT,
  companyId,contactId
})
export const updateCreateEditEntityAfterAddCompany= (companyId) =>({
  type: ActionTypes.UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_COMPANY,
  companyId
})

export default ActionTypes;
