// @flow

const ActionTypes = {
  FETCH_REQUEST: 'profile/fetch/request',
  FETCH_FAIL: 'profile/fetch/fail',
  FETCH: 'profile/fetch',
  ADD_PHONE: 'profile/addPhone',
  REMOVE_PHONE: 'profile/removePhone',
  UPDATE_PHONE: 'profile/updatePhone',
  MAKE_PHONE_MAIN: 'profile/makePhoneMain',
  ADD_EMAIL: 'profile/addEmail',
  REMOVE_EMAIL: 'profile/removeEmail',
  UPDATE_EMAIL: 'profile/updateEmail',
  MAKE_EMAIL_MAIN: 'profile/makeEmailMain',
};

export const requestFetch = () => ({
  type: ActionTypes.FETCH_REQUEST,
});

export const addPhone = (profileId) => ({
  type: ActionTypes.ADD_PHONE,
  profileId,
});

export const removePhone = (profileId, phoneId) => ({
  type: ActionTypes.REMOVE_PHONE,
  profileId,
  phoneId,
});

export const makePhoneMain = (profileId, phoneId) => ({
  type: ActionTypes.MAKE_PHONE_MAIN,
  profileId,
  phoneId,
});

export const updatePhone = (profileId, phoneId, values) => ({
  type: ActionTypes.UPDATE_PHONE,
  profileId,
  phoneId,
  values,
});

export const addEmail = (profileId) => ({
  type: ActionTypes.ADD_EMAIL,
  profileId,
});

export const removeEmail = (profileId, emailId) => ({
  type: ActionTypes.REMOVE_EMAIL,
  profileId,
  emailId,
});

export const makeEmailMain = (profileId, emailId) => ({
  type: ActionTypes.MAKE_EMAIL_MAIN,
  profileId,
  emailId,
});

export const updateEmail = (profileId, emailId, values) => ({
  type: ActionTypes.UPDATE_EMAIL,
  profileId,
  emailId,
  values,
});
export default ActionTypes;
