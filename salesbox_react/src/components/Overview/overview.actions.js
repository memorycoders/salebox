// @flow
const ActionTypes = {
  SELECT: 'overview/select',
  UNSELECT: 'overview/unselect',
  HIGHLIGHT: 'overview/highlight',
  CLEAR_HIGHLIGHT: 'overview/clearHighlight',
  UNHIGHLIGHT: 'overview/unhighlight',
  SET_ACTION_FOR_SELECT: 'overview/setActionForSelect',
  SET_ACTION_FOR_HIGHLIGHT: 'overview/setActionForHighlight',
  CLEAR_SELECT_ACTION: 'overview/clearSelectAction',
  CLEAR_SELECTED_ON_CHANGE_MENU: 'overview/clearSelectedOnChangeMenu',
  CLEAR_HIGHLIGHT_ACTION: 'overview/clearHighlightAction',
  FETCH_REQUEST: 'overview/requestFetch',
  FETCH_START: 'overview/startFetch',
  FETCH_SUCCESS: 'overview/succeedFetch',
  FETCH_FAIL: 'overview/failFetch',
  FEED_ENTITIES: 'overview/feedEntities',
  SET_SELECT_ALL: 'overview/setSelectAll',
  SET_UNSELECT_ALL: 'overview/setUnselectAll',
  SET_PANEL_ACTION: 'overview/setPanelAction',
  SET_DETAIL_ACTION: 'overview/setDetailAction',
  EDIT_ENTITY: 'overview/editEntity',
  CREATE_ENTITY: 'overview/createEntity',
  ENABLE_COLUMN: 'overview/enableColumn',
  DISABLE_COLUMN: 'overview/disableColumn',

  CURRENT_ITEM_LEVEL_1: 'overview/item/current/level/1',
  // CURRENT_ITEM_LEVEL_2: 'overview/item/current/level/2',
  DELETE_ROW: 'overview/deleteRow',
  SET_TASK: 'overview/setTask',
  DELETE_ROW_SUCCESS: 'overview/deleteRow/success',
  DELEGATE_TASK_SUCCESS: 'task/degate/success',
  SET_ORDER_BY: 'overview/setOrderBy',
  SHOW_HIDE_MASS_PERSONAL_MAIL: 'overview/showHideMassPersonalMail',
  COLLECT_OTHER_RESULT_NOT_IN_LIST: 'overview/collectOtherResultNotInList',
  STORE_QUALIFIED_DEAL_VALUE: 'overview/storeQualifiedDealValue',
  COLLECT_OTHER_RESULT_FILTER: 'overview/collectOtherResultFilter',
  UPDATE_COLUMN_ORDER_ROW_FROM_SETTING: 'overview/updateColumnOrderRowFromSetting',
  DELETE_ROW_SUCCESS_FOR_RECRUITMENT: 'overview/deleteRowSuccessForRecruitment',
  UPDATE_FAVORITE_SUCCESS: 'overview/recruitment/updateFavoriteClosedSuccess',
  DELETE_CANDIDATE_CLOSED_SUCCESS: 'overview/recruitment/deleteCandidateClosedSuccess',
  ADD_NEW_ITEM_TO_LIST: 'overview/addNewItemToList'
};

export const addNewItemToList = (id, oldId) => {
  return {
    type: ActionTypes.ADD_NEW_ITEM_TO_LIST,
    id,
    oldId
  }
}
export const deleteCandidateClosedSuccess = (candidateId) => {
  return {
    type: ActionTypes.DELETE_CANDIDATE_CLOSED_SUCCESS,
    candidateId
  }
}
export const deleteRowSuccessForRecruitment = (overviewType) => {
  return {
    type: ActionTypes.DELETE_ROW_SUCCESS_FOR_RECRUITMENT,
    overviewType
  }
}
export const clearSelectedOnChangeMenu = (overviewType) => ({
  type: ActionTypes.CLEAR_SELECTED_ON_CHANGE_MENU,
  overviewType,
});

export const editEntity = (overviewType: string, itemId: string) => ({
  type: ActionTypes.EDIT_ENTITY,
  overviewType,
  itemId,
});

export const createEntity = (overviewType: string, defaults: {}) => ({
  type: ActionTypes.CREATE_ENTITY,
  overviewType,
  defaults,
});

export const requestFetch = (overviewType: string, clear: boolean = false) => ({
  type: ActionTypes.FETCH_REQUEST,
  overviewType,
  clear,
});

export const startFetch = (overviewType: string, clear: boolean = false) => ({
  type: ActionTypes.FETCH_START,
  overviewType,
  clear,
});

export const succeedFetch = (
  overviewType: string,
  items: Array<string>,
  clear: boolean = false,
  itemCount?: number
) => ({
  type: ActionTypes.FETCH_SUCCESS,
  overviewType,
  itemCount,
  items,
  clear,
});

export const failFetch = (overviewType: string, error: string) => ({
  type: ActionTypes.FETCH_FAIL,
  overviewType,
  error,
});

export const enableColumn = (overviewType: string, column: string) => ({
  type: ActionTypes.ENABLE_COLUMN,
  overviewType,
  column,
});

export const disableColumn = (overviewType: string, column: string) => ({
  type: ActionTypes.DISABLE_COLUMN,
  overviewType,
  column,
});

export const feedEntities = (entities: {}) => ({
  type: ActionTypes.FEED_ENTITIES,
  entities,
});

export const setOrderBy = (overviewType: string, orderBy: string) => ({
  type: ActionTypes.SET_ORDER_BY,
  overviewType,
  orderBy,
});

export const select = (overviewType: string, itemId: string) => ({
  type: ActionTypes.SELECT,
  overviewType,
  itemId,
});

export const unselect = (overviewType: string, itemId: string) => ({
  type: ActionTypes.UNSELECT,
  overviewType,
  itemId,
});

export const highlight = (overviewType: string, itemId: string, highlightAction: string, item) => ({
  type: ActionTypes.HIGHLIGHT,
  overviewType,
  itemId,
  highlightAction,
  item,
});

export const clearHighlight = (overviewType: string, itemId: string) => ({
  type: ActionTypes.CLEAR_HIGHLIGHT,
  overviewType,
  itemId,
});

export const unhighlight = (overviewType: string, itemId: string) => ({
  type: ActionTypes.UNHIGHLIGHT,
  overviewType,
  itemId,
});

export const setActionForSelect = (overviewType: string, selectAction: string) => ({
  type: ActionTypes.SET_ACTION_FOR_SELECT,
  overviewType,
  selectAction,
});

export const setDetailAction = (overviewType: string, detailAction: string) => ({
  type: ActionTypes.SET_DETAIL_ACTION,
  overviewType,
  detailAction,
});

export const setPanelAction = (overviewType: string, panelAction: string) => ({
  type: ActionTypes.SET_PANEL_ACTION,
  overviewType,
  panelAction,
});

export const clearSelectAction = (overviewType: string) => ({
  type: ActionTypes.CLEAR_SELECT_ACTION,
  overviewType,
});

// For Opening Create and Update Modal
export const setActionForHighlight = (overviewType: string, highlightAction: string) => {
  return {
    type: ActionTypes.SET_ACTION_FOR_HIGHLIGHT,
    overviewType,
    highlightAction,
  };
};

export const clearHighlightAction = (overviewType: string) => ({
  type: ActionTypes.CLEAR_HIGHLIGHT_ACTION,
  overviewType,
});

export const setSelectAll = (overviewType: string, selectAll) => ({
  type: ActionTypes.SET_SELECT_ALL,
  overviewType,
  selectAll,
});

export const setUnselectAll = (overviewType: string, selectAll) => ({
  type: ActionTypes.SET_UNSELECT_ALL,
  overviewType,
  selectAll,
});

export const currentLv1 = (overviewType: string, itemId: string) => ({
  type: ActionTypes.CURRENT_ITEM_LEVEL_1,
  overviewType,
  itemId, // uuid
});

export const deleteRow = (overviewType: string, itemId: string, objectId) => ({
  type: ActionTypes.DELETE_ROW,
  overviewType,
  itemId,
  objectId,
});

export const setTask = (overviewType: string, itemId: string) => ({
  type: ActionTypes.SET_TASK,
  overviewType,
  itemId,
});

export const deleteRowSuccess = (overviewType: string, itemId: string) => ({
  type: ActionTypes.DELETE_ROW_SUCCESS,
  overviewType,
  itemId,
});

export const delegateTaskSuccess = (overviewType: string, itemId: string) => ({
  type: ActionTypes.DELEGATE_TASK_SUCCESS,
  overviewType,
  itemId,
});

export const showHideMassPersonalMail = (overviewType, status) => ({
  type: ActionTypes.SHOW_HIDE_MASS_PERSONAL_MAIL,
  overviewType,
  status,
});
export const collectOtherParamInList = (overviewType: string, data: {}) => ({
  type: ActionTypes.COLLECT_OTHER_RESULT_NOT_IN_LIST,
  overviewType,
  data,
});

export const storeDataTemp = (overviewType: string, data: {}) => ({
  type: ActionTypes.STORE_QUALIFIED_DEAL_VALUE,
  overviewType,
  data,
});

export const collectOtherResultFilter = (overviewType: string, data: {}) => ({
  type: ActionTypes.COLLECT_OTHER_RESULT_FILTER,
  overviewType,
  data,
});

export const updateColumnOrderRowFromSetting = (data) => ({
  type: ActionTypes.UPDATE_COLUMN_ORDER_ROW_FROM_SETTING,
  data,
});
export const updateFavoriteClosedSuccess = (candidateId, flag) => ({
  type: ActionTypes.UPDATE_FAVORITE_SUCCESS,
  candidateId,
  flag,
});

export default ActionTypes;
