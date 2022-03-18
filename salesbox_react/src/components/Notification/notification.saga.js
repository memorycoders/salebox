//@flow
import { call, takeEvery, takeLatest, select, put } from 'redux-saga/effects';
import api from 'lib/apiClient';
import { delay } from 'redux-saga';
import { makeGetNotification } from './notification.selector';
import NotificationActionTypes, * as NotificationActions from './notification.actions';
import * as OverviewActions from 'components/Overview/overview.actions';
import { notificationList } from './notification.schema';
import { getUser } from 'components/Auth/auth.selector';

const notificationEndPoints = 'enterprise-v3.0/notification';

const getNotification = makeGetNotification();

function* fetchNotifications(): Generator<*, *, *> {
  // return;
  const notifiationUI = yield select((state) => state.ui.notification);
  const user = yield select(getUser);
  try {
    if (notifiationUI.lastFetch < Date.now() - 100) {
      yield put(NotificationActions.startFetch());
      const data = yield call(api.get, {
        resource: `${notificationEndPoints}/listByUser/${user.uuid}`,
        query: {
          pageIndex: 0,
          pageSize: 300,
        },
        schema: notificationList,
      });
      if (data.entities && data.entities.notification) {
        yield put(NotificationActions.succeedFetch(data.entities.notification));
        yield put(OverviewActions.feedEntities(data.entities));
      }
    }
  } catch (e) {
    yield put(NotificationActions.failFetch(e.message));
  }
}

function* markRead({ id }: { id: string }): Generator<*, *, *> {
  try {
    yield call(api.get, {
      resource: `${notificationEndPoints}/updateRead/${id}`,
      query: {
        status: true,
      },
    });
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if( e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

function* markUnRead({ id }: { id: string }): Generator<*, *, *> {
  try {
    yield call(api.get, {
      resource: `${notificationEndPoints}/updateRead/${id}`,
      query: {
        status: false,
      },
    });
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if( e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}


function* markAllRead(): Generator<*, *, *> {
  try {
    yield call(api.get, {
      resource: `${notificationEndPoints}/updateAllRead`,
      query: {
        status: false,
      },
    });
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if( e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

function* requestRemove({ notification: { id } }): Generator<*, *, *> {
  let notification;
  notification = yield select(getNotification, id);
  if (notification.duration){
    yield delay(notification.duration);
    notification = yield select(getNotification, id);
    if (notification.active) {
      yield put(NotificationActions.requestRemove(notification.id));
    }
  }

}

function* remove({ id }): Generator<*, *, *> {
  yield delay(500);
  const notification = yield select(getNotification, id);
  if (!notification.active) {
    yield put(NotificationActions.remove(notification.id));
  }
}

export default function* saga(): Generator<*, *, *> {
  yield takeLatest(NotificationActionTypes.FETCH_REQUEST, fetchNotifications);
  yield takeLatest(NotificationActionTypes.MARK_READ, markRead);
  yield takeEvery(NotificationActionTypes.MARK_ALL_READ, markAllRead);
  yield takeLatest(NotificationActionTypes.MARK_UNREAD, markUnRead);
  yield takeEvery(NotificationActionTypes.ADD, requestRemove);
  yield takeEvery(NotificationActionTypes.REQUEST_REMOVE, remove);
}

//https://production-qa.salesbox.com/enterprise-v3.0/notification/listByUser/627a500e-c0e3-4779-a1cb-1ecf40c0cb8c?enterpriseID=ed00b3e4-ecbe-4f01-9585-3ccc2dc693b7&token=01a90e0a-249b-4d8f-8e19-840908a4182d
