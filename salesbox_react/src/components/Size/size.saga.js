//@flow
import { call, put, takeLatest, select } from 'redux-saga/effects';
import api from 'lib/apiClient';
import { sizeList } from './size.schema';
import TypeActionTypes from './size.actions';
const administrationEndPoints = 'administration-v3.0';

function* fetchDropdown(): Generator<*, *, *> {
  try {
    const state = yield select();
    if (Object.keys(state.entities.size).length < 5) {
      const data = yield call(api.get, {
        resource: `${administrationEndPoints}/workData/workData/getSizeTypes`,
        schema: sizeList,
      });
      yield put({ type: TypeActionTypes.FETCH_DROPDOWN, ...data });
    } else {
      yield put({ type: TypeActionTypes.FETCH_DROPDOWN_YIELD_CACHE });
    }
  } catch (e) {
    yield put({ type: TypeActionTypes.FETCH_DROPDOWN_FAIL, message: e.message });
  }
}

export default function* saga(): Generator<*, *, *> {
  yield takeLatest(TypeActionTypes.FETCH_DROPDOWN_REQUEST, fetchDropdown);
}
