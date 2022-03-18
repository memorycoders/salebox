//@flow
import { call, put, select, takeLatest } from 'redux-saga/effects';
import api from 'lib/apiClient';
import { unitList } from './unit.schema';
import UnitActionTypes, * as UnitActions from './unit.actions';
const enterpriseEndpoints = 'enterprise-v3.0';

function* fetch(): Generator<*, *, *> {
  const state = yield select();
  try {
    const lastFetch = state.ui.unit.lastFetch.dropdown || 0;
    if (lastFetch < Date.now() - 10 * 60 * 60 * 1000) {
      const data = yield call(api.get, {
        resource: `${enterpriseEndpoints}/unit/listWithPartner`,
        schema: unitList,
      });
      yield put(UnitActions.fetch(data));
    } else {
      yield put(UnitActions.fetchYieldCache());
    }
  } catch (e) {
    yield put(UnitActions.fetchFail(e.message));
  }
}

export default function* saga(): Generator<*, *, *> {
  yield takeLatest(UnitActionTypes.FETCH_REQUEST, fetch);
}
