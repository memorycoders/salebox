//@flow
import { call, put, select, takeLatest } from 'redux-saga/effects';
import api from 'lib/apiClient';
import { multiRelationList } from './multi-relation.schema';
import MultiRelationActionTypes, * as MultiRelationActions from './multi-relation.actions';
import { getLastFetch } from './multi-relation.selectors';
const administrationEndpoints = 'administration-v3.0';

function* fetch({ objectType, objectId }): Generator<*, *, *> {
  const state = yield select();
  try {
    if(objectType && objectId) {
      const lastFetch = getLastFetch(state, objectType, objectId);
      if (lastFetch < Date.now() - 3000) {
        yield put(MultiRelationActions.startFetch(objectType, objectId));
        const data = yield call(api.get, {
          resource: `${administrationEndpoints}/multiRelationDetail/listByObject`,
          schema: multiRelationList,
          query: { objectType, objectId },
        });
        yield put(MultiRelationActions.succeedFetch(objectType, objectId, data));
        yield put(MultiRelationActions.feedEntities(objectType, objectId, data));
      }
    }

  } catch (e) {
    yield put(MultiRelationActions.failFetch(objectType, objectId, e.message));
  }
}

function* deleteRelation({ objectType, objectId, uuid }): Generator<*, *, *> {
  const state = yield select();
  try {

    if(uuid) {
      const data = yield call(api.get, {
        resource: `${administrationEndpoints}/multiRelationDetail/delete`,
        query: { uuid },
      });
      yield put(MultiRelationActions.deleteRelationSuccess(uuid));
    }

  } catch (e) {

  }
}

function* fetchRelationtype({ objectType }): Generator<*, *, *> {

  try {

    if(objectType) {
      const data = yield call(api.get, {
        resource: `${administrationEndpoints}/multiRelation/listByObjectType`,
        query: { objectType },
      });
      const { multiRelationDTOList } = data;
      yield put(MultiRelationActions.fetchRelationTypeSuccess(objectType, multiRelationDTOList));
    }

  } catch (e) {

  }
}

export default function* saga(): Generator<*, *, *> {
  yield takeLatest(MultiRelationActionTypes.FETCH_REQUEST, fetch);

  yield takeLatest(MultiRelationActionTypes.DELETE_RELATION, deleteRelation);

  //FETCH_RELATION_TYPE
  yield takeLatest(MultiRelationActionTypes.FETCH_RELATION_TYPE, fetchRelationtype);
}
