//@flow
import { call, put, fork, take, cancel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import api from 'lib/apiClient';
import DropdownActionTypes, * as DropdownActions from '../Dropdown/dropdown.actions';
import { UIDefaults, Endpoints, ObjectTypes } from 'Constants';
import { productGroupList } from './productGroup.schema';

function* fetchDropdown(): Generator<*, *, *> {
  yield delay(UIDefaults.DebounceTime);
  try {
    yield put(DropdownActions.startFetch(ObjectTypes.Product));
    const data = yield call(api.get, {
      resource: `${Endpoints.Administration}/lineOfBusiness/list`,
      schema: productGroupList,
    });
    if (data.entities) {
      yield put(DropdownActions.succeedFetch(ObjectTypes.ProductGroup, data.entities));
    }
  } catch (e) {
    yield put(DropdownActions.failFetch(ObjectTypes.ProductGroup, e.message));
  }
}

function* queueDropdownFetch() {
  let task;
  while (true) {
    const { objectType } = yield take(DropdownActionTypes.FETCH_REQUEST);
    if (objectType === ObjectTypes.ProductGroup) {
      if (task) {
        yield cancel(task);
      }
      task = yield fork(fetchDropdown);
    }
  }
}

export default function* saga(): Generator<*, *, *> {
  yield fork(queueDropdownFetch);
}
