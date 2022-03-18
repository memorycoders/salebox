// @flow
/* eslint-disable no-param-reassign */
import createReducer from 'store/createReducer';
import NotificationActions from 'components/Notification/notification.actions';

export const initialState = {
  isFetching: false,
  lastFetch: 0,
  items: [],
};

export default createReducer(initialState, {
  [NotificationActions.FETCH_START]: (draft) => {
    draft.isFetching = true;
  },
  [NotificationActions.FETCH_SUCCESS]: (draft, { items }) => {
    draft.isFetching = false;
    draft.items = Object.keys(items);
  },
  [NotificationActions.FETCH_FAIL]: (draft) => {
    draft.isFetching = false;
  },
});
