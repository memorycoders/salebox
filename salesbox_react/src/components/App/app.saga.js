//@flow
import { put, call, select, takeLatest, fork, take, all } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';

// Redux Actions
import * as UserActions from 'components/User/user.actions';
import * as NotificationActions from 'components/Notification/notification.actions';
import AppActionTypes, * as AppActions from './app.actions';
import AuthActionTypes from 'components/Auth/auth.actions';
import * as OverviewActions from 'components/Overview/overview.actions';
import ContactActionTypes from 'components/Contact/contact.actions';
import CallListAccountActionTypes from 'components/CallListAccount/callListAccount.actions';
import OrganisationActionTypes from '../Organisation/organisation.actions'
import * as InsightActions from '../Insight/insight.actions';
import { getUser, isSignedIn } from 'components/Auth/auth.selector';
import { Endpoints } from 'Constants';

// API
import api from 'lib/apiClient';
import { OverviewTypes, ver } from '../../Constants';
import { allowedSendEmail, fetchDocumentsStorageSuccess, setStatusConnectTeams, setStorageIntegration, connectSocket, setStatusConnectStorage } from '../Common/common.actions';
import { defaultSections } from './app.ui.reducer';
import { requestFetchDisplaySettings } from '../Settings/settings.actions';
import { forEach } from 'lodash';
// Service: https://ipinfo.io/
// FIXME: Have to move to Global Constant.
const ipInfoToken = "afe034312b2ea7";
const ipInfoEP = "https://ipinfo.io/";

const repeat = (secs) =>
  eventChannel((emitter) => {
    const iv = setInterval(() => {
      secs += 1;
      if (secs > 0) {
        emitter(secs);
      } else {
        // this causes the channel to close
        emitter(END);
      }
    }, 1000);
    // The subscriber must return an unsubscribe function
    return () => {
      clearInterval(iv);
    };
  });

function* login(): Generator<*, *, *> {
  // fetch list user active & deactive
  yield put(UserActions.requestFetchList());
  yield put(UserActions.requestFetchListActive());
  yield put(NotificationActions.requestFetch());
  yield put(requestFetchDisplaySettings());
}

function* init(): Generator<*, *, *> {
  const state = yield select();
  const signedIn = isSignedIn(state);
  if (signedIn) {
    yield call(login);
    yield call(initCommonData);
    yield call(fetchCurrency);
  } else {
    // FIXME: Make it as action of redux through saga context.
    // yield put(AppActionTypes.DETECT_LOCALE_REQUEST);
    yield call(detectLocaleRequest);
  }
}

function* setHelpRequest({ helpMode }): Generator<*, *, *> {
  const app = select((state) => state.ui.app);
  if (app.helpMode !== helpMode) {
    yield put({ type: AppActionTypes.SET_HELP_MODE, helpMode });
    const user = yield select(getUser);
    yield call(api.post, {
      resource: `${Endpoints.Enterprise}/user/setting/update`,
      query: {
        key: 'HELP_MODE',
        value: helpMode,
        uuid: user.uuid,
      },
    });
  }
}

function* fetchAverageValues(): Generator<*, *, *> {
  const state = yield select();
  try {
    // const { averageValuesFetched } = state.ui.app;
    // if (!averageValuesFetched) {
      const averageValues = yield call(api.get, {
        resource: `${Endpoints.Organisation}/getAverageValues`,
      });
      yield put(AppActions.fetchAverageValues(averageValues));
    // }
  } catch (e) {
    yield put(AppActions.failFetchAverageValues(e.message));
  }
}

function* setLocaleRequest({ locale }): Generator<*, *, *> {
  const app = select((state) => state.ui.app);
  if (app.locale !== locale) {
    yield put({ type: AppActionTypes.SET_LOCALE, locale });
    const user = yield select(getUser);
    yield call(api.post, {
      resource: `${Endpoints.Enterprise}/user/setting/update`,
      query: {
        key: 'LANGUAGE',
        value: locale,
        uuid: user.uuid,
      },
    });
  }
}

function* detectLocaleRequest(): Generator<*, *, *> {
  try {
    const response = yield call(api.get, {
      resource: `${ipInfoEP}`,
      query: {
        token: ipInfoToken,
      },
    });

    yield put({ type: AuthActionTypes.SIGN_UP_LANG_SET, countryCode: response.country });

  } catch (e) {
    console.log(e);
  } finally {

  }
}

function* fetchPersonalStorage() {
  try {
    let res = yield all([
      yield call(api.get, {
        resource: `${Endpoints.Enterprise}/storage/list`,
      }),
      yield call(api.get, {
        resource: `${Endpoints.Enterprise}/storage/listPersonalStorage`,
      })
    ])
    let listPersonalStorage = res[1]
    let storageList = res[0]
    if(storageList && listPersonalStorage) {
    yield put(
      fetchDocumentsStorageSuccess(
        {
        storageDTOList: storageList.storageDTOList,
        userStorageIntegrationDTOList: listPersonalStorage.userStorageIntegrationDTOList,
        }
      ));
    }

    if(listPersonalStorage && listPersonalStorage.userStorageIntegrationDTOList) {
      let isAllowSendEmail = false;
      let mailServices = null;
      let isConnectTeam  = false
      listPersonalStorage.userStorageIntegrationDTOList.forEach(function (iter) {
        if (iter.type === "GOOGLE_WEB" || iter.type === "GOOGLE_IOS")
        {
          isAllowSendEmail = true;
          mailServices = 'Google';
        }

        if (iter.type === "OFFICE365_WEB" || iter.type === "OFFICE365_IOS")
        {
          isAllowSendEmail = true;
          mailServices = 'Microsoft';
        }
        if (iter.type === 'MS_TEAM') {
          isConnectTeam =  true;
        }
    });
    yield put(setStatusConnectTeams(isConnectTeam))

    if(isAllowSendEmail)
      yield put(allowedSendEmail(true, mailServices))
    }

    if(storageList) {
      let _connectStorage = false;
      const _listStorage = ["DROP_BOX", "GOOGLE_DRIVE", "ONE_DRIVE_FOR_BUSINESS"]
      forEach(storageList.storageDTOList, (_storage) => {
        if(_connectStorage) return;
        if(_listStorage.indexOf(_storage.type) !== -1) {
          _connectStorage = true;
        }
      })
      yield put(setStatusConnectStorage(_connectStorage))
    }
  } catch (e) {
  }
}


function* listPersonalStorage() {
  try {
    const res = yield call(api.get, {
      resource: `${Endpoints.Enterprise}/storage/listPersonalStorage`,
    });
    if (res && res.userStorageIntegrationDTOList) {
      let isLinkedOffice365 = false;
      let isLinkedTeam = false;
      let isOnCalendarOffice = false;
      res.userStorageIntegrationDTOList.forEach((iter) => {
        if (iter.type === 'OFFICE365_WEB' || iter.type === 'OFFICE365_IOS') {
          isLinkedOffice365 = true;
          iter.syncStatusDTOList.forEach((sync) => {
            if (sync.type === 'APPOINTMENT' && sync.status) isOnCalendarOffice = true;
          });
        }
        if (iter.type === 'MS_TEAM') {
          isLinkedTeam = true;
        }
      })
      yield put(setStorageIntegration({isLinkedOffice365, isLinkedTeam, isOnCalendarOffice}));
    }
  }catch(ex){
  }
};

export function* initCommonData() {
  yield put(connectSocket())
  yield call(fetchPersonalStorage);
  yield call(listPersonalStorage);

}

function* checkNotifications(): Generator<*, *, *> {
  // const chan = yield call(repeat, 1);
  // const secs = process.env.NODE_ENV === 'development' ? 1000 : 10;
  // try {
  //   while (true) {
  //     // take(END) will cause the saga to terminate by jumping to the finally block
  //     const seconds = yield take(chan);
  //     if (seconds % secs === 0) {
  //       yield put(NotificationActions.requestFetch());
  //     }
  //   }
  // } finally {
  //   console.log('countdown terminated');
  // }
}

function* resetOverviews(): Generator<*, *, *> {
  const state = yield select();
  const currentOverviewType = state.common.currentOverviewType;

  // yield put(OverviewActions.requestFetch(currentOverviewType, true));

  const location = state.router?.location?.pathname;

  if(currentOverviewType === OverviewTypes.Insight && location.includes('insights/resource')) {
    yield put(InsightActions.getReportResource());
  }
  yield all(
    Object.keys(state.overview).map((overviewType) => {
      return put(OverviewActions.requestFetch(overviewType, true));
    })
  );
}

export function* fetchCurrency(): Generator<*, *, *> {
  try {
    const data = yield call(api.get, {
      resource: `administration-v3.0/workData/workData/currency`,
    });
    if (data) {
      yield put(AppActions.updateCurrency(data.name));
    }
  } catch (error) {

  }
}


export function* fetchDetailSections(): Generator<*, *, *> {
  try {
    const data = yield call(api.get, {
      resource: `enterprise-v3.0/user/getDisplayInDetail`,
    });
    if (data) {
      yield put(AppActions.updateDetailSections(data));
    }
  } catch (error) {
    yield put(AppActions.updateDetailSections(defaultSections));
    //defaultSections
  }
}

export function* updateDetailSections(): Generator<*, *, *> {
  const state = yield select();
  const { detailSectionsDisplay } = state.ui.app;

  try {
    const data = yield call(api.post, {
      resource: `enterprise-v3.0/user/updateDisplayInDetail`,
      data:{
        ...detailSectionsDisplay
      }
    });
  } catch (error) {
  }
}

export function* updateLastTimeUsedRequest(): Generator<*, *, *> {
  const state = yield select();
  if (!!state.auth.token) {
    yield put(AppActions.updateLastTimeUsed());
  }
}


export default function* saga(): Generator<*, *, *> {
  if (process.browser) {
    yield fork(checkNotifications);
    yield takeLatest(AppActionTypes.INIT, init);
  }
  yield takeLatest(AppActionTypes.SET_ACTIVE_ROLE, resetOverviews);
  yield takeLatest(ContactActionTypes.FETCH_CONTACT_REQUEST, fetchAverageValues);
  yield takeLatest(CallListAccountActionTypes.FETCH_CALL_LIST_ACCOUNT_REQUEST, fetchAverageValues);
  yield takeLatest(OrganisationActionTypes.FETCH_ORGANISATION_REQUEST, fetchAverageValues);
  yield takeLatest(AuthActionTypes.LOGIN, login);
  yield takeLatest(AppActionTypes.SET_HELP_MODE_REQUEST, setHelpRequest);
  yield takeLatest(AppActionTypes.SET_LOCALE_REQUEST, setLocaleRequest);
  yield takeLatest(AppActionTypes.DETECT_LOCALE_REQUEST, detectLocaleRequest);
  yield takeLatest(AppActionTypes.FET_DETAIL_SECTIONS, fetchDetailSections);
  //UPDATE_CATEGORY_DETAIL_SECTIONS
  yield takeLatest(AppActionTypes.UPDATE_CATEGORY_DETAIL_SECTIONS, updateDetailSections);
  yield takeLatest(AppActionTypes.UPDATE_LAST_TIME_USED_REQUEST, updateLastTimeUsedRequest);
}
