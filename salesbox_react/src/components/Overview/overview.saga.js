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
import { updateListSaleMethodUsing } from '../PipeLineQualifiedDeals/qualifiedDeal.actions';
import { OverviewTypes, Endpoints } from 'Constants';
import moment from 'moment';
import { setRemainder } from '../Appointment/appointment.actions';
import { checkMissingEmailByUser } from '../Contact/contact.actions';
import { getCurrentTimeZone } from 'lib/dateTimeService';
import mockData from '../Resources/mock.json';

const getRequestDataDefault = (requestData) => requestData;

type EndpointType = {
  list: string,
  count: string,
};

// const timezone = new Date().getTimezoneOffset() / -60;
let timeZone = getCurrentTimeZone();

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
    pageSize: 25,
    sessionKey: uuid(),
  };

  return function* fetchList(clear: boolean): Generator<*, *, *> {
    const state = yield select();

    // const overview = state.overview[overviewType] || {};
    // const { lastFetch } = overview;
    // if (lastFetch && moment(lastFetch).valueOf() > moment().valueOf() - 1000){
    //   return;
    // }

    const pathName = state.router.location ? state.router.location.pathname : '';
    try {
      if (overviewType === OverviewTypes.Pipeline.Qualified) {
        const { listShow } = state.entities.qualifiedDeal.__COMMON_DATA;
        if (!listShow) {
          return;
        }
      }
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
      let search = getSearch(state, objectType);

      const period = getPeriod(state, objectType);

      const { searchFieldDTOList } = getSearchForSave(state, objectType);
      const isFilterAll = period.period === 'all';

      let requestData = mapRequestData(
        {
          startDate: isFilterAll ? null : new Date(period.startDate).getTime(),
          endDate: isFilterAll ? null : new Date(period.endDate).getTime(),
          isFilterAll,
          roleFilterType: roleType,
          roleFilterValue: roleValue,
          customFilter: search.filter ? search.filter : 'active',
          orderBy: search.orderBy,
          isRequiredOwner: false,
          ftsTerms: search.term,
          searchFieldDTOList: search.shown ? searchFieldDTOList : [],
          selectedMark: search.tag,
          showHistory: search.history,
        },
        search
      );

      if (overviewType === OverviewTypes.Resource) {
        requestData = {
          ...requestData,
        };
      }
      if (overviewType === OverviewTypes.RecruitmentClosed) {
        const recruitmentCaseIdsObj = state.entities.recruitment.__COMMON_DATA.currentRecruitmentCase;
        const search = getSearch(state, state?.common?.currentObjectType);
        requestData = {
          ...requestData,
          recruitmentCaseIds: recruitmentCaseIdsObj === 'ALL' ? [] : [recruitmentCaseIdsObj],
          wonLossFilter: search?.tag === 'YES' ? 'WON' : search?.tag === 'NO' ? 'LOSS' : 'ALL',
        };
        if (!recruitmentCaseIdsObj) return;
      }
      if (overviewType === OverviewTypes.Contact && clear) {
        yield put(checkMissingEmailByUser());
      }

      if (
        overviewType === 'PIPELINE_ORDER' ||
        overviewType === 'PIPELINE_QUALIFIED' ||
        overviewType === OverviewTypes.Account ||
        overviewType === OverviewTypes.Contact
      ) {
        // const saleProcess = getSaleProcessActive(state);
        // const salesProcessIds = saleProcess ? [saleProcess] : [];
        // requestData = { ...requestData, salesProcessIds };
        currentSession.timeZone = getCurrentTimeZone();
        // currentSession.pageIndex = 0;
      }

      const getData = call(api.post, {
        data: requestData,
        query: mapQuery(currentSession, search),
        resource: pathName.includes('/activities/appointments') ? `${Endpoints.Appointment}/fts` : endPoint.list,
        schema,
      });

      if (
        overviewType === OverviewTypes.CallList.Account ||
        overviewType === OverviewTypes.CallList.Contact ||
        overviewType === OverviewTypes.Resource
      ) {
        const data = yield getData;

        if (data.entities) {
          if (data.entities[entityType]) {
            const items = Object.keys(data.entities[entityType]);
            console.log('data.entities: ', data.entities);
            yield put(
              OverviewActions.succeedFetch(overviewType, items, clear, data.result?.count || data.result.total || 0)
            );
          } else {
            yield put(
              OverviewActions.succeedFetch(overviewType, [], clear, data.result?.count || data.result.total || 0)
            );
          }
          yield put(OverviewActions.feedEntities(data.entities));
        }
      } else if (currentSession.pageIndex === 0) {
        let getRemainder;
        if (pathName === '/activities/calendar') {
          getRemainder = call(api.post, {
            resource: 'task-v3.0/listReminder',
            data: {
              startDate: requestData.startDate,
              endDate: requestData.endDate,
              isFilterAll: requestData.isFilterAll,
              roleFilterType: requestData.roleFilterType,
              roleFilterValue: requestData.roleFilterValue,
              customFilter: requestData.customFilter,
              orderBy: requestData.orderBy,
              isRequiredOwner: true,
              isDelegateTask: false,
              ftsTerms: '',
              searchFieldDTOList: [],
            },
            query: {
              sessionKey: currentSession.sessionKey,
            },
          });
        }
        console.log('start request');
        const [countData, data, remainder] = yield all([
          call(api.post, {
            data: requestData,
            query: mapQuery(
              {
                sessionKey: currentSession.sessionKey,
                timeZone: getCurrentTimeZone(),
              },
              search
            ),
            resource: endPoint?.count,
          }),
          getData,
          pathName === '/activities/calendar' && getRemainder,
        ]);
        console.log('request done');
        let count = countData?.count;
        // if (countData.appointmentsList){
        //   count = countData.appointmentsList.length
        // }

        if (remainder) {
          yield put(setRemainder(remainder.taskDTOList));
        }
        if (data != null && data.result != null) {
          const { companyAvgDistributionDays } = data.result;
          if (companyAvgDistributionDays) {
            yield put(OverviewActions.collectOtherParamInList(overviewType, { companyAvgDistributionDays }));
          }
          if (overviewType === OverviewTypes.Pipeline.Qualified || overviewType === OverviewTypes.Pipeline.Order) {
            const {
              totalGrossValue,
              totalNetValue,
              totalProfit,
              totalWeight,
              countProspectBySalesProcessDTOs,
            } = countData;
            yield put(
              OverviewActions.collectOtherParamInList(overviewType, {
                totalGrossValue,
                totalNetValue,
                totalProfit,
                totalWeight,
                countProspectBySalesProcessDTOs,
              })
            );
            if (overviewType === OverviewTypes.Pipeline.Qualified)
              yield put(updateListSaleMethodUsing(countProspectBySalesProcessDTOs));
          }
        }
        if (overviewType === OverviewTypes.RecruitmentClosed) {
          console.log('data =======>', data);
          // const items = Object.keys(data.result.recruitmentDTOList);
          yield put(
            OverviewActions.succeedFetch(overviewType, data.result.recruitmentDTOList || [], true, data.result.total)
          );
        }
        if (data.entities && overviewType !== OverviewTypes.RecruitmentClosed) {
          console.log('data.entities:2 ', data.entities);
          if (data.entities[entityType]) {
            const items = Object.keys(data.entities[entityType]);
            console.log('data.entities:1 ', data.entities);
            yield put(OverviewActions.succeedFetch(overviewType, items, true, count));
            console.log('data.entities:3 ');
          } else {
            yield put(OverviewActions.succeedFetch(overviewType, [], true, count));
          }
          yield put(OverviewActions.feedEntities(data.entities));
        }
      } else {
        const data = yield getData;
        if (data.entities) {
          if (overviewType === OverviewTypes.RecruitmentClosed) {
            console.log('data =======>', data);
            // const items = Object.keys(data.result.recruitmentDTOList);
            yield put(
              OverviewActions.succeedFetch(
                overviewType,
                data?.result?.recruitmentDTOList || [],
                false,
                data?.result?.total || 0
              )
            );
          } else {
            if (data.entities[entityType]) {
              const items = Object.keys(data.entities[entityType]);
              yield put(OverviewActions.succeedFetch(overviewType, items));
            } else {
              yield put(OverviewActions.succeedFetch(overviewType, []));
            }
            yield put(OverviewActions.feedEntities(data.entities));
          }
        }
      }
      //reset select all
      if(clear) {
        yield put(OverviewActions.setSelectAll(overviewType, false));
      }

      //

      search = {};
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

    yield call(fetchList, clear);
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
    const __common = yield select((state) => state.common);
    if (__common.currentObjectType === actionObjectType && actionObjectType === objectType) {
      if (debouncedList) {
        yield cancel(debouncedList);
      }
      debouncedList = yield fork(fetchList, true);
    }
  }

  function* watchOverviewChange({ overviewType: actionOverviewType, clear }) {
    console.log('function*watchOverviewChange -> overviewType', overviewType, actionOverviewType);

    if (overviewType === actionOverviewType) {
      // if (debouncedList) {
      //   yield cancel(debouncedList);
      // }
      yield fork(fetchList, clear);
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
    takeLatest(AdvancedSearchActionTypes.PERFORM_SEARCH, watchAdvancedSearchChange),
    takeLatest(AdvancedSearchActionTypes.SET_TAG, watchAdvancedSearchChange),
    takeLatest(AdvancedSearchActionTypes.SET_ORDERBY, watchAdvancedSearchChange),
    takeLatest(AdvancedSearchActionTypes.SELECT_SAVED, watchAdvancedSearchChange),
    takeLatest(AdvancedSearchActionTypes.SET_FILTER, watchAdvancedSearchChange),
    takeLatest(AdvancedSearchActionTypes.ENABLE_HISTORY, watchAdvancedSearchChange),
    takeLatest(AdvancedSearchActionTypes.BLOCK_HISTORY, watchAdvancedSearchChange),
    takeLatest(AdvancedSearchActionTypes.HIDE, watchAdvancedSearchChange),
    takeEvery(OverviewActionTypes.FETCH_REQUEST, watchOverviewChange),
    // takeEvery(OverviewActionTypes.CURRENT_ITEM_LEVEL_1, search),
    fork(createWatcher(PeriodSelectorActions.PREV)),
    fork(createWatcher(PeriodSelectorActions.NEXT)),
    takeLatest(PeriodSelectorActions.SELECT, periodWatcher),
    takeLatest(PeriodSelectorActions.SELECT_START_DATE, periodWatcher),
    takeLatest(PeriodSelectorActions.SELECT_END_DATE, periodWatcher),
  ];
};

export default createOverviewSagas;
