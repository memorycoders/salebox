// @flow
import createReducer from 'store/createReducer';
import AuthActions from './auth.actions';
import { actionTypes } from 'redux-form';

export const initialState = {
  token: null,
  enterpriseID: null,
  userId: null,
  prefix: null, // FIXME: (hle) SignUpForm for phone prefix per country.
  user: {},
  company: {},
  form: {
    register: {
      // FIXME: (hle) SignUpForm on Response Successfully.
      response: {
        status: false,
        additionInfo: null,
        statusCode: null,
      },
      init: {
        phone: '',
        // country: null,
        // firstName: "",
        // lastName: "",
        // email: "",
        // password: "",
      },
    },
    forgotPass: {
      mode: 0, // 0: Login, 1: Forgot Pass, 2: Set Pass.
      msg: null,
      email: null,
    },
  },
  // TODO: Do refactoring state of store here! (Move from "form" state object).
  __FORM: {
    _SIGN_UP: {
      isToUOpened: false,
      languageCode: 'en',
    },
    _LOGIN: {},
    _FORGOT_PASS: {},
  },
  submitting: false,
};

const handleLogin = (draft, action) => {
  const {
    entities: { user, auth, newIndustry },
    result, // NOTE: result as uuid of an object.
  } = action;

  draft.token = user[result].token;
  draft.enterpriseID = auth[result].enterpriseId;
  draft.userId = result;
  draft.user = user[result];
  draft.company = draft.company || {};
  draft.company.name = auth[result].companyName;
  draft.company.avatar = auth[result].companyAvatarId;
  draft.company.newIndustry = auth[result].newIndustry;
  draft.admin = auth[result].admin;

  draft.messageError = null;
  // Prod
  draft.user.isMainContact = user[result].isMainContact;
  draft.user.firstLogin = user[result].firstLogin;
  draft.user.country = auth[result].country;
  // Testing Purpose
  // Corp
  // draft.user.isMainContact = true;
  // draft.user.firstLogin = true;

  // Personal
  // draft.user.isMainContact = false;
  // draft.user.firstLogin = true;
};

const handleLoginFail = (draft, action) => {
  const { message } = action;
  draft.messageError = message;
};
// FIXME: Handle on mapping country list in the future.
const handleDetectedCountry = (draft, action) => {
  if (action.countryCode.includes('VN')) {
    draft.__FORM._SIGN_UP.languageCode = 'vi';
  }

  if (action.countryCode.includes('EN')) {
    draft.__FORM._SIGN_UP.languageCode = 'en';
  }

  if (action.countryCode.includes('NO') || action.countryCode.includes('NB') || action.countryCode.includes('NN')) {
    draft.__FORM._SIGN_UP.languageCode = 'no';
  }

  if (action.countryCode.includes('ES')) {
    draft.__FORM._SIGN_UP.languageCode = 'es';
  }

  if (action.countryCode.includes('PT')) {
    draft.__FORM._SIGN_UP.languageCode = 'pt';
  }

  if (action.countryCode.includes('DE')) {
    draft.__FORM._SIGN_UP.languageCode = 'de';
  }
};

const handleRegister = (draft, action) => {
  // FIXME: The return data is too strange.
  draft.form.register.response.status = action.entities.auth.null.status;
  draft.form.register.response.additionInfo = action.entities.auth.null.additionInfo;
  draft.form.register.response.statusCode = action.entities.auth.null.statusCode;
};

export default createReducer(initialState, {
  // Feature: Others
  [AuthActions.STATUS]: (draft, action) => {
    draft.token = action.token;
    draft.enterpriseID = action.enterpriseID;
  },
  [AuthActions.UPDATE_PROFILE]: (draft, { values }) => {
    Object.keys(values).forEach((key) => {
      draft.user[key] = values[key];
    });
  },
  [AuthActions.CHANGE_FORM]: (draft) => {
    draft.messageError = null;
    draft.form.register.response.status = false;
    draft.__FORM._LOGIN.message = undefined;
    draft.form.register.response.statusCode = null;
  },

  [AuthActions.SUBMITTING_FORM]: (draft) => {
    draft.__FORM._LOGIN.submitting = true;
  },
  [AuthActions.STOP_SUBMITTING_FORM]: (draft) => {
    draft.__FORM._LOGIN.submitting = false;
  },
  // Feature: Sign In & Logout
  [AuthActions.LOGIN]: handleLogin,
  [AuthActions.LOGOUT]: (draft) => {

    Object.keys(initialState).forEach((key) => {
      draft[key] = initialState[key];
    });
  },
  [AuthActions.LOGOUT_REQUEST] : (draft, {reloadPage}) => {

    draft.token = null;

    if(reloadPage) {
      try {
        window.location.reload();
      }catch(ex){
      console.log("ex", ex)
      }
    }

  },
  [AuthActions.LOGIN_FAIL]: handleLoginFail,

  // Feature: Sign Up
  [AuthActions.REGISTER]: handleRegister,
  [AuthActions.REGISTER_PHONE_FILL]: (draft, action) => {
    draft.prefix = action.prefix;
  },
  [AuthActions.SIGN_UP_TOU_OPEN]: (draft, action) => {
    draft.__FORM._SIGN_UP.isToUOpened = true;
  },
  [AuthActions.SIGN_UP_TOU_CLOSE]: (draft, action) => {
    draft.__FORM._SIGN_UP.isToUOpened = false;
  },
  [AuthActions.SIGN_UP_TOU_ACCEPT]: (draft, action) => {
    draft.__FORM._SIGN_UP.isToUOpened = false;
  },
  [AuthActions.SIGN_UP_LANG_SET]: handleDetectedCountry,

  // Feature: Forgot password
  [AuthActions.FORGOT_PASS_MODE]: (draft, action) => {
    draft.form.forgotPass.mode = 1;
    draft.form.forgotPass.errorMessage = undefined;
  },
  [AuthActions.SET_PASS_MODE]: (draft, action) => {
    draft.form.forgotPass.mode = 2;
  },
  [AuthActions.CHECK_EXISTED_MAIL_FAIL]: (draft, action) => {
    draft.form.forgotPass.errorMessage = action.message;
  },
  [AuthActions.LOGIN_MODE]: (draft, action) => {
    draft.form.forgotPass.mode = 0;
    draft.__FORM._LOGIN.message = action.message;
  },
  [AuthActions.FORGOT_PASS_MAIL_SAVE]: (draft, action) => {
    draft.form.forgotPass.email = action.email;
  },
  [AuthActions.REGISTER_REQUEST]: (draft, action) => {
    draft.form.register.response.statusCode = null;
  },
  [AuthActions.REGISTER_FAIL]: (draft, action) => {
    draft.form.register.response.statusCode = action.message;
  },
  [actionTypes.START_SUBMIT]: (draft) => {
    draft.submitting = true;
  },
  [actionTypes.STOP_SUBMIT]: (draft) => {
    draft.submitting = false;
  },
  // Wizard Flow
  [AuthActions.FETCH_USER_BY_ID_SUCCESS]: (draft, action) => {
    draft.user = action.values;
  },
  [AuthActions.SIGN_UP_SAVE_STORE]: (draft, {form}) => {
    draft.__FORM._SIGN_UP = {...draft.__FORM._SIGN_UP,
    data: form};
  },
});
