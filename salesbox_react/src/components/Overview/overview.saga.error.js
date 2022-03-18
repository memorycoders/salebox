//@flow
import { all, fork, call, put, takeLatest, select, take, takeEvery, cancel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import api from 'lib/apiClient';
import uuid from 'uuid/v4';
import PeriodSelectorActions from 'components/PeriodSelector/period-selector.actions';
import { getSearch, getSearchForSave } from 'components/AdvancedSearch/advanced-search.selectors';
import { getPeriod } from 'components/PeriodSelector/period-selector.selectors';
import AdvancedSearchActionTypes from 'components/AdvancedSearch/advanced-search.actions';
import OverviewActionTypes, * as OverviewActions from 'components/Overview/overview.actions';
import { getOverview } from 'components/Overview/overview.selectors';
import { OverviewTypes } from '../../Constants';

const getRequestDataDefault = (requestData) => requestData;

type EndpointType = {
  list: string,
  count: string,
};

const createFetchListSaga = (
  endPoint: EndpointType,
  overviewType: string,
  objectType: string,
  entityType: string,
  schema: {},
  mapRequestData: ({}) => {} = getRequestDataDefault,
  mapQuery: ({}) => {} = getRequestDataDefault
) => {
  const currentSession = {
    pageIndex: -1,
    pageSize: 45,
    sessionKey: uuid(),
  };

  return function* fetchList(clear: boolean): Generator<*, *, *> {
    const state = yield select();
    try {
      const overview = getOverview(state, overviewType);
      // if (overview.lastFetch < Date.now() - 1) {
      const { roleType } = state.ui.app;
      let roleValue = state.ui.app.activeRole;
      if (roleType === 'Person' && !roleValue) {
        roleValue = state.auth.userId;
      } else if (roleType === 'Company') {
        roleValue = undefined;
      }
      yield put(OverviewActions.startFetch(overviewType));
      if (clear) {
        currentSession.pageIndex = 0;
        currentSession.sessionKey = uuid();
      } else {
        currentSession.pageIndex++;
      }
      const search = getSearch(state, objectType);
      const period = getPeriod(state, objectType);
      const { searchFieldDTOList } = getSearchForSave(state, objectType);
      const isFilterAll = period.period === 'all';
      const requestData = mapRequestData(
        {
          startDate: isFilterAll ? null : new Date(period.startDate).getTime(),
          endDate: isFilterAll ? null : new Date(period.endDate).getTime(),
          isFilterAll,
          roleFilterType: roleType,
          roleFilterValue: roleValue,
          customFilter: search.filter ? search.filter : 'active',
          orderBy: 'dateAndTime',
          isRequiredOwner: false,
          ftsTerms: search.term,
          searchFieldDTOList: search.shown ? searchFieldDTOList : [],
          selectedMark: search.tag,
        },
        search
      );

      const getData = call(api.post, {
        data: requestData,
        query: mapQuery(currentSession, search),
        resource: endPoint.list,
        schema,
      });

      // if (overviewType == OverviewTypes.CallList.Contact
      //   || overviewType == OverviewTypes.CallList.Account) {

        // FIXME: Please implement logic of Call List
        // if (currentSession.pageIndex === 0) {
        //   const [countData, data] = yield all([
        //     call(api.post, {
        //       data: requestData,
        //       query: mapQuery(
        //         {
        //           sessionKey: currentSession.sessionKey,
        //         },
        //         search
        //       ),
        //       resource: endPoint.count,
        //     }),
        //     getData,
        //   ]);
        //   // const count = countData.count;
        //   const count = data.result.count;

        //   if (data.entities) {
        //     if (data.entities[entityType]) {
        //       const items = Object.keys(data.entities[entityType]);
        //       yield put(OverviewActions.succeedFetch(overviewType, items, true, count));
        //     } else {
        //       yield put(OverviewActions.succeedFetch(overviewType, [], true, count));
        //     }
        //     yield put(OverviewActions.feedEntities(data.entities));
        //   }
        // } else {
        //   const data = yield getData;
        //   if (data.entities) {
        //     if (data.entities[entityType]) {
        //       const items = Object.keys(data.entities[entityType]);
        //       yield put(OverviewActions.succeedFetch(overviewType, items));
        //     } else {
        //       yield put(OverviewActions.succeedFetch(overviewType, []));
        //     }
        //     yield put(OverviewActions.feedEntities(data.entities));
        //   }
        // }
      // } else {

        // Original Logic for Accounts, Contacts and Tasks.
        if (currentSession.pageIndex === 0) {
          const [countData, data] = yield all([
            call(api.post, {
              data: requestData,
              query: mapQuery(
                {
                  sessionKey: currentSession.sessionKey,
                },
                search
              ),
              resource: endPoint.count,
            }),
            getData,
          ]);
          const count = countData.count;

          if (data.entities) {
            if (data.entities[entityType]) {
              const items = Object.keys(data.entities[entityType]);
              yield put(OverviewActions.succeedFetch(overviewType, items, true, count));
            } else {
              yield put(OverviewActions.succeedFetch(overviewType, [], true, count));
            }
            yield put(OverviewActions.feedEntities(data.entities));
          }
        } else {
          const data = yield getData;
          if (data.entities) {
            if (data.entities[entityType]) {
              const items = Object.keys(data.entities[entityType]);
              yield put(OverviewActions.succeedFetch(overviewType, items));
            } else {
              yield put(OverviewActions.succeedFetch(overviewType, []));
            }
            yield put(OverviewActions.feedEntities(data.entities));
          }
        }
      // }

      // }
    } catch (e) {
      yield put(OverviewActions.failFetch(overviewType, e.message));
    }
  };
};

const createOverviewSagas = (
  endPoint: string,
  overviewType: string,
  objectType: string,
  entityType: string,
  schema: {},
  getRequestData: ({}) => {}
) => {
  const fetchList = createFetchListSaga(endPoint, overviewType, objectType, entityType, schema, getRequestData);

  let debouncedList;

  function* debounce() {
    yield delay(1000);
    yield call(fetchList, true);
  }

  function* search(clear = true) {
    yield delay(300);
    yield call(fetchList, true);
  }

  const createWatcher = (action) => {
    return function* watch() {
      while (true) {
        const { objectType: actionObjectType } = yield take(action);
        if (objectType === actionObjectType) {
          if (debouncedList) {
            yield cancel(debouncedList);
          }
          debouncedList = yield fork(debounce);
        }
      }
    };
  };

  function* watchTaskTermChange() {
    while (true) {
      const { objectType: actionObjectType } = yield take(AdvancedSearchActionTypes.SET_TERM);
      if (objectType === actionObjectType) {
        if (debouncedList) {
          yield cancel(debouncedList);
        }
        debouncedList = yield fork(search, true);
      }
    }
  }

  function* watchAdvancedSearchChange({ objectType: actionObjectType }) {
    if (objectType === actionObjectType) {
      if (debouncedList) {
        yield cancel(debouncedList);
      }
      debouncedList = yield call(fetchList, true);
    }
  }

  function* watchOverviewChange({ overviewType: actionOverviewType, clear }) {
    if (overviewType === actionOverviewType) {
      // if (debouncedList) {
      //   yield cancel(debouncedList);
      // }
      yield fork(fetchList, true);
    }
  }

  function* periodWatcher({ objectType: actionOverviewType }) {
    if (objectType === actionOverviewType) {
      if (debouncedList) {
        yield cancel(debouncedList);
      }
      debouncedList = yield call(fetchList, true);
    }
  }

  return [
    // fork(watchTaskTermChange),
    // takeLatest(AdvancedSearchActionTypes.PERFORM_SEARCH, watchAdvancedSearchChange),
    // takeLatest(AdvancedSearchActionTypes.SET_TAG, watchAdvancedSearchChange),
    // takeLatest(AdvancedSearchActionTypes.SELECT_SAVED, watchAdvancedSearchChange),
    // takeLatest(AdvancedSearchActionTypes.SET_FILTER, watchAdvancedSearchChange),
    // takeEvery(OverviewActionTypes.FETCH_REQUEST, watchOverviewChange),
    // fork(createWatcher(PeriodSelectorActions.PREV)),
    // fork(createWatcher(PeriodSelectorActions.NEXT)),
    // takeLatest(PeriodSelectorActions.SELECT, periodWatcher),
    // takeLatest(PeriodSelectorActions.SELECT_START_DATE, periodWatcher),
    // takeLatest(PeriodSelectorActions.SELECT_END_DATE, periodWatcher),
  ];
};

// export default createOverviewSagas;
