//@flow
import { call, put, fork, take, cancel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import api from 'lib/apiClient';
import DropdownActionTypes, * as DropdownActions from 'components/Dropdown/dropdown.actions';
import { UIDefaults, Endpoints, ObjectTypes } from 'Constants';
import { measurementTypeList } from './measurement-type.schema';

function* fetchDropdown(): Generator<*, *, *> {
  yield delay(UIDefaults.DebounceTime);
  try {
    yield put(DropdownActions.startFetch(ObjectTypes.MeasurementType));
    const data = yield call(api.get, {
      resource: `${Endpoints.Administration}/measurement/list`,
      schema: measurementTypeList,
    });
    if (data.entities) {
      yield put(DropdownActions.succeedFetch(ObjectTypes.MeasurementType, data.entities));
    }
  } catch (e) {
    yield put(DropdownActions.failFetch(ObjectTypes.MeasurementType, e.message));
  }
}

function* queueDropdownFetch() {
  let task;
  while (true) {
    const { searchTerm, filter: contactId, objectType } = yield take(DropdownActionTypes.FETCH_REQUEST);
    if (objectType === ObjectTypes.MeasurementType) {
      if (task) {
        yield cancel(task);
      }
      task = yield fork(fetchDropdown, contactId, searchTerm);
    }
  }
}

export default function* saga(): Generator<*, *, *> {
  yield fork(queueDropdownFetch);
}
