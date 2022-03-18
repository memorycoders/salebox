//@flow
import { call, put, takeLatest } from 'redux-saga/effects';
import api from 'lib/apiClient';
import { tagList } from './tag.schema';
import TagActions from './tag.actions';

const taskEndPoints = 'task-v3.0';

let fetched = false;

function* fetchDropdown(): Generator<*, *, *> {
  try {
    if (!fetched) {
      const data = yield call(api.get, {
        resource: `${taskEndPoints}/listTag`,
        schema: tagList,
      });
      yield put({ type: TagActions.FETCH_DROPDOWN, ...data });
      fetched = true;
    } else {
      yield put({ type: TagActions.FETCH_DROPDOWN });
    }
    // }
  } catch (e) {
    yield put({ type: TagActions.FETCH_DROPDOWN_FAIL, message: e.message });
  }
}

export default function* saga(): Generator<*, *, *> {
  yield takeLatest(TagActions.FETCH_DROPDOWN_REQUEST, fetchDropdown);
}
