//@flow
import { call, put, takeLatest, select } from 'redux-saga/effects';
import api from 'lib/apiClient';
import { userList } from './user.schema';
import UserActions from './user.actions';

const enterpriseEndPoints = 'enterprise-v3.0';

function* fetchUsers(): Generator<*, *, *> {
  const state = yield select();
  try {
    const lastFetch = state.ui.user.lastFetch.list || 0;
    if (lastFetch < Date.now() - 2000) {
      const data = yield call(api.get, {
        resource: `${enterpriseEndPoints}/user/listUserLite`,
        schema: userList,
      });
      yield put({ type: UserActions.FETCH_LIST, ...data });
    }
  } catch (e) {
    yield put({ type: UserActions.FETCH_LIST_FAIL, message: e.message });
  }
}

function* fetchDeactivatedUsers(): Generator<*, *, *> {
  try {
    const data = yield call(api.get, {
      resource: `${enterpriseEndPoints}/user/listDeactivatedUserLite`,
      schema: userList,
    });
    yield put({ type: UserActions.FETCH_LIST, ...data });
  } catch (e) {
    yield put({ type: UserActions.FETCH_LIST_FAIL, message: e.message });
  }
}

export default function* saga(): Generator<*, *, *> {
  yield takeLatest(UserActions.FETCH_LIST_REQUEST, fetchUsers);
  yield takeLatest(UserActions.FETCH_LIST_REQUEST_ACTIVE, fetchDeactivatedUsers);
}
