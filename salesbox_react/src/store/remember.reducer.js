// @flow
import createReducer from 'store/createReducer';
const RememberActions = {
  SAVE_REMEMBER: 'SAVE_REMEMBER',
  // clear remember when user logout
  CLEAR_REMEMBER: 'CLEAR_REMEMBER',
  REMEMBER_UPDATE_DATA: 'REMEMBER_UPDATE_DATA',
};

const initialState = {};

export default createReducer(initialState, {
  // Feature: Others
  [RememberActions.SAVE_REMEMBER]: (draft, action) => {
    draft.remember = action.remember;
  },
  [RememberActions.CLEAR_REMEMBER]: (draft, action) => {
    draft.remember = null;
  },
  [RememberActions.REMEMBER_UPDATE_DATA]: (draft, action) => {
    let uuid = draft.remember.result;
    if (uuid) {
      Object.keys(action.action).map((key) => {
        if (key == 'languageCode') {
          console.log('==========3123123', key, action.action[key].value);
          draft.remember.entities.auth[uuid][key] = action.action[key].value;
        } else {
          draft.remember.entities.user[uuid][key] = action.action[key];
        }
      });
    }
  },
});
