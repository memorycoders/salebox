// @flow
import { call, put, takeLatest, select } from 'redux-saga/effects';
import api from 'lib/apiClient';
import newApi from 'lib/apiClientNew';
import { startSubmit, stopSubmit } from 'redux-form';

import md5 from 'browser-md5';

import authSchema from './auth.schema';
import { userSchema } from '../User/user.schema';

import { type LoginActionT, type RegisterActionT, type ForgotPassActionT, type SetPassActionT } from './auth.types';

import * as NotificationActions from 'components/Notification/notification.actions';
import AuthActions from './auth.actions';
import AppActions from 'components/App/app.actions';
import WizardActions from 'components/Wizard/wizard.actions';
import { requestFetchDisplaySettings, requestUpdateDisplaySetting } from '../Settings/settings.actions';
import _l from 'lib/i18n';
// FIXME: Convert theme as constants
// Endpoints
const enterpriseEndPoints = 'enterprise-v3.0';
const statusResponseSuccess = 'SUCCESS';

export const getUserId = (state) => state.auth.userId;

import { type StoreT } from 'store';
import { initCommonData, fetchCurrency } from '../App/app.saga';
import { allowedSendEmail, disconnectSocket, setVisibleNotiAddFortnoxFirst } from '../Common/common.actions';

import config from '../../../config/index';
import { Endpoints } from '../../Constants';

export function* requestRegister({
  firstName,
  lastName,
  email,
  country,
  industry,
  phone,
  password,
  languageCode,
  form,
}: RegisterActionT): Generator<*, *, *> {
  yield put(startSubmit(form));
  try {
    const body = {
      numberOfLicense: '50',
      companyDTO: {
        name: '',
        country: country,
        phone: phone,
        email: email,
      },
      userDTO: {
        password: md5(password),
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        discProfile: 'NONE',
        huntingFarmingRatio: 50,
      },
      languageCode: languageCode,
      industry: industry,
    };

    // FIXME: timezone param is hard code.
    const query = { platform: 'WEB', timezone: 7, react: true };
    yield put({ type: AuthActions.SUBMITTING_FORM });
    const data = yield call(api.register, body, query, authSchema);

    // FIXME: Re-organize the data.
    yield put({ type: AuthActions.REGISTER, ...data });

    yield put({ type: AuthActions.STOP_SUBMITTING_FORM });
    yield put(stopSubmit(form));
    // yield put(NotificationActions.success('SIGNED_UP_SUCCESSFULLY'));
  } catch (e) {
    yield put({ type: AuthActions.REGISTER_FAIL, message: e.message });
    // yield put(NotificationActions.error(e.message));
    yield put({ type: AuthActions.STOP_SUBMITTING_FORM });
    yield put(stopSubmit(form, { _error: e.message }));
  }
}

// FIXME: Remove the MD5 hashing....
export function* requestLogin({ username, password, rememberMe, form }: LoginActionT): Generator<*, *, *> {
  yield put(startSubmit(form));
  try {
    const state = yield select();

    const body = {
      username,
      hashPassword: md5(password),
      webPlatform: false,
      deviceToken: 'WEB_TOKEN',
      version: '3.0',
    };
    let query = {};
    if (state.common?.authrizationCodeFortnox) {
      query = { username, authorizationCode: state.common?.authrizationCodeFortnox };
    } else {
      query = { username };
    }
    yield put({ type: AuthActions.SUBMITTING_FORM });
    const data = yield call(api.login, body, query, authSchema);

    const { entities, result } = data;

    yield console.log('=========LOGIN:', data);
    if (entities.auth && result && entities.auth[result]) {
      yield put({ type: AppActions.SET_LOCALE, locale: entities.auth[result].languageCode });
      yield put({ type: AppActions.SET_HELP_MODE, helpMode: entities.auth[result].helpMode });
      yield put({ type: AppActions.RULE_PACKAGE, enterprisePackageType: entities.auth[result].enterprisePackageType });
      //
      yield put({ type: AppActions.UPDATE_LAST_TIME_USED });
    }
    yield put({ type: AuthActions.LOGIN, ...data });
    yield put(requestFetchDisplaySettings());
    yield put({ type: 'SAVE_REMEMBER', remember: data });

    yield put({ type: AuthActions.STOP_SUBMITTING_FORM });
    yield put({ type: WizardActions.START, isMainContact: entities.user[result].isMainContact });
    yield put(stopSubmit(form));
    yield call(initCommonData);
    yield call(fetchCurrency);
    // yield put(NotificationActions.success('SIGNEDIN_SUCCESSFULLY'));

    if (state.common?.authrizationCodeFortnox && !entities.auth[result].extraPackage.includes('FORT_NOX')) {
      // show popup
      yield put(setVisibleNotiAddFortnoxFirst(true));
    }
    if (state.common?.authrizationCodeFortnox) {
      const res = yield call(newApi.get, {
        resource: `integration-v3.0/fortNox/startSyncFortNox`,
        query: {
          token: entities.user[result].token,
        },
      });
      if (res) {
        // show popup sync in 48h
        yield put(
          NotificationActions.success(
            'Salesbox has started to import your companies, contacts, orders and articles from Fortnox and this can take up to 48h depending on how much information you have in Fortnox. You can of course work with the information as soon as its been added to Salesbox.',
            'Notification'
          )
        );
      }
    }
  } catch (e) {
    yield put({ type: AuthActions.LOGIN_FAIL, message: e.message });
    // yield put(NotificationActions.error('System is under maintenance. Please try again later'));
    yield put({ type: AuthActions.STOP_SUBMITTING_FORM });
    yield put(stopSubmit(form, { _error: e.message }));
  }
}

export function* changeForm(): Generator<*, *, *> {
  yield put(AuthActions.CHANGE_FORM);
}
// Feature: Forgot password
export function* requestCheckExisted({ email, form }: CheckExistedActionT): Generator<*, *, *> {
  yield put(startSubmit(form));
  try {
    const query = { email };
    const response = yield call(api.existedEmail, query);

    if (response === statusResponseSuccess) {
      yield put({ type: AuthActions.FORGOT_PASS_MAIL_SAVE, email });
      yield put({ type: AuthActions.SET_PASS_MODE });
      yield put(stopSubmit(form));
      // yield put(NotificationActions.success('Your request forgot password mail is qualified!'));
    }
  } catch (e) {
    yield put({ type: AuthActions.CHECK_EXISTED_MAIL_FAIL, message: e.message });
    // yield put(NotificationActions.error(e.message));
    yield put(stopSubmit(form, { _error: e.message }));
  }
}

export function* requestSetPasswordNew({ email, pass, form }: ForgotPassActionT): Generator<*, *, *> {
  yield put(startSubmit(form));
  try {
    const body = {
      email,
      hashNewPassword: md5(pass),
    };
    const query = { email, react: true };
    const response = yield call(api.forgotNewPass, body, query);

    if (response === statusResponseSuccess) {
      yield put({
        type: AuthActions.LOGIN_MODE,
        message: 'You have received an email. Please follow the instruction to update the password.',
      });
      yield put(stopSubmit(form));
      // yield put(
      //   NotificationActions.success(
      //     'An email has been sent to your email address. Please follow instruction to reset password.'
      //   )
      // );
    }
  } catch (e) {
    yield put({ type: AuthActions.FORGOT_PASS_REQUEST_FAIL, message: e.message });
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
    yield put(stopSubmit(form, { _error: e.message }));
  }
}

export function* requestLogout(): Generator<*, *, *> {
  // yield put(requestUpdateDisplaySetting());
  yield put({ type: 'CLEAR_REMEMBER' });
  yield put({ type: AuthActions.LOGOUT });
  yield put(allowedSendEmail(false));
  yield put(disconnectSocket());
  // yield put(NotificationActions.success('SIGNEDOUT_OUT_SUCCESSFULLY'));
  // try {
  //   const data = yield call(api.logout);
  //   yield put({ type: AuthActions.LOGOUT, ...data });
  //   yield put(NotificationActions.success('SIGNEDOUT_OUT_SUCCESSFULLY'));
  // } catch (e) {
  //   yield put({ type: AuthActions.LOGOUT_FAIL, message: e.message });
  // }
}
export function* checkToLogout(): Generator<*, *, *> {
  const state = yield select();
  if (!!state.auth.token) {
    yield put({ type: AuthActions.LOGOUT_REQUEST });
  }
}
export function* checkLastLogin(): Generator<*, *, *> {
  const state = yield select();
  if (!!state.auth.token && state.ui.app.lastTimeUsed != null) {
    if (new Date().getTime() - state.ui.app.lastTimeUsed > config.timeLive) {
      yield put({ type: AuthActions.CHECK_TO_LOGOUT });
    }
  }
}

export function* fetchUserByIdRequest(): Generator<*, *, *> {
  try {
    const userId = yield select(getUserId);
    const data = yield call(api.get, {
      resource: `${enterpriseEndPoints}/user/${userId}`,
      schema: userSchema,
    });
    yield put({ type: AuthActions.FETCH_USER_BY_ID_SUCCESS, values: data.entities.user[data.result] });
    yield put({
      type: 'REMEMBER_UPDATE_DATA',
      action: { firstLogin: data.entities.user[data.result].firstLogin },
    });
  } catch (e) {
    yield put({ type: AuthActions.FETCH_USER_BY_ID_FAIL, message: e.message });
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

function* updatePersonalInfo(): Generator<*, *, *> {
  try {
    const state = yield select();

    let userId = state.auth.userId;
    let body = state.profile[userId];

    const data = yield call(api.post, {
      resource: `${enterpriseEndPoints}/user/updatePersonalInfo`,
      data: {
        ...body,
        firstName: state.auth.user.firstName,
        lastName: state.auth.user.lastName,
        discProfile: state.auth.user.discProfile,
        avatar: state.auth.user.avatar,
      },
    });

    if (data) {
      yield put(NotificationActions.success(`Updated`, '', 2000));
      yield put({
        type: 'REMEMBER_UPDATE_DATA',
        action: { firstName: data.firstName, lastName: data.lastName, discProfile: data.discProfile },
      });
    }
  } catch (e) {
    // yield put(NotificationActions.error(_l`Oh, something went wrong`));
  }
}

function* autoLoginFortnox({ sessionId }) {
  console.log('COME EREER', sessionId);
  try {
    const data = yield call(api.post, {
      resource: `enterprise-v3.0/fortNox/autoLogin`,
      query: {
        sessionId,
      },
      schema: authSchema,
    });
    if (data) {
      const { entities, result } = data;

      // yield put(requestLogout());

      yield put({ type: AuthActions.LOGIN, ...data });

      if (entities.auth && result && entities.auth[result]) {
        yield put({ type: AppActions.SET_LOCALE, locale: entities.auth[result].languageCode });
        yield put({ type: AppActions.SET_HELP_MODE, helpMode: entities.auth[result].helpMode });
        yield put({
          type: AppActions.RULE_PACKAGE,
          enterprisePackageType: entities.auth[result].enterprisePackageType,
        });
        //
        yield put({ type: AppActions.UPDATE_LAST_TIME_USED });
      }
      yield put(requestFetchDisplaySettings());
      yield put({ type: 'SAVE_REMEMBER', remember: data });

      yield put({ type: WizardActions.START, isMainContact: entities.user[result].isMainContact });
      yield call(initCommonData);
      yield call(fetchCurrency);
      // yield put(NotificationActions.success('SIGNEDIN_SUCCESSFULLY'));

      yield console.log("FUCKKKKKKKKKK:", newApi, api);
        const res = yield call(newApi.get, {
          resource: `integration-v3.0/fortNox/startSyncFortNox`,
          query: {
            token: entities.user[result].token,
          },
        });

    }
  } catch (e) {
    console.log('========.>>RRRRORROOROR:', e);
  }
}
function* callApiLogout() {
  try {

    const res = yield call(api.post, {
      resource: `enterprise-v3.0/user/logout`
    })
  } catch(e) {

  }
}
export default function* saga(): Generator<*, *, *> {
  // Feature: Register
  yield takeLatest(AuthActions.REGISTER_REQUEST, requestRegister);

  // Feature: Login & Logout
  yield takeLatest(AuthActions.LOGIN_REQUEST, requestLogin);
  yield takeLatest(AuthActions.LOGOUT_REQUEST, requestLogout);
  yield takeLatest(AuthActions.CHECK_TO_LOGOUT, checkToLogout);
  yield takeLatest(AuthActions.CHECK_LAST_LOGIN, checkLastLogin);

  // yield takeLatest(AuthActions.CHANGE_FORM, changeForm);
  // Feature: Forgot password
  yield takeLatest(AuthActions.CHECK_EXISTED_MAIL, requestCheckExisted);
  yield takeLatest(AuthActions.FORGOT_PASS_REQUEST, requestSetPasswordNew);

  // Wizard Flow
  yield takeLatest(AuthActions.FETCH_USER_BY_ID_REQUEST, fetchUserByIdRequest);
  yield takeLatest(AuthActions.REQUEST_UPDATE_PERSONAL_INFO, updatePersonalInfo);
  yield takeLatest(AuthActions.AUTO_LOGIN_FORTNOX, autoLoginFortnox);
  yield takeLatest(AuthActions.CALL_API_LOGOUT, callApiLogout)
}
