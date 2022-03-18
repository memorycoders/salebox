// @flow
import { createSelector } from 'reselect';

// Sign In
export const isSignedIn = createSelector(
  (state) => state.auth.token,
  (token) => {
    return !!token;
  }
);

export const isFirstLogin = createSelector(
  (state) => state.auth.user.firstLogin,
  (firstLogin) => {
    return firstLogin;
  }
);

export const getMessageError = createSelector(
  (state) => state.auth.messageError,
  (messageError) => {
    return messageError;
  }
);

export const isSubmittingForm = createSelector(
  (state) => state.auth.__FORM._LOGIN.submitting,
  (submitting) => {
    return submitting;
  }
);
export const isSubmitting = createSelector(
  (state) => state.auth.submitting,
  (submitting) => {
    return submitting;
  }
);
// Sign Up
export const isSignedUp = createSelector(
  (state) => state.auth.form.register.response.status,
  (status) => {
    return status;
  }
);
export const isSignedSuccess = createSelector(
  (state) => state.auth.form.register.response.status,
  (status) => {
    return status;
  }
);

export const getFullPhone = createSelector(
  (state) => state.auth.prefix,
  (prefix) => {
    return '+' + prefix;
  }
);

export const isToUModalOpened = createSelector(
  (state) => state.auth.__FORM._SIGN_UP.isToUOpened,
  (isOpened) => {
    return isOpened;
  }
);

export const getDetectedDefaultLanguage = createSelector(
  (state) => state.auth.__FORM._SIGN_UP.languageCode,
  (lang) => {
    return lang;
  }
);

// Forgot password
export const getForgotPassMode = createSelector(
  (state) => state.auth.form.forgotPass.mode,
  (mode) => {
    return mode;
  }
);

export const getForgotPassEmail = createSelector(
  (state) => state.auth.form.forgotPass.email,
  (email) => {
    return email;
  }
);

export const getMessageErrorForgotPasword = createSelector(
  (state) => state.auth.form.forgotPass.errorMessage,
  (errorMessage) => {
    return errorMessage;
  }
);
export const getMessageAfterResetPass = createSelector(
  (state) => state.auth.__FORM._LOGIN.message,
  (message) => {
    return message;
  }
);
export const getMessageErrorSignUp = createSelector(
  (state) => state.auth.form.register.response.statusCode,
  (message) => {
    return message;
  }
);

// export const getUserId = createSelector((state) => state.auth.userId, (userId) => userId);
export const getUser = createSelector(
  (state) => state.auth.user,
  (user) => user
);
export const getAuth = createSelector(
  (state) => state.auth,
  (auth) => auth
);
export const getToken = createSelector(
  (state) => state.auth.token,
  (token) => token
);

export const getAvatar = createSelector(
  (state) => state.ui.app,
  (state) => state.auth,
  (state) => state.entities.user,
  (state) => state.entities.unit,
  (appUI, auth, users, units) => {
    if (appUI.roleType === 'Company') {
      return auth.company.avatar;
    }
    if (appUI.activeRole) {
      if (appUI.roleType === 'Person') {
        return users[appUI.activeRole] ? users[appUI.activeRole].avatar : null;
      }
      return units[appUI.activeRole] ? units[appUI.activeRole].avatar : null;
    }
    return auth.user.avatar;
  }
);
export const getFirstName = createSelector(
  (state) => state.ui.app,
  (state) => state.auth,
  (state) => state.entities.user,
  (state) => state.entities.unit,
  (appUI, auth, users, units) => {
    // if (appUI.roleType === 'Company') {
    //   return auth.company.avatar;
    // }
    if (appUI.activeRole) {
      if (appUI.roleType === 'Person') {
        return users[appUI.activeRole] ? users[appUI.activeRole].firstName : null;
      }
      return units[appUI.activeRole] ? units[appUI.activeRole].firstName : null;
    }
    return auth.user.firstName;
  }
);
export const getLastName = createSelector(
  (state) => state.ui.app,
  (state) => state.auth,
  (state) => state.entities.user,
  (state) => state.entities.unit,
  (appUI, auth, users, units) => {
    if (appUI.roleType === 'Company') {
      return auth.company.lastName;
    }
    if (appUI.activeRole) {
      if (appUI.roleType === 'Person') {
        return users[appUI.activeRole] ? users[appUI.activeRole].lastName : null;
      }
      return units[appUI.activeRole] ? units[appUI.activeRole].lastName : null;
    }
    return auth.user.lastName;
  }
);
export const getRulePackage = createSelector(
  (state) => state.ui.app.rulePackage,
  (rulePackage) => rulePackage
);
