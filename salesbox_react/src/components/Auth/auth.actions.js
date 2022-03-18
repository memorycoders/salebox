// @flow
import type { LoginActionT, RegisterActionT, CheckExistedActionT, ForgotPassActionT } from './auth.types';

const ActionTypes = {
  // Other
  STATUS_REQUEST: 'auth/status/request',
  STATUS_FAIL: 'auth/status/fail',
  STATUS: 'auth/status',
  UPDATE_PROFILE: 'profile/update',
  CHANGE_FORM: 'auth/changeForm',

  // Log in & Log out
  LOGIN_REQUEST: 'auth/login/request',
  LOGIN: 'auth/login',
  LOGIN_FAIL: 'auth/login/fail',
  LOGOUT_REQUEST: 'auth/logout/request',
  LOGOUT: 'auth/logout',
  LOGOUT_FAIL: 'auth/logout/fail',
  SUBMITTING_FORM: 'auth/form/submit',
  STOP_SUBMITTING_FORM: 'auth/form/submit/stop',
  CALL_API_LOGOUT: 'auth/callApiLogout',
  // Sign up
  REGISTER_REQUEST: 'auth/register/request',
  REGISTER_FAIL: 'auth/register/fail',
  REGISTER: 'auth/register',
  SIGN_UP_LANG_SET: 'auth/signup/lang/set',

  // Sign up: UI Transition
  REGISTER_PHONE_FILL: 'auth/register/phone/fill',
  SIGN_UP_TOU_OPEN: 'auth/signup/tou/open',
  SIGN_UP_TOU_CLOSE: 'auth/signup/tou/close',
  SIGN_UP_TOU_ACCEPT: 'auth/signup/tou/accept',

  // Forgot password
  // UI Transition
  FORGOT_PASS_MODE: 'auth/forgot/pass/mode',
  SET_PASS_MODE: 'auth/set/pass/mode',
  LOGIN_MODE: 'auth/login/mode',

  // API Actions
  CHECK_EXISTED_MAIL: 'auth/check/existed/email',
  CHECK_EXISTED_MAIL_FAIL: 'auth/check/existed/email/fail',
  FORGOT_PASS_MAIL_SAVE: 'auth/forgot/pass/mail/save',
  FORGOT_PASS_REQUEST: 'auth/forgot/pass/request', // Set New Pass.
  FORGOT_PASS_REQUEST_FAIL: 'auth/forgot/pass/request/fail',

  // Wizard Flow
  FETCH_USER_BY_ID_REQUEST: 'auth/user/id/fetch/request',
  FETCH_USER_BY_ID_SUCCESS: 'auth/user/id/fetch/success',
  FETCH_USER_BY_ID_FAIL: 'auth/user/id/fetch/fail',

  // Update Personal Info
  REQUEST_UPDATE_PERSONAL_INFO: 'auth/user/requestUpdate/personalInfo',

  SIGN_UP_SAVE_STORE: 'auth/signup/saveStore',
  CHECK_TO_LOGOUT: 'auth/checkToLogout',
  CHECK_LAST_LOGIN: 'auth/checkLastLogin',
  AUTO_LOGIN_FORTNOX: 'auth/autoLoginFortnox'
};

// ------------------------------------
// Feature: Others
// ------------------------------------
export const status = () => ({
  type: ActionTypes.STATUS,
});
export const callApiLogout = () => ({type: ActionTypes.CALL_API_LOGOUT});
export const requestStatus = () => ({
  type: ActionTypes.STATUS_REQUEST,
});

export const updateProfile = (values: {}) => ({
  type: ActionTypes.UPDATE_PROFILE,
  values,
});
export const changeForm = () => ({
  type: ActionTypes.CHANGE_FORM,
});
export const startSubmitForm = () => ({
  type: ActionTypes.SUBMITTING_FORM,
});
export const stopSubmitForm = () => ({
  type: ActionTypes.STOP_SUBMITTING_FORM,
});

// ------------------------------------
// Feature: Sign In & Logout
// ------------------------------------
export const requestLogin = (username: string, password: string, rememberMe: boolean): LoginActionT => ({
  type: ActionTypes.LOGIN_REQUEST,
  username,
  password,
  rememberMe,
});

export const requestLogout = (reloadPage) => ({
  type: ActionTypes.LOGOUT_REQUEST,
  reloadPage
});

// ------------------------------------
// Feature: Sign Up
// ------------------------------------
export const requestRegister = (
  firstName: string,
  lastName: string,
  email: string,
  country: string,
  industry: string,
  phone: string,
  password: string,
  languageCode: string
): RegisterActionT => ({
  type: ActionTypes.REGISTER_REQUEST,
  firstName,
  lastName,
  email,
  country,
  industry,
  phone,
  password,
  languageCode,
});

export const phoneFill = (prefix: string) => ({
  type: ActionTypes.REGISTER_PHONE_FILL,
  prefix,
});

export const signUpToUOpen = () => ({
  type: ActionTypes.SIGN_UP_TOU_OPEN,
});

export const signUpToUClose = () => ({
  type: ActionTypes.SIGN_UP_TOU_CLOSE,
});

export const signUpToUAccept = () => ({
  type: ActionTypes.SIGN_UP_TOU_ACCEPT,
});

// export const signUpLangSet = (languageCode: string) => ({
//   type: ActionTypes.SIGN_UP_LANG_SET,
//   languageCode,
// });

// Feature: Forgot password
export const switchModeForgotPassword = () => ({
  type: ActionTypes.FORGOT_PASS_MODE,
});

export const switchModeSetPassword = () => ({
  type: ActionTypes.SET_PASS_MODE,
});

// Include of Sign Up Tab (Back Button)
export const switchModeSignIn = () => ({
  type: ActionTypes.LOGIN_MODE,
});

export const checkExistedEmail = (email: string): CheckExistedActionT => ({
  type: ActionTypes.CHECK_EXISTED_MAIL,
  email,
});

export const requestForgotMailSave = (email: string) => ({
  type: ActionTypes.FORGOT_PASS_MAIL_SAVE,
  email,
});

export const requestForgotPass = (email: string, pass: string): ForgotPassActionT => ({
  type: ActionTypes.FORGOT_PASS_REQUEST,
  email,
  pass,
});

// Wizard Flow
export const fetchUserByIdRequest = () => ({
  type: ActionTypes.FETCH_USER_BY_ID_REQUEST,
});

export const handleLogin = (data) => ({
  type: ActionTypes.LOGIN,
  ...data,
});

export const requestUpdatePersonalInfo = () => ({
  type: ActionTypes.REQUEST_UPDATE_PERSONAL_INFO
})
export const signUpSaveStore=(form:{})=>({
  type: ActionTypes.SIGN_UP_SAVE_STORE,
  form
});
export const signUpCleanStore=()=>({
  type: ActionTypes.SIGN_UP_SAVE_STORE,
  form:{
  }
});
export const checkToLogout = () => ({
  type: ActionTypes.CHECK_TO_LOGOUT
});
export const checkLastLogin = () => ({
  type: ActionTypes.CHECK_LAST_LOGIN
});

export const autoLoginFortnox = (sessionId) => ({
  type: ActionTypes.AUTO_LOGIN_FORTNOX,
  sessionId
})
export default ActionTypes;
