//@flow
import { call, put, takeLatest, select } from 'redux-saga/effects';
import api from 'lib/apiClient';
import { focusList, focusActivityList } from './focus.schema';
import FocusActionTypes from './focus.actions';
import OverviewActions from './../Overview/overview.actions';
import * as NotificationActions from './../Notification/notification.actions';
const taskEndpoints = 'task-v3.0';
const categoryEndPoints = 'administration-v3.0';
import _l from 'lib/i18n';
import { getCreateTask, getUpdateTask } from 'components/Task/task.selector';
import * as TaskActions from 'components/Task/task.actions';

addTranslations({
  'en-US': {
    Added: 'Added',
    'Focus already exist': 'Focus already exist',
  },
});
function* fetchDropdown({ taskId, focusType }): Generator<*, *, *> {
  try {
    const query = focusType
      ? {
          pageIndex: 0,
          pageSize: 10000,
          type: focusType,
        }
      : {
          getDefault: true,
        };
    const data = yield call(api.get, {
      query,
      resource: `${taskEndpoints}/list/focus/${taskId ? taskId : 'NULL'}`,
      schema: focusList,
    });
    yield put({ type: FocusActionTypes.FETCH_DROPDOWN, ...data });
  } catch (e) {
    yield put({ type: FocusActionTypes.FETCH_DROPDOWN_FAIL, message: e.message });
  }
}

function* fetchActivityDropdown(): Generator<*, *, *> {
  const state = yield select();
  try {
    if (Object.keys(state.entities.focusActivity).length < 1) {
      const data = yield call(api.get, {
        resource: `${taskEndpoints}/list/focusActivity`,
        schema: focusActivityList,
      });
      yield put({ type: FocusActionTypes.FETCH_ACTIVITY_DROPDOWN, ...data });
    } else {
      yield put({ type: FocusActionTypes.FETCH_ACTIVITY_DROPDOWN_YIELD_CACHE });
    }
  } catch (e) {
    yield put({ type: FocusActionTypes.FETCH_ACTIVITY_DROPDOWN_FAIL, message: e.message });
  }
}

function* saveFocus({ name, discProfile, description }): Generator<*, *, *> {
  try {
    const data = yield call(api.post, {
      resource: `${categoryEndPoints}/workData/activity/add`,
      data: {
        description: description,
        discProfile: discProfile,
        name: name,
        type: 'FOCUS',
      },
    });
    if (data) {
      yield put({ type: OverviewActions.CLEAR_HIGHLIGHT_ACTION });
      yield put(NotificationActions.success(_l`Added`, '', 2000));
    }
    yield put({ type: FocusActionTypes.FETCH_DROPDOWN_REQUEST });
    yield fillValueDefaul(data.uuid);
  } catch (e) {
    if (e.message === 'WORK_DATA_ACTIVITY_NAME_UNIQUE') {
      yield put(NotificationActions.error(_l`Focus already exist`, 'Error'));
    }
  }
}

function* fillValueDefaul(value) {
  let dataFocus={ focusWorkData: {uuid: value}};
  yield put(TaskActions.createEntity('__CREATE', dataCategory));
  yield put(TaskActions.createEntity('__EDIT', dataCategory));
  const state = yield select();

  const _CREATE = getCreateTask(state);

  if (_CREATE != null) {
    const newTask = { ..._CREATE, focusWorkData: { uuid: value } };
    yield put(TaskActions.createEntity('__CREATE', newTask));
  }
  const __EDIT = getUpdateTask(state);

  if (__EDIT != null) {
    const newTask = { ...__EDIT, focusWorkData: { uuid: value } };
    yield put(TaskActions.createEntity('__EDIT', newTask));
  }
}
export default function* saga(): Generator<*, *, *> {
  yield takeLatest(FocusActionTypes.FETCH_DROPDOWN_REQUEST, fetchDropdown);
  yield takeLatest(FocusActionTypes.FETCH_ACTIVITY_DROPDOWN_REQUEST, fetchActivityDropdown);
  yield takeLatest(FocusActionTypes.SAVE_FOCUS, saveFocus);
}
