//@flow
import { call, put, fork, take, cancel, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import api from 'lib/apiClient';
import { prospectList } from './prospect.schema';
import DropdownActionTypes, * as DropdownActions from 'components/Dropdown/dropdown.actions';
import { UIDefaults, Endpoints, ObjectTypes } from 'Constants';
import { ActionTypes } from './prospect.action';

function* fetchDropdown(contactId, name): Generator<*, *, *> {
  yield delay(UIDefaults.DebounceTime);
  try {
    yield put(DropdownActions.startFetch(ObjectTypes.Prospect, name));
    const data = yield call(api.post, {
      resource: `${Endpoints.Prospect}/listByContacts`,
      query: {
        pageSize: 1000,
        pageIndex: 0,
      },
      data: Array.isArray(contactId) ? contactId : [contactId],
      schema: prospectList,
    });
    if (data.entities) {
      if (data.entities.prospect) {
        Object.keys(data.entities.prospect).forEach((prospectId) => {
          data.entities.prospect[prospectId].contacts = contactId;
        });
      }
      yield put(DropdownActions.succeedFetch(ObjectTypes.Prospect, data.entities));
    }
  } catch (e) {
    yield put(DropdownActions.failFetch(ObjectTypes.Prospect, e.message));
  }
}

function* queueDropdownFetch() {
  let task;
  while (true) {
    const { searchTerm, filter: contactId, objectType } = yield take(DropdownActionTypes.FETCH_REQUEST);
    if (objectType === ObjectTypes.Prospect) {
      if (task) {
        yield cancel(task);
      }
      task = yield fork(fetchDropdown, contactId, searchTerm);
    }
  }
}
function* fetchByContacts({contactId, prospectType}): Generator<*, *, *> {
  try {
    const data = yield call(api.post, {
      resource: `${Endpoints.Prospect}/listByContacts`,
      query: {
        pageSize: 1000,
        pageIndex: 0,
      },
      data: Array.isArray(contactId) ? contactId : [contactId],
      schema: prospectList,
    });

    if (data.entities) {
      if (data.entities.prospect) {
        Object.keys(data.entities.prospect).forEach((prospectId) => {
          data.entities.prospect[prospectId].contacts = contactId;
        });
      }
      yield put({type: ActionTypes.LIST_BY_CONTACTS_DATA, prospects: data.entities});
    }
  } catch (e) {
    console.log(e);
    // yield put(DropdownActions.failFetch(ObjectTypes.Prospect, e.message));
  }
}

export default function* saga(): Generator<*, *, *> {
  yield fork(queueDropdownFetch);

  yield takeLatest(ActionTypes.LIST_BY_CONTACTS, fetchByContacts);

}
