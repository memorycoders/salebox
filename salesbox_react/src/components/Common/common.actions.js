const ActionTypes = {
    SHOW_HIDE_MASS_PERSONAL_MAIL: 'common/showHideMassPersonalMail',
    SET_SHOW_HIDE_MAIL: 'common/setShowHideMail',
    SET_IE: 'common/setIE',
    SET_OVERVIEW_TYPE: 'common/setOverviewType',
    SET_OBJECT_TYPE: 'common/setObjectType',
    ALLOWED_SEND_EMAIL: 'common/allowedSendEmail',
    SHOW_HIDE_SUGGEST_FORM: 'common/showHideSuggestForm',
    CREATE_QUALIFY_DEAL_TASK_OR_IDENTIFY_CONTACT: 'common/createQualifyDealTaskOrIdentifyContact',
    FETCH_DOCUMENTS_STORAGE: 'common/documents/fetchDocumentsStorage',
    FETCH_DOCUMENTS_STORAGE_SUCCESS: 'common/documents/fetchDocumentsStorageSuccess',

    FETCH_DOCUMENTS_ROOT_FOLDER: 'common/documents/fetchRootFolder',
    FETCH_DOCUMENTS_ROOT_FOLDER_SUCCESS: 'common/documents/fetchRootFolderSuccess',

    FETCH_DOCUMENTS_BY_FILEID: 'common/documents/fetchDocumentsByFileId',
    FETCH_DOCUMENTS_BY_FILEID_SUCCESS: 'common/documents/fetchDocumentsByFileIdSuccess',
    FETCH_DOCUMENTS_BY_FILEID_FAIL: 'common/documents/fetchDocumentsByFileIdFail',

    CHANGE_DOCUMENT_SELECTED: 'common/documents/changeDocumentSelected',
    DELETE_DOCUMENT_SELECTED: 'common/documents/deleteDocumentSelected',

    UPDATE_DOCUMENT_OBJECTID: 'common/documents/updateDocumentObjectId',
    CACHING_COMMON_DATA_STORAGE: 'common/cachingCommonDataStorage',
    UPLOAD_FILE_TO_CLOUD: 'common/uploadFileToCloud',
    SET_CONFIRM_MODAL: 'common/setConfirmModal',
    CHECK_TOKEN_INTEGRATION: 'common/checkTokenIntegration',
    SET_OFFICE_LOST_TOKEN: 'common/setOfficeLostToken',
    SET_SPECIAL_TASK: 'common/setSpecialTask',
    SET_STATUS_CONNECT_MS_TEAMS: 'common/setStatusConnectMsTeams',
    SET_STORAGE_INTEGRATION: 'common/setStorageIntegration',
    NOTIFICATION_MS_TEAMS_MESSAGE: 'common/msTeams/notificationMsTeamsMessage',
    SOCKETS_CONNECT: 'SOCKETS_CONNECT',
    DISCONNECT_SOCKET: 'DISCONNECT_SOCKET',
    SET_STATUS_CONNECT_STORAGE: 'SET_STATUS_CONNECT_STORAGE',
    SET_CURRENT_RESOURCE_ID: 'SET_CURRENT_RESOURCE_ID',
    SET_IS_LOGIN_FROM_START_PAGE_FORTNOX: 'SET_IS_LOGIN_FROM_START_PAGE_FORTNOX',
    SET_VISIBLE_NOTI_ADD_FORTNOX_FIRST: 'SET_VISIBLE_NOTI_ADD_FORTNOX_FIRST'
}

export const setVisibleNotiAddFortnoxFirst = (visible) => {
  return {
    type: ActionTypes.SET_VISIBLE_NOTI_ADD_FORTNOX_FIRST,
    visible
  }
}
export const setIsLoginFromStartPageFortnox = (status, authrizationCodeFortnox) => {
  return {
    type: ActionTypes.SET_IS_LOGIN_FROM_START_PAGE_FORTNOX,
    status,
    authrizationCodeFortnox
  }
}
export const showHideMassPersonalMail = (status) => ({
    type: ActionTypes.SHOW_HIDE_MASS_PERSONAL_MAIL,
    status
})

export const setOverviewType = (overviewType) => ({
    type: ActionTypes.SET_OVERVIEW_TYPE,
    overviewType
})

export const setObjectType = (objectType) => ({
    type: ActionTypes.SET_OBJECT_TYPE,
    objectType
})

export const allowedSendEmail = (status, mailType) => ({
    type: ActionTypes.ALLOWED_SEND_EMAIL,
    status,
    mailType
})

export const setShowHideMail = (status) => ({
    type: ActionTypes.SET_SHOW_HIDE_MAIL,
    status
})

export const setIE = (status) => ({
  type: ActionTypes.SET_IE,
  status
})

export const showHideSuggestForm = (status, data) => ({
    type: ActionTypes.SHOW_HIDE_SUGGEST_FORM,
    status,
    data
})

export const createQualifyDealTaskOrIdentifyContactTask = (data) => ({
    type: ActionTypes.CREATE_QUALIFY_DEAL_TASK_OR_IDENTIFY_CONTACT,
    data
})

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
  export const updateDocumentObjectId = (objectId) => ({
    type: ActionTypes.UPDATE_DOCUMENT_OBJECTID,
    objectId,
  });
  export const cachingCommonDataStorage = (data) => ({
    type: ActionTypes.CACHING_COMMON_DATA_STORAGE,
    data
  })
  export const uploadFileToCloud = (file) => ({
    type: ActionTypes.UPLOAD_FILE_TO_CLOUD,
    file
  })

  export const setConfirmModal = (_modal) => ({
    type: ActionTypes.SET_CONFIRM_MODAL,
    _modal
  })

  export const checkTokenIntegration = () => ({
    type: ActionTypes.CHECK_TOKEN_INTEGRATION
  })

  export const setOfficeLostToken=(status, listOffice) => ({
    type: ActionTypes.SET_OFFICE_LOST_TOKEN,
    status,
    listOffice
  })

  export const setSpecialTask=(data) => ({
    type: ActionTypes.SET_SPECIAL_TASK,
    data
  })

  export const setStatusConnectTeams = (status) => ({
    type: ActionTypes.SET_STATUS_CONNECT_MS_TEAMS,
    status
  })

  export const setStorageIntegration = (data) => ({
    type: ActionTypes.SET_STORAGE_INTEGRATION,
    data,
  })
  export const notificationMsTeamsMessage = (noti) => ({
    type: ActionTypes.NOTIFICATION_MS_TEAMS_MESSAGE,
    noti
  })

  export const connectSocket = () => ({
    type: ActionTypes.SOCKETS_CONNECT
  })

  export const disconnectSocket = () => ({
    type: ActionTypes.DISCONNECT_SOCKET
  })

  export const setStatusConnectStorage = (status) => ({
    type: ActionTypes.SET_STATUS_CONNECT_STORAGE,
    status
  })

  export const setCurrentResourceId = (resourceId) => ({
    type: ActionTypes.SET_CURRENT_RESOURCE_ID,
    resourceId
  })

export default ActionTypes;
