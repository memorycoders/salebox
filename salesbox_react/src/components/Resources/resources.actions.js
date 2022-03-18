import { data } from 'autoprefixer';

const ActionTypes = {
  FETCH_RESOURCES: 'resources/fetchResources',
  TOGGLE_FAVORITE_REQUEST: 'resource/toggleFavoriteRequest',
  UPDATE_FAVORITE_RESOURCE_SUCCESS: 'resource/updateFavoriteResourceSuccess',
  FETCH_RESOURCE_DETAIL: 'resource/fetchResourceDetail',
  FETCH_DETAIL_SUCCESS: 'resource/fetchDetailSuccess',
  FETCH_COMPETENCE: 'resource/fetchCompetence',
  SET_COMPETENCE: 'resource/setCompetence',
  CREATE_COMPETENCE_NAME: 'resource/createCompetenceName',
  GET_ALL_COMPETENCE: 'resource/getAllCompetence',
  SET_COMPETENCE_NAME: 'resource/setCompetenceName',
  UPDATE_PROFILE: 'resource/updateProfile',
  FETCH_LIST_EXPERIENCE: 'resource/fetchExperience',
  ADD_EXPERIENCE: 'resource/addExperience',
  UPDATE_COMPETENCE_EXPERIENCE: 'resource/updateCompetenceDTOListExperience',
  SET_EXPERIENCE: 'resource/setExperience',
  SET_ADD_EXPERIENCE: 'resource/setAddExperience',
  SET_UPDATE_EXPERIENCE: 'resource/setUpdateExperience',
  UPDATE_EXPERIENCE: 'resource/updateExperience',
  CHANGE_ITEM_EXPERIENCE: 'resource/changeItemExperience',
  REMOVE_ITEM_EXPERIENCE: 'resource/removeItemExperience',
  REMOVE_ITEM_EXPERIENCE_STATE: 'resource/removeItemExperienceState',
  SET_COMPETENCE_EXPERIENCE: 'resource/setCompetenceDTOListExperience',
  ADD_SINGLE_COMPETENCE: 'resource/addSingleCompetence',
  DELETE_SINGLE_COMPETENCE: 'resource/deleteSingleCompetence',
  UPDATE_SINGLE_COMPETENCE: 'resource/updateSingleCompetence',
  UPDATE_COMPETENCE_ITEM: 'resource/updateCompetenceItem',
  UPDATE_MULTIPLE_COMPETENCE: 'resource/updateMultipleCompetence',
  SET_COMPETENCE_NAME_EXIST: 'resource/setCompetenceNameExist',
  UPDATE_MULTIPLE_EXPERIENCE: 'resource/updateMultipleExperience',
  SET_EXPERIENCE_CV: 'resource/setxperienceCv',
  UPDATE_EXPERIENCE_CV: 'resource/updateExperienceCv',
  SET_ADD_DEAL_RESOURCE: 'resource/setAddDealResource',
  SET_OPEN_SAVEED_AFTER_ADD_DEAL: 'resource/setOpenSavedAfterAddDeal',
  SET_INFO_AFTER_ADD_DEAL: 'resource/setInfoAfterAddDeal',
  SET_RESOURCE_FOR_ADD_DEAL_IN_LIST_RESOURCE: 'resource/setResourceForAddDealInListResource',
  DELETE_LOCAL_RESOURCE: 'resource/deleteLocalResource',
  SET_RESOURCE_REPORT_ID: 'resource/setResourceReportId',
  CHANGE_ON_MULTI_MENU: 'resource/changeOnMultiMenu',
  SET_ADD_MULTI_DEAL_RESOURCES: 'resource/setAddMultiDealResource',
  FETCH_LIST_PRODUCT_BY_RESOURCES: 'resource/fetchListProductByResource',
  SORT_COMPETENCE_LIST: 'resource/sortCompetenceList',
  SET_LANGUAGE_RESOURCE_DETAIL: 'resource/setLanguageResourceDetail'
};

export const setLanguageResourceDetail = (lang) => {
  return {
    type: ActionTypes.SET_LANGUAGE_RESOURCE_DETAIL,
    lang
  }
}
export const sortCompetenceList = (sortedBy) => {
  return {
    type: ActionTypes.SORT_COMPETENCE_LIST,
    sortedBy,
  };
};
export const fetchListProductByResource = () => {
  return {
    type: ActionTypes.FETCH_LIST_PRODUCT_BY_RESOURCES,
  };
};
export const setAddMultiDealResource = (flag) => {
  return {
    type: ActionTypes.SET_ADD_MULTI_DEAL_RESOURCES,
    flag,
  };
};
export const setResourceForAddDealInListResource = (data) => {
  return {
    type: ActionTypes.SET_RESOURCE_FOR_ADD_DEAL_IN_LIST_RESOURCE,
    data,
  };
};
export const setOpenSavedAfterAddDeal = (data) => ({
  type: ActionTypes.SET_OPEN_SAVEED_AFTER_ADD_DEAL,
  data,
});

export const setAddDealResource = (data) => ({
  type: ActionTypes.SET_ADD_DEAL_RESOURCE,
  data,
});

export const setxperienceCv = (data) => ({
  type: ActionTypes.SET_EXPERIENCE_CV,
  data,
});

export const updateExperienceCv = (data) => ({
  type: ActionTypes.UPDATE_EXPERIENCE_CV,
  data,
});

export const updateMultipleExperience = (data) => ({
  type: ActionTypes.UPDATE_MULTIPLE_EXPERIENCE,
  data,
});

export const removeItemExperienceState = (data) => ({
  type: ActionTypes.REMOVE_ITEM_EXPERIENCE_STATE,
  data,
});

export const setCompetenceDTOListExperience = (data) => ({
  type: ActionTypes.SET_COMPETENCE_EXPERIENCE,
  data,
});

export const removeItemExperience = (resourceExperienceId) => ({
  type: ActionTypes.REMOVE_ITEM_EXPERIENCE,
  resourceExperienceId,
});

export const changeItemExperience = (data) => ({
  type: ActionTypes.CHANGE_ITEM_EXPERIENCE,
  data,
});

export const updateExperience = (data) => ({
  type: ActionTypes.UPDATE_EXPERIENCE,
  data,
});

export const setUpdateExperience = (data) => ({
  type: ActionTypes.SET_UPDATE_EXPERIENCE,
  data,
});

export const setExperience = (data) => ({
  type: ActionTypes.SET_EXPERIENCE,
  data,
});

export const setAddExperience = (data) => ({
  type: ActionTypes.SET_ADD_EXPERIENCE,
  data,
});

export const updateCompetenceDTOListExperience = (data) => ({
  type: ActionTypes.UPDATE_COMPETENCE_EXPERIENCE,
  data,
});

export const addExperience = (data) => ({
  type: ActionTypes.ADD_EXPERIENCE,
  data,
});

export const fetchExperience = (resourceId) => ({
  type: ActionTypes.FETCH_LIST_EXPERIENCE,
  resourceId,
});

export const toggleFavoriteRequest = (resourceId, flag) => ({
  type: ActionTypes.TOGGLE_FAVORITE_REQUEST,
  resourceId,
  flag,
});

export const updateFavoriteResourceSuccess = (resourceId, flag) => ({
  type: ActionTypes.UPDATE_FAVORITE_RESOURCE_SUCCESS,
  resourceId,
  flag,
});

export const fetchResourceDetail = (resourceId, languageVersion) => ({
  type: ActionTypes.FETCH_RESOURCE_DETAIL,
  resourceId,
  languageVersion,
});

export const fetchDetailSuccess = (data) => ({
  type: ActionTypes.FETCH_DETAIL_SUCCESS,
  data,
});

export const fetchCompetence = (resourceId) => ({
  type: ActionTypes.FETCH_COMPETENCE,
  resourceId,
});

export const setCompetence = (data) => ({
  type: ActionTypes.SET_COMPETENCE,
  data,
});

export const createCompetenceName = (name, lang) => ({
  type: ActionTypes.CREATE_COMPETENCE_NAME,
  name,
  lang,
});

export const getAllCompetence = (lang) => ({
  type: ActionTypes.GET_ALL_COMPETENCE,
  lang,
});

export const setCompetenceName = (data) => ({
  type: ActionTypes.SET_COMPETENCE_NAME,
  data,
});

export const updateProfile = (resourceId, field, data) => ({
  type: ActionTypes.UPDATE_PROFILE,
  resourceId,
  field,
  data,
});

export const addSingleCompetence = (data) => ({
  type: ActionTypes.ADD_SINGLE_COMPETENCE,
  data,
});

export const deleteSingleCompetence = (data) => ({
  type: ActionTypes.DELETE_SINGLE_COMPETENCE,
  data,
});

export const updateSingleCompetence = (datas, resourceId) => ({
  type: ActionTypes.UPDATE_SINGLE_COMPETENCE,
  datas,
  resourceId,
});

export const updateCompetenceItem = (item) => ({
  type: ActionTypes.UPDATE_COMPETENCE_ITEM,
  item,
});

export const updateMultipleCompetence = (datas, resourceId) => ({
  type: ActionTypes.UPDATE_MULTIPLE_COMPETENCE,
  datas,
  resourceId,
});

export const setCompetenceNameExist = (status) => ({
  type: ActionTypes.SET_COMPETENCE_NAME_EXIST,
  status,
});

export const setInfoAfterAddDeal = (data) => ({
  type: ActionTypes.SET_INFO_AFTER_ADD_DEAL,
  data,
});

export const deleteLocalResource = (resourceId) => ({
  type: ActionTypes.DELETE_LOCAL_RESOURCE,
  resourceId,
});

export const setResourceReportId = (id) => ({
  type: ActionTypes.SET_RESOURCE_REPORT_ID,
  id,
});

export const changeOnMultiMenu = (option, optionValue, overviewType) => {
  return {
    type: ActionTypes.CHANGE_ON_MULTI_MENU,
    option,
    optionValue,
    overviewType,
  };
};

export default ActionTypes;
