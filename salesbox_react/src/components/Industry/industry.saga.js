//@flow
import { call, put, takeLatest, select } from 'redux-saga/effects';
import api from 'lib/apiClient';
import { industryList } from './industry.schema';
import IndustryActions from './industry.actions';
const administrationEndpoints = 'administration-v3.0';

function* fetchDropdown(): Generator<*, *, *> {
  const state = yield select();
  try {
    // if (Object.keys(state.entities.industry).length < 1) {
      const data = yield call(api.get, {
        resource: `${administrationEndpoints}/workData/workData/industries`,
        schema: industryList,
      });
      yield put({ type: IndustryActions.FETCH_DROPDOWN, ...data });
    // } else {
    //   yield put({ type: IndustryActions.FETCH_DROPDOWN_YIELD_CACHE });
    // }
  } catch (e) {
    yield put({ type: IndustryActions.FETCH_DROPDOWN_FAIL, message: e.message });
  }
}

export default function* saga(): Generator<*, *, *> {
  yield takeLatest(IndustryActions.FETCH_DROPDOWN_REQUEST, fetchDropdown);
}
