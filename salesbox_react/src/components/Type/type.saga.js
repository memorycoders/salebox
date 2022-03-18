//@flow
import { call, put, takeLatest } from 'redux-saga/effects';
import api from 'lib/apiClient';
import { typeList } from './type.schema';
import TypeActionTypes from './type.actions';
import { Endpoints } from 'Constants';

let fetched = false;

function* fetchDropdown(): Generator<*, *, *> {
  try {
    // const state = yield select();
    // if (!fetched) {
      // const data = yield call(api.get, {
      //   resource: `${Endpoints.Administration}/workData/organisations`,
      //   schema: typeList,
      // });
      // yield put({ type: TypeActionTypes.FETCH_DROPDOWN, ...data });

    //   fetched = true;
    // } else {
    //   yield put({ type: TypeActionTypes.FETCH_DROPDOWN_YIELD_CACHE });
    // }
    const data = yield call(api.get, {
      resource: `${Endpoints.Administration}/workData/organisations`,
      schema: typeList,
    });
    yield put({ type: TypeActionTypes.FETCH_DROPDOWN, ...data });
  } catch (e) {
    yield put({ type: TypeActionTypes.FETCH_DROPDOWN_FAIL, message: e.message });
  }
}

export default function* saga(): Generator<*, *, *> {
  yield takeLatest(TypeActionTypes.FETCH_DROPDOWN_REQUEST, fetchDropdown);
}
