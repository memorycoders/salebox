//@flow
import { call, put, fork, take, cancel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import api from 'lib/apiClient';
import DropdownActionTypes, * as DropdownActions from 'components/Dropdown/dropdown.actions';
import { UIDefaults, Endpoints, ObjectTypes } from 'Constants';
import { productList } from './product.schema';

function* fetchDropdown(lineOfBusinessId): Generator<*, *, *> {
  yield delay(UIDefaults.DebounceTime);
  try {
    yield put(DropdownActions.startFetch(ObjectTypes.Product));
    const data = yield call(api.get, {
      resource: `${Endpoints.Administration}/product/listByLineOfBusiness/${lineOfBusinessId}`,
      schema: productList,
    });
    if (data.entities) {
      yield put(DropdownActions.succeedFetch(ObjectTypes.Product, data.entities));
    }
  } catch (e) {
    yield put(DropdownActions.failFetch(ObjectTypes.Product, e.message));
  }
}

function* queueDropdownFetch() {
  let task;
  while (true) {
    const { filter: lineOfBusinessId, objectType } = yield take(DropdownActionTypes.FETCH_REQUEST);
    if (objectType === ObjectTypes.Product) {
      // if (task) {
      //   yield cancel(task);
      // }
      task = yield fork(fetchDropdown, lineOfBusinessId);
    }
  }
}

export default function* saga(): Generator<*, *, *> {
  yield fork(queueDropdownFetch);
}
