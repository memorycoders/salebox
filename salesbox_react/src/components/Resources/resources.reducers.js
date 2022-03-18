import createReducer, { createConsumeEntities } from 'store/createReducer';
import AuthActionTypes from 'components/Auth/auth.actions';
import ResourcesActionsTypes from './resources.actions';

export const initialState = {
  __CREATE: {},
  __EDIT: {},
  __DETAIL: {},
  __DETAIL_TO_EDIT: {},
  __ERRORS: {},
  competences: [],
  conpetencesName: [],
  competenceItem: {
    competenceLevel: null,
    competenceId: null,
    lastUsed: '',
  },
  cv: {
    experienceList: [],
  },
  isCompetenceNameExist: null,
  experiences: {
    competenceDTOList: [],
    experienceDTOList: [],
    itemUpdate: null,
  },
  isAddDealResource: false,
  resourceReportId: '',
  isSavedEmailAfterAddDeal: false,
  infoAfterAddDeal: [],
  resourceAddDealInList: null,
  isAddDealMultiResource: false,
  valueSortedCompetenceList: 'competence',
  LANGUAGE_RESOURCE_DETAIL: null,
};

const consumeEntities = createConsumeEntities('resources');

export default createReducer(initialState, {
  default: consumeEntities,
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => {
      if (
        id === '__CREATE' ||
        id === '__ERRORS' ||
        id === '__UPLOAD' ||
        id === '__EDIT' ||
        id === 'cv' ||
        id === 'experiences' ||
        id === 'competenceItem'
      ) {
        return false;
      }
      delete draft[id];
    });
  },
  [ResourcesActionsTypes.UPDATE_FAVORITE_RESOURCE_SUCCESS]: (draft, { resourceId, flag }) => {
    if (resourceId) {
      draft[resourceId].favorite = flag;
    }
  },
  [ResourcesActionsTypes.FETCH_DETAIL_SUCCESS]: (draft, data) => {
    draft.__DETAIL = data.data;
  },
  [ResourcesActionsTypes.SET_COMPETENCE]: (draft, { data }) => {
    draft.competences = data;
  },
  [ResourcesActionsTypes.SET_COMPETENCE_NAME]: (draft, { data }) => {
    draft.competencesName = data;
  },
  [ResourcesActionsTypes.UPDATE_COMPETENCE_EXPERIENCE]: (draft, { data }) => {
    if (draft.experiences?.competenceDTOList.some((i) => i.uuid === data.uuid)) {
      draft.experiences.competenceDTOList = draft.experiences.competenceDTOList.filter((i) => i.uuid !== data.uuid);
    } else {
      draft.experiences.competenceDTOList = [...draft.experiences.competenceDTOList, data];
    }
  },
  [ResourcesActionsTypes.SET_EXPERIENCE]: (draft, { data }) => {
    if (draft.experiences) {
      draft.experiences.experienceDTOList = data;
    }
  },
  [ResourcesActionsTypes.SET_ADD_EXPERIENCE]: (draft, { data }) => {
    if (draft.experiences) {
      draft.experiences.experienceDTOList = [...draft.experiences.experienceDTOList, data];
    }
  },
  [ResourcesActionsTypes.SET_UPDATE_EXPERIENCE]: (draft, { data }) => {
    if (draft.experiences) {
      draft.experiences.itemUpdate = data;
    }
  },
  [ResourcesActionsTypes.CHANGE_ITEM_EXPERIENCE]: (draft, { data }) => {
    const findIndex = draft.experiences?.experienceDTOList.findIndex((i) => i.uuid === data.uuid);
    if (findIndex !== -1) draft.experiences.experienceDTOList[findIndex] = data;
  },
  [ResourcesActionsTypes.REMOVE_ITEM_EXPERIENCE_STATE]: (draft, { data }) => {
    if (draft.experiences) {
      draft.experiences.experienceDTOList = draft.experiences.experienceDTOList.filter((i) => i.uuid !== data.uuid);
    }
  },
  [ResourcesActionsTypes.SET_COMPETENCE_EXPERIENCE]: (draft, { data }) => {
    if (draft.experiences) {
      draft.experiences.competenceDTOList = data;
    }
  },
  [ResourcesActionsTypes.UPDATE_COMPETENCE_ITEM]: (draft, { item }) => {
    if (draft.competenceItem) {
      draft.competenceItem = item;
    }
  },
  [ResourcesActionsTypes.SET_COMPETENCE_NAME_EXIST]: (draft, { status }) => {
    draft.isCompetenceNameExist = status;
  },
  [ResourcesActionsTypes.SET_EXPERIENCE_CV]: (draft, { data }) => {
    draft.cv.experienceList = data;
  },
  [ResourcesActionsTypes.UPDATE_EXPERIENCE_CV]: (draft, { data }) => {
    const findIndex = draft.cv.experienceList.findIndex((i) => i.uuid === data.uuid);
    if (findIndex !== -1) draft.cv.experienceList[findIndex] = data;
  },
  [ResourcesActionsTypes.SET_ADD_DEAL_RESOURCE]: (draft, { data }) => {
    draft.isAddDealResource = data;
  },
  [ResourcesActionsTypes.SET_OPEN_SAVEED_AFTER_ADD_DEAL]: (draft, { data }) => {
    draft.isSavedEmailAfterAddDeal = data;
  },
  [ResourcesActionsTypes.SET_INFO_AFTER_ADD_DEAL]: (draft, { data }) => {
    draft.infoAfterAddDeal = data;
  },
  [ResourcesActionsTypes.SET_RESOURCE_FOR_ADD_DEAL_IN_LIST_RESOURCE]: (draft, { data }) => {
    draft.resourceAddDealInList = data;
  },
  [ResourcesActionsTypes.DELETE_LOCAL_RESOURCE]: (draft, { resourceId }) => {
    if (draft) {
      delete draft[resourceId];
    }
  },
  [ResourcesActionsTypes.SET_RESOURCE_REPORT_ID]: (draft, { id }) => {
    draft.resourceReportId = id;
  },
  [ResourcesActionsTypes.SET_ADD_MULTI_DEAL_RESOURCES]: (draft, { flag }) => {
    draft.isAddDealMultiResource = flag;
  },
  [ResourcesActionsTypes.SET_LANGUAGE_RESOURCE_DETAIL]: (draft, { lang }) => {
    draft.LANGUAGE_RESOURCE_DETAIL = lang;
  },
  [ResourcesActionsTypes.SORT_COMPETENCE_LIST]: (draft, { sortedBy }) => {
    switch (sortedBy) {
      case 'level':
        draft.valueSortedCompetenceList = 'level';
        draft.competences = draft.competences?.sort(function(a, b) {
          return b.competenceLevel - a.competenceLevel;
        });
        break;
      case 'lastUsed':
        draft.valueSortedCompetenceList = 'lastUsed';
        draft.competences = draft.competences?.sort(function(a, b) {
          return b.lastUsed - a.lastUsed;
        });
        break;
      default:
        draft.valueSortedCompetenceList = 'competence';
        draft.competences = draft.competences?.sort(function(a, b) {
          var nameA = a.competenceName ? a.competenceName.toUpperCase() : null; // ignore upper and lowercase
          var nameB = b.competenceName ? b.competenceName.toUpperCase() : null; // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });
        break;
    }
  },
});
