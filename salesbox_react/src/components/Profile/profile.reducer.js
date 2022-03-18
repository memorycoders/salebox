// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import ProfileActions from './profile.actions';
import uuid from 'uuid/v4';

export const initialState = {};

const consumeEntities = createConsumeEntities('profile');

export default createReducer(initialState, {
  [ProfileActions.ADD_PHONE]: (draft, { profileId }) => {
    draft[profileId].additionalPhoneList.push({
      main: draft[profileId].additionalPhoneList.length === 0,
      value: '',
      uuid: uuid(),
      type: 'PHONE_MOBILE',
    });
  },
  [ProfileActions.REMOVE_PHONE]: (draft, { profileId, phoneId }) => {
    let wasMain;
    draft[profileId].additionalPhoneList = draft[profileId].additionalPhoneList.filter((phone) => {
      if (phone.main) wasMain = true;
      return phone.uuid !== phoneId;
    });
    if (wasMain && draft[profileId].additionalPhoneList[0]) {
      draft[profileId].additionalPhoneList[0].main = true;
    }
  },
  [ProfileActions.MAKE_PHONE_MAIN]: (draft, { profileId, phoneId }) => {
    draft[profileId].additionalPhoneList = draft[profileId].additionalPhoneList.map((phone) => {
      if (phone.uuid === phoneId) {
        return {
          ...phone,
          main: true,
        };
      } else if (phone.main) {
        return {
          ...phone,
          main: false,
        };
      }
      return phone;
    });
  },
  [ProfileActions.UPDATE_PHONE]: (draft, { profileId, phoneId, values }) => {
    draft[profileId].additionalPhoneList = draft[profileId].additionalPhoneList.map((phone) => {
      if (phone.uuid === phoneId) {
        return {
          ...phone,
          ...values,
        };
      }
      return phone;
    });
  },
  [ProfileActions.ADD_EMAIL]: (draft, { profileId }) => {
    draft[profileId].additionalEmailList.push({
      main: draft[profileId].additionalEmailList.length === 0,
      value: '',
      uuid: uuid(),
      type: 'EMAIL_HOME',
    });
  },
  [ProfileActions.REMOVE_EMAIL]: (draft, { profileId, emailId }) => {
    let wasMain;
    draft[profileId].additionalEmailList = draft[profileId].additionalEmailList.filter((email) => {
      if (email.main) wasMain = true;
      return email.uuid !== emailId;
    });
    if (wasMain && draft[profileId].additionalEmailList[0]) {
      draft[profileId].additionalEmailList[0].main = true;
    }
  },
  [ProfileActions.MAKE_EMAIL_MAIN]: (draft, { profileId, emailId }) => {
    draft[profileId].additionalEmailList = draft[profileId].additionalEmailList.map((email) => {
      if (email.uuid === emailId) {
        return {
          ...email,
          main: true,
        };
      } else if (email.main) {
        return {
          ...email,
          main: false,
        };
      }
      return email;
    });
  },
  [ProfileActions.UPDATE_EMAIL]: (draft, { profileId, emailId, values }) => {
    draft[profileId].additionalEmailList = draft[profileId].additionalEmailList.map((email) => {
      if (email.uuid === emailId) {
        return {
          ...email,
          ...values,
        };
      }
      return email;
    });
  },
  default: consumeEntities,
});
