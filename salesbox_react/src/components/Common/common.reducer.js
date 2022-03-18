import createReducer from 'store/createReducer';
import CommonActions from './common.actions'
export const initialState = {
    isShowMassPersonalEmail: false,
    currentOverviewType: '',
    currentObjectType: '',
    isIE: false,
    accountAllowedSendEmail: false,
    mailServices: null,
    isShowSuggestForm: false,
    dataSuggestForm: null,
    __DOCUMENTS: {
        isFetching: false,
    },
    __DATA_STORAGE:{},
    __DEFAULT_LIST_CONTACT:{},
    confirmModal: {
      status: false,
      title: '',
      fnOk: null,
      fnCancel: null
    },
    listOfficeLostToken: {
      status: false,
      data: []
    },
    specialTask: {},
    isConnectMsTeams: false,
    storageIntegration: {
      isLinkedOffice365: false,
      isLinkedTeam: false,
      isOnCalendarOffice: false,
    },
    notificationMsTeamsMessage: null,
    connectedStorage: false,
    currentResourceId: '',
    /**
     * if value is true -> after login, we display a popup for Fortnox User.
     *
     */
    authrizationCodeFortnox: null,
    isLoginFromStartPageFortnox: false,
    visibleNotiAddFortnoxFirst: false


};

export default createReducer(initialState, {
    [CommonActions.SET_SHOW_HIDE_MAIL]: (draft, {status}) => {
        draft.isShowMassPersonalEmail = status
    },
    [CommonActions.SET_IE]: (draft, {status}) => {
      draft.isIE = status
  },
    [CommonActions.SET_OVERVIEW_TYPE]: (draft, {overviewType}) => {
        draft.currentOverviewType = overviewType;
        draft.isShowMassPersonalEmail = false;
    },
    [CommonActions.SET_OBJECT_TYPE]: (draft, {objectType}) => {
        draft.currentObjectType = objectType;
    },
    [CommonActions.ALLOWED_SEND_EMAIL]: (draft, {status, mailType}) => {
        draft.accountAllowedSendEmail = status;
        draft.mailServices = mailType
    },
    [CommonActions.SHOW_HIDE_SUGGEST_FORM]: (draft, {status, data}) => {
        draft.dataSuggestForm = data
        draft.isShowSuggestForm = status;
    },
    [CommonActions.FETCH_DOCUMENTS_STORAGE_SUCCESS]: (draft, { data }) => {

        draft.__DOCUMENTS = {
          ...draft.__DOCUMENTS,
          storageDTOList: data.storageDTOList,
          storageType: data.storageDTOList && data.storageDTOList[0] ? data.storageDTOList[0].type: null,
          userStorageIntegrationDTOList: data.userStorageIntegrationDTOList,
        };
      },
      [CommonActions.FETCH_DOCUMENTS_ROOT_FOLDER_SUCCESS]: (draft, { data }) => {
        draft.__DOCUMENTS.isFetching = false;
        draft.__DOCUMENTS = {
          ...draft.__DOCUMENTS,
          ...data,
        };
      },
      [CommonActions.FETCH_DOCUMENTS_BY_FILEID]: (draft) => {
        draft.__DOCUMENTS.isFetching = true;
      },
      [CommonActions.FETCH_DOCUMENTS_BY_FILEID_SUCCESS]: (draft, { data, clear }) => {
        const documents = draft.__DOCUMENTS.documentDTOList;
        if (clear) {
          draft.__DOCUMENTS.documentDTOList = data.documentDTOList;
        } else {
          draft.__DOCUMENTS.documentDTOList = [...documents, ...data.documentDTOList]
        }
        draft.__DOCUMENTS.isFetching = false;
      },
      [CommonActions.FETCH_DOCUMENTS_BY_FILEID_FAIL]: (draft) => {
        draft.__DOCUMENTS.isFetching = false;
      },
      [CommonActions.CHANGE_DOCUMENT_SELECTED]: (draft, { node }) => {
        draft.__DOCUMENTS.selected = node ? node : draft.__DOCUMENTS.rootFolder;
      },
      [CommonActions.FETCH_DOCUMENTS_ROOT_FOLDER]: (draft) => {
        draft.__DOCUMENTS.isFetching = true;
      },
      [CommonActions.DELETE_DOCUMENT_SELECTED]: (draft, { fileId }) => {
        const documents = draft.__DOCUMENTS.documentDTOList;
        const currentIndex = documents.findIndex((x) => x.fileId === fileId);
        if (currentIndex >= 0) {
          draft.__DOCUMENTS.documentDTOList = [...documents.slice(0, currentIndex), ...documents.slice(currentIndex + 1)];
          draft.__DOCUMENTS.selected = null;
        }
      },
      [CommonActions.UPDATE_DOCUMENT_OBJECTID]: (draft, { objectId }) => {
        draft.__DOCUMENTS.objectId =  objectId;
      },
      [CommonActions.CACHING_COMMON_DATA_STORAGE]: (draft, {data}) => {
        draft.__DATA_STORAGE = {...data.storageList};
        draft.__DEFAULT_LIST_CONTACT = {...data.defaultListContact};
      },
      [CommonActions.SET_CONFIRM_MODAL]: (draft, {status, title, fnOk, fnCancel}) => {
        draft.confirmModal.status = status;
        draft.confirmModal.fnOk = fnOk;
        draft.confirmModal.fnCancel = fnCancel
        if(title) {
          draft.confirmModal.title = title
        }
      },
      [CommonActions.SET_OFFICE_LOST_TOKEN]: (draft, {status, listOffice}) => {
        draft.listOfficeLostToken.status = status;
        if(listOffice) {
          draft.listOfficeLostToken.data = listOffice
        }
      },
      [CommonActions.SET_SPECIAL_TASK]: (draft, {data}) => {
        draft.specialTask = data
      },
      [CommonActions.SET_STATUS_CONNECT_MS_TEAMS]: (draft, {status}) => {
        draft.isConnectMsTeams = status
      },
      [CommonActions.SET_STORAGE_INTEGRATION]: (draft, {data}) => {
        draft.storageIntegration = {
          ...draft.storageIntegration,
          ...data,
        }
      },
      [CommonActions.NOTIFICATION_MS_TEAMS_MESSAGE]: (draft, {noti}) => {
        draft.notificationMsTeamsMessage = noti
      },
      [CommonActions.SET_STATUS_CONNECT_STORAGE]: (draft, {status}) => {
        draft.connectedStorage = status
      },
      [CommonActions.SET_CURRENT_RESOURCE_ID]: (draft, {resourceId}) => {
        draft.currentResourceId = resourceId
      },
      [CommonActions.SET_IS_LOGIN_FROM_START_PAGE_FORTNOX]: (draft, {status, authrizationCodeFortnox}) => {
        draft.isLoginFromStartPageFortnox = status;
        draft.authrizationCodeFortnox = authrizationCodeFortnox;
      },
      [CommonActions.SET_VISIBLE_NOTI_ADD_FORTNOX_FIRST]: (draft, {visible}) => {
        draft.visibleNotiAddFortnoxFirst = visible;
      }
})
