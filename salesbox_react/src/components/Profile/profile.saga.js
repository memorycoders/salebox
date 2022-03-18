//@flow
import { call, put, takeLatest, select } from 'redux-saga/effects';
import api from 'lib/apiClient';
import { getUser } from 'components/Auth/auth.selector';
import { getUserProfile } from 'components/Profile/profile.selector';
import { profileSchema } from './profile.schema';
import ProfileActions from './profile.actions';
const enterpriseEndpoints = 'enterprise-v3.0';

function* fetch(): Generator<*, *, *> {
  try {
    const profile = yield select(getUserProfile);
    const user = yield select(getUser);
    // if (!profile.uuid) {
      const data = yield call(api.get, {
        resource: `${enterpriseEndpoints}/user/${user.uuid}`,
        schema: profileSchema,
      });
      yield put({ type: ProfileActions.FETCH, ...data }); 
    // }
  } catch (e) {
    yield put({ type: ProfileActions.FETCH_FAIL, message: e.message });
  }
}

export default function* saga(): Generator<*, *, *> {
  yield takeLatest(ProfileActions.FETCH_REQUEST, fetch);
}
