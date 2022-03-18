// @flow
import uuid from 'uuid/v4';

const ActionTypes = {
  ADD: 'notification/add',
  REMOVE: 'notification/remove',
  REQUEST_REMOVE: 'notification/requestRemove',
  FETCH_REQUEST: 'notification/requestFetch',
  FETCH_START: 'notification/startFetch',
  FETCH_FAIL: 'notification/failFetch',
  FETCH_SUCCESS: 'notification/succeedFetch',
  MARK_READ: 'notification/markRead',
  MARK_UNREAD: 'notification/markUnRead',
  MARK_ALL_READ: 'notification/markAllRead'
};

type MessageTypeT = 'error' | 'info' | 'success';
type MessageT = {
  type: MessageTypeT,
  message: string,
  title: string,
  duration: number,
};

export const add = ({ type, message, title, duration, noTrans }: MessageT) => ({
  type: ActionTypes.ADD,
  notification: {
    id: uuid(),
    type,
    title,
    message,
    duration,
    noTrans
  },
});

export const remove = (id: string) => ({
  type: ActionTypes.REMOVE,
  id,
});

export const requestRemove = (id: string) => ({
  type: ActionTypes.REQUEST_REMOVE,
  id,
});

const makeNotification = (type: string) => {
  return (message: string, title?: string, duration?: number, noTrans?: boolean) => {
    return add({
      type,
      message,
      title,
      duration: duration,
      noTrans
    });
  };
};

export const requestFetch = () => ({
  type: ActionTypes.FETCH_REQUEST,
});

export const startFetch = () => ({
  type: ActionTypes.FETCH_START,
});

export const succeedFetch = (items: Array<string>) => ({
  type: ActionTypes.FETCH_SUCCESS,
  items,
});

export const failFetch = (error: string) => ({
  type: ActionTypes.FETCH_FAIL,
  error,
});

export const markRead = (id: string) => ({
  type: ActionTypes.MARK_READ,
  id,
});

export const markAllRead = () => ({
  type: ActionTypes.MARK_ALL_READ
});

export const markUnRead = (id: string) => ({
  type: ActionTypes.MARK_UNREAD,
  id,
});

export const info = makeNotification('info');
export const error = makeNotification('error');
export const success = makeNotification('success');

export default ActionTypes;
