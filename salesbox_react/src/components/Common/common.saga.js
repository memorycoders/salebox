// import { takeLatest } from "redux-saga";
import CommonActionType, {
  setShowHideMail,
  showHideSuggestForm,
  fetchDocumentsByFileIdSuccess,
  fetchDocumentsByFileIdFail,
  fetchGetRootFolderSuccess,
  fetchDocumentsStorageSuccess,
  setOfficeLostToken,
  setSpecialTask,
} from './common.actions';
import { put, select, takeLatest, call, all } from 'redux-saga/effects';
import api from 'lib/apiClient';
import * as NotificationActions from 'components/Notification/notification.actions';
import _l from 'lib/i18n';
import { ver, OverviewTypes, FORM_KEY, Endpoints } from '../../Constants';
import { setActionForHighlight } from '../Overview/overview.actions';
import { createEntity } from '../Task/task.actions';
import { takeEvery } from 'redux-saga';
import * as QualifiedActions from '../../components/PipeLineQualifiedDeals/qualifiedDeal.actions';
import * as ContactActions from '../../components/Contact/contact.actions';
import * as AccountActions from '../../components/Organisation/organisation.actions';

addTranslations({
  'en-US': {},
});
const documentEndPoints = `document-${ver}`;
function* checkShowHidePersonalMail({ status }) {
  let _commonState = yield select((state) => state.common);
  if (status) {
    if (_commonState.accountAllowedSendEmail) {
      yield put(setShowHideMail(true));
    } else {
      yield put(
        NotificationActions.info(`You need to connect an Office365 or Gmail account to Salesbox first`, 'Info')
      );
    }
  } else {
    yield put(setShowHideMail(false));
  }
}

export function* getSpecialTask() {
  let query = {
    pageIndex: 0,
    pageSize: 1000,
    type: 'lead',
  };
  const _listData = yield all([
    call(api.get, {
      query,
      resource: `task-${ver}/list/focus/NULL`,
    }),
    call(api.get, {
      query,
      resource: `task-${ver}/listTag`,
    }),
  ]);
  let _listFocus = _listData[0] ? _listData[0].workDataActivityDTOList : null;
  let _listTag = _listData[1] ? _listData[1].tagDTOList : null;
  let IDENTIFY_LEAD_CONTACT, QUALIFY_LEAD, FOLLOW_UP_LEAD, EXTERNAL_FOLLOW_UP;
  if (_listFocus) {
    _listFocus.forEach(function(element) {
      if (element.keyCode == 'IDENTIFY_LEAD_CONTACT') {
        IDENTIFY_LEAD_CONTACT = element;
      }
      if (element.keyCode == 'QUALIFY_LEAD') {
        QUALIFY_LEAD = element;
      }
      if (element.keyCode == 'FOLLOW_UP_LEAD') {
        FOLLOW_UP_LEAD = element;
      }
    });
  }

  if (_listTag) {
    _listTag.forEach(function(tag) {
      if (tag.color == 'GREEN') {
        EXTERNAL_FOLLOW_UP = tag;
      }
    });
  }
  let _specialTask = {
    IDENTIFY_LEAD_CONTACT: IDENTIFY_LEAD_CONTACT,
    QUALIFY_LEAD: QUALIFY_LEAD,
    FOLLOW_UP_LEAD: FOLLOW_UP_LEAD,
    EXTERNAL_FOLLOW_UP: EXTERNAL_FOLLOW_UP,
  };
  yield put(setSpecialTask(_specialTask));
  return _specialTask;
}

function* createQualifyDealTaskOrIdentifyContact({ data }) {
  const __common = yield select((state) => state.common);
  let _specialTask;
  if (Object.keys(__common.specialTask).length === 0) {
    _specialTask = yield call(getSpecialTask);
  } else {
    _specialTask = __common.specialTask;
  }
  if (data.contactId) {
    let _form = {
      leadId: data.uuid,
      organisationId: data.organisationId,
      contactId: data.contactId,
      contactName:
        (data.contactFirstName ? data.contactFirstName : '') + ' ' + (data.contactLastName ? data.contactLastName : ''),
      focusWorkData: _specialTask.QUALIFY_LEAD,
      tagDTO: _specialTask.EXTERNAL_FOLLOW_UP,
    };
    yield put(createEntity(FORM_KEY.CREATE, _form));
    yield put(setActionForHighlight(OverviewTypes.Activity.Task, 'create'));
  } else {
    let _authState = yield select((state) => state.auth);
    let taskDTO = {
      uuid: null,
      dateAndTime: null,
      organisationId: data.organisationId,
      prospectId: null,
      ownerId: _authState.user.uuid,
      contactId: null,
      type: 'MANUAL',
      note: data.note,
      focusWorkData: {
        uuid: _specialTask.IDENTIFY_LEAD_CONTACT.uuid,
      },
      focusActivity: null,
      leadId: data.uuid,
      tagDTO: {
        uuid: _specialTask.EXTERNAL_FOLLOW_UP.uuid,
      },
    };
    const _responseTask = yield call(api.post, {
      resource: `task-${ver}/add`,
      data: taskDTO,
    });
    if (_responseTask) {
      yield put(NotificationActions.success(_l`Added`, '', 2000));
    }
  }
  yield put(showHideSuggestForm(false, null));
}

//Fetch document Storage
function* fetchDocumentsStorage() {
  try {
    const res = yield call(api.get, {
      resource: `${Endpoints.Enterprise}/storage/list`,
    });
    const data = yield call(api.get, {
      resource: `${Endpoints.Enterprise}/storage/listPersonalStorage`,
    });
    yield put(
      fetchDocumentsStorageSuccess({
        storageDTOList: res.storageDTOList,
        userStorageIntegrationDTOList: data.userStorageIntegrationDTOList,
      })
    );
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

function* fetchGetRootFolder({ uuid, disableFetchDoc }) {
  let _commonState = yield select((state) => state.common);
  let _endPoint = Endpoints.Prospect;
  let _router = 'listByProspectIdAndFolder';
  switch (_commonState.currentOverviewType) {
    case OverviewTypes.CallList.Account:
    case OverviewTypes.Account:
      _endPoint = Endpoints.Organisation;
      _router = 'listByOrganisationIdAndFolder';
      break;
    case OverviewTypes.CallList.Contact:
    case OverviewTypes.Contact:
      _endPoint = Endpoints.Contact;
      _router = 'listByContactIdAndFolder';
      break;
  }
  try {
    const res = yield call(api.get, {
      resource: `${_endPoint}/getRootFolder/${uuid}`,
    });
    let rootFolder = { ...res };
    if (res && !disableFetchDoc) {
      const data = yield call(api.get, {
        resource: `${documentEndPoints}/document/${_router}/${uuid}`,
        query: {
          folderId: res.fileId,
        },
      });
      let rootFolder = { ...res };
      yield put(
        fetchGetRootFolderSuccess({
          documentDTOList: data.documentDTOList,
          numberDocument: data.numberDocument,
          rootFolder: rootFolder,
        })
      );
    }
    return rootFolder;
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

function* fetchDocumentsByFileId({ uuid, fileId }) {
  let _commonState = yield select((state) => state.common);
  let _url = `${documentEndPoints}/document/listByProspectIdAndFolder/${uuid}`;
  switch (_commonState.currentOverviewType) {
    case OverviewTypes.CallList.Account:
    case OverviewTypes.Account:
      _url = `${documentEndPoints}/document/listByOrganisationIdAndFolder/${uuid}`;
      break;
    case OverviewTypes.CallList.Contact:
    case OverviewTypes.Contact:
      _url = `${documentEndPoints}/document/listByContactIdAndFolder/${uuid}`;
      break;
  }
  try {
    const data = yield call(api.get, {
      resource: _url,
      query: {
        folderId: fileId,
      },
    });
    if (data) {
      yield put(fetchDocumentsByFileIdSuccess({ documentDTOList: data.documentDTOList }, true));
    }
  } catch (error) {
    yield put(fetchDocumentsByFileIdFail());
    yield put(NotificationActions.error(error.message));
  }
}

function* uploadFileToCloud({ file }) {
  const _common = yield select((state) => state.common);
  let objectType = 'ACCOUNT';
  switch (_common.currentOverviewType) {
    case OverviewTypes.Account:
      objectType = 'ACCOUNT';
      break;
    case OverviewTypes.Contact:
      objectType = 'CONTACT';
      break;
    case OverviewTypes.Pipeline.Qualified:
      objectType = 'OPPORTUNITY';
      break;
    case OverviewTypes.Pipeline.Order:
      objectType = 'OPPORTUNITY';
      break;
  }
  let rootFolder = yield call(fetchGetRootFolder, { uuid: _common.__DOCUMENTS.objectId, disableFetchDoc: true });
  if (rootFolder == null || rootFolder.fileId == null) {
    // return yield put(NotificationActions.error('Error connecting to Google Drive'));
    return;
  }
  try {
    let formData = new FormData();
    formData.append('uploadFile', file);
    yield call(api.post, {
      resource: 'document-v3.0/document/putFileToCloud',
      data: formData,
      query: {
        objectType: objectType,
        objectId: _common.__DOCUMENTS.objectId,
        folderId: rootFolder ? rootFolder.fileId : null,
      },
      options: {
        headers: {
          'content-type': 'multipart/form-data;',
        },
      },
    });
    yield call(fetchGetRootFolder, { uuid: _common.__DOCUMENTS.objectId });
    // fetch number document of Deal
    const res = yield call(api.get, {
      resource: `${Endpoints.Document}/document/countByObject`,
      query: {
        objectType: objectType,
        objectId: _common.__DOCUMENTS.objectId,
      },
    });
    if (objectType === 'OPPORTUNITY') {
      yield put(QualifiedActions.updateNumberDocumentDetail(res));
    } else if (objectType === 'CONTACT') {
      yield put(ContactActions.updateNumberDocumentDetail(res));

    } else if (objectType === 'ACCOUNT') {
      yield put(AccountActions.updateNumberDocumentDetail(res));

    }
  } catch (error) {
    // yield put(NotificationActions.error(error.message));
  }
}

function* checkTokenIntegration() {
  try {
    const res = yield call(api.get, {
      resource: `${Endpoints.Enterprise}/checkTokenIntegrationValid`,
    });
    if (res && res.length > 0) {
      yield put(setOfficeLostToken(true, res));
    }
  } catch (ex) {}
}

export default function* saga(): Generator<*, *, *> {
  yield takeLatest(CommonActionType.SHOW_HIDE_MASS_PERSONAL_MAIL, checkShowHidePersonalMail);
  yield takeLatest(
    CommonActionType.CREATE_QUALIFY_DEAL_TASK_OR_IDENTIFY_CONTACT,
    createQualifyDealTaskOrIdentifyContact
  ),
    yield takeLatest(CommonActionType.FETCH_DOCUMENTS_STORAGE, fetchDocumentsStorage);
  yield takeLatest(CommonActionType.FETCH_DOCUMENTS_ROOT_FOLDER, fetchGetRootFolder);
  yield takeLatest(CommonActionType.FETCH_DOCUMENTS_BY_FILEID, fetchDocumentsByFileId);
  yield takeLatest(CommonActionType.UPLOAD_FILE_TO_CLOUD, uploadFileToCloud),
    yield takeLatest(CommonActionType.CHECK_TOKEN_INTEGRATION, checkTokenIntegration);
}
