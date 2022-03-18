//@flow
import { call, put, fork, take, cancel, select, all } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import api from 'lib/apiClient';
import DropdownActionTypes, * as DropdownActions from 'components/Dropdown/dropdown.actions';
import { UIDefaults, Endpoints, ObjectTypes } from 'Constants';
import { getDropdown } from 'components/Dropdown/dropdown.selector';
import { lineOfBusinessList } from './line-of-business.schema';
import { OverviewTypes } from '../../Constants';
import { setCurrentResourceId } from '../Common/common.actions';
// import * as OrderRowActions from './order-row.actions';

function* fetchDropdown(): Generator<*, *, *> {
  const state = yield select();
  const dropdown = getDropdown(state, ObjectTypes.LineOfBusiness);
  if (dropdown.lastFetch < Date.now() - 10000) {
    yield delay(UIDefaults.DebounceTime);
    try {
      let resourceId;
      switch(state.common.currentOverviewType) {
        case OverviewTypes.Resource:
          resourceId = state.router?.location?.pathname?.substring('/resources/'.length, state.router.location?.pathname?.length) || state.entities?.resources?.resourceAddDealInList?.uuid;
          break;
        case OverviewTypes.Insight:
          resourceId = state.entities?.resources?.resourceReportId;
          break;
      }

      yield put(DropdownActions.startFetch(ObjectTypes.LineOfBusiness));
      // const data = yield
      const listApi = [
        call(api.get, {
          resource: `${Endpoints.Administration}/lineOfBusiness/list`,
          schema: lineOfBusinessList,
        })
      ]
      if(resourceId) {
        listApi.push(
          call(api.get, {
            resource: `${Endpoints.Administration}/lineOfBusiness/findByResource`,
            query: {
              resourceId: resourceId,
            }
          })
        )
      }
      const data = yield all(listApi);
      if (data[0].entities) {
        yield put(DropdownActions.succeedFetch(ObjectTypes.LineOfBusiness, data[0].entities));
      }
      if(data[1] && data[1].uuid) {
        yield put(setCurrentResourceId(data[1].uuid))
      }
    } catch (e) {
      yield put(DropdownActions.failFetch(ObjectTypes.LineOfBusiness, e.message));
    }
  }
}

function* queueDropdownFetch() {
  let task;
  while (true) {
    const { searchTerm, filter: contactId, objectType } = yield take(DropdownActionTypes.FETCH_REQUEST);
    if (objectType === ObjectTypes.LineOfBusiness) {
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
