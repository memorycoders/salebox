// @flow
import createReducer from 'store/createReducer';
import uuid from 'uuid/v4';
import _ from 'lodash';
import ActionTypes from './flashMessage.action';

const initialState = {
  messages: [],
};

export default createReducer(initialState, {
  // Feature: Others
  [ActionTypes.ADD_FLASH_MESSAGE]: (draft, action) => {
    draft.messages = [
      ...draft.messages,
      {
        id: uuid(),
        type: action.noti_type,
        messages: action.messages,
      },
    ];
  },
  [ActionTypes.REMOVE_FLASH_MESSAGE]: (draft, action) => {
    const index = _.findIndex(draft.messages, { id: action.id });
    if (index >= 0) {
      draft.messages = [...draft.messages.slice(0, index), ...draft.messages.slice(index + 1)];
    }
  },
  [ActionTypes.REMOVE_ALL_FLASH_MESSAGES]: (draft) => {
    draft.messages = [];
  },
});
