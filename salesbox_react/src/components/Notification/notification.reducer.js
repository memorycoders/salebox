// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import NotificationActions from './notification.actions';
import AuthActionTypes from 'components/Auth/auth.actions';

export const initialState = {};

const consumeEntities = createConsumeEntities('notification');

export default createReducer(initialState, {
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },
  [NotificationActions.ADD]: (draft, { notification }) => {
    draft[notification.id] = {
      ...notification,
      active: true,
    };
  },
  [NotificationActions.REMOVE]: (draft, { id }) => {
    delete draft[id];
  },
  [NotificationActions.REQUEST_REMOVE]: (draft, { id }) => {
    if (draft[id]) {
      draft[id].active = false;
    }
  },
  [NotificationActions.MARK_READ]: (draft, { id }) => {
    draft[id].read = true;
  },

  [NotificationActions.MARK_ALL_READ]: (draft) => {
    const keys = Object.keys(draft);
    keys.forEach(key => {
      draft[key].read = true;
    })
  },
  [NotificationActions.MARK_UNREAD]: (draft, { id }) => {
    draft[id].read = false;
  },
  default: consumeEntities,
});
