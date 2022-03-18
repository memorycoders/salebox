//@flow
import { take, call, put, takeLatest, select, cancel, fork } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import api from 'lib/apiClient';
import { Endpoints } from 'Constants';
import DashboardActionTypes, * as DashboardActions from './dashboard.actions';

let timer;

const repeat = (secs) =>
  eventChannel((emitter) => {
    const iv = setInterval(() => {
      secs += 1;
      if (secs > 0) {
        emitter(secs);
      } else {
        // this causes the channel to close
        emitter(END);
      }
    }, 1000);
    // The subscriber must return an unsubscribe function
    return () => {
      clearInterval(iv);
    };
  });

// TODO: Fix Hard Code Request for Register.
function* fetchDashboardData(): Generator<*, *, *> {
  try {
    const state = yield select();
    const { roleType } = state.ui.app;
    let ownerId = state.ui.app.activeRole;
    if (roleType === 'Person' && !ownerId) {
      ownerId = state.auth.userId;
    } else if (roleType === 'Company') {
      ownerId = undefined;
    }
    const timezone = new Date().getTimezoneOffset() / -60;
    yield put(DashboardActions.startFetchData());
    const data = yield call(api.get, {
      query: {
        ownerId: state.auth.userId,
        timezone,
      },
      resource: `${Endpoints.AdvancedSearch}/customDashBoard/listByFilterES`,
    });
    yield put(DashboardActions.succeedFetchData(data.customDashBoardDTOList));
  } catch (e) {
    yield put(DashboardActions.failFetchData(e.message));
  }
}

function* updateDashBoardIndex({data}) {
    try {
    const rs = yield call(api.post, {
      data: {uuidList: data },
      resource: `${Endpoints.AdvancedSearch}/customDashBoard/updateIndex`,
    });
  }catch(ex){}
}

function* fetchDashboard() {
  yield call(fetchDashboardData);
}

function* startTimer(): Generator<*, *, *> {
  const chan = yield call(repeat, 1);
  try {
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      const seconds = yield take(chan);
      if (seconds % 5 === 0) {
        yield put(DashboardActions.nextItem());
      }
    }
  } finally {
    console.log('countdown terminated');
  }
}

function* stopTimer(): Generator<*, *, *> {
  yield cancel(timer);
}

function* handleTimer(): Generator<*, *, *> {
  while (true) {
    yield take(DashboardActionTypes.ENABLE_FULLSCREEN);
    if (timer) {
      yield cancel(timer);
    }
    timer = yield fork(startTimer);
  }
}

export default function* saga(): Generator<*, *, *> {
  yield takeLatest(DashboardActionTypes.FETCH_DASHBOARD_REQUEST, fetchDashboard);
  yield fork(handleTimer);
  yield takeLatest(DashboardActionTypes.DISABLE_FULLSCREEN, stopTimer);
  yield takeLatest(DashboardActionTypes.UPDATE_INDEX, updateDashBoardIndex)
}
