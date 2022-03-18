//@flow
import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import api from 'lib/apiClient';
import { ObjectTypes, Endpoints } from 'Constants';
import { getPeriod } from 'components/PeriodSelector/period-selector.selectors';
import PeriodSelectorActions from 'components/PeriodSelector/period-selector.actions';
import InsightActionTypes, * as InsightActions from './insight.actions';
import moment from 'moment'
import { FORECAST_TYPE, RESOURCE_REPORT } from '../../Constants';

function* fetchActivities(): Generator<*, *, *> {
  try {
    const state = yield select();
    const period = getPeriod(state, ObjectTypes.Insight.Activity);
    const isFilterAll = period.period === 'all';
    const { roleType } = state.ui.app;
    let roleValue = state.ui.app.activeRole;
    if (roleType === 'Person' && !roleValue) {
      roleValue = state.auth.userId;
    } else if (roleType === 'Company') {
      roleValue = undefined;
    }

    const activitiesCall = call(api.post, {
      data: {
        startDate: isFilterAll ? moment().startOf('year').valueOf() : new Date(period.startDate).getTime(),
        endDate: isFilterAll ? moment().endOf('year').valueOf() : new Date(period.endDate).getTime(),
        periodType: isFilterAll ? 'YEAR' : period.period.toUpperCase(), //'YEAR'
        userId: roleType === 'Person' ? roleValue : undefined,
        unitId: roleType === 'Unit' ? roleValue : undefined
      },
      resource: `${Endpoints.Report}/getAllActivitiesInfoES`,
    });

    // const workLoadCall = call(api.post, {
    //   data: {
    //     startDate: isFilterAll ? moment().startOf('year').valueOf() : new Date(period.startDate).getTime(),
    //     endDate: isFilterAll ? moment().endOf('year').valueOf() : new Date(period.endDate).getTime(),
    //     periodType: isFilterAll ? 'YEAR' : period.period.toUpperCase(), //'YEAR'
    //     userId: roleValue,
    //   },
    //   resource: `${Endpoints.Report}/getWorkLoadPerWeekES`,
    // });

    // const recordCall = call(api.post, {
    //   data: {
    //     startDate: isFilterAll ? moment().startOf('year').valueOf() : new Date(period.startDate).getTime(),
    //     endDate: isFilterAll ? moment().endOf('year').valueOf() : new Date(period.endDate).getTime(),
    //     periodType: isFilterAll ? 'YEAR' : period.period.toUpperCase(), //'YEAR'
    //     userId: roleValue,
    //   },
    //   resource: `${Endpoints.Report}/gap/activityRecordsES`,
    // });

    // const unNextCall = call(api.post, {
    //   data: {
    //     startDate: isFilterAll ? moment().startOf('year').valueOf() : new Date(period.startDate).getTime(),
    //     endDate: isFilterAll ? moment().endOf('year').valueOf() : new Date(period.endDate).getTime(),
    //     periodType: isFilterAll ? 'YEAR' : period.period.toUpperCase(), //'YEAR'
    //     userId: roleValue,
    //   },
    //   resource: `${Endpoints.Report}/gap/upNextES`,
    // });

    // const [activities, workLoad, record, upNext] = yield all([
      const [activities] = yield all([

      activitiesCall,
      // workLoadCall,
      // recordCall,
      // unNextCall
    ])
    // yield put(InsightActions.upNextSuccess(upNext.upNextDTOList));
    // yield put(InsightActions.succeedPerformance(record.activityRecordDTOList));
    // yield put(InsightActions.succeedWorkload(workLoad.workloadPerWeekDTOList));
    yield put(InsightActions.succeedActivityInfo(activities.salesActivityDTOList));
  } catch (e) {
    yield put(InsightActions.failActivityInfo(e.message));
  }
}

function* fetchAllRecentActivityInfo(props): Generator<*, *, *> {
  try {
    const state = yield select();
    const period = getPeriod(state, ObjectTypes.Insight.Activity);
    const isFilterAll = period.period === 'all';
    const { roleType } = state.ui.app;
    let roleValue = state.ui.app.activeRole;
    if (roleType === 'Person' && !roleValue) {
      roleValue = state.auth.userId;
    } else if (roleType === 'Company') {
      roleValue = undefined;
    }
    const data = yield call(api.post, {
      data: {
        startDate: isFilterAll ? moment().startOf('year').valueOf() : new Date(period.startDate).getTime(),
        endDate: isFilterAll ? moment().endOf('year').valueOf() : new Date(period.endDate).getTime(),
        periodType: isFilterAll ? 'YEAR' : period.period.toUpperCase(), //'YEAR'
        userId: roleType === 'Person' ? roleValue : undefined,
        unitId: roleType === 'Unit' ? roleValue : undefined
      },
      query: {
        pageIndex: props.pageIndex ? props.pageIndex : 0,
        pageSize: 20
      },
      resource: `${Endpoints.Report}/getAllRecentActivityInfoES`,
    });

    yield put(InsightActions.successTimeline(data.recentActivityDTOList, data.count, props.pageIndex ? props.pageIndex : 0));
  } catch (e) {
  }
}

function* fetchWorkload(): Generator<*, *, *> {
  try {
    const state = yield select();
    const period = getPeriod(state, ObjectTypes.Insight.Activity);
    const isFilterAll = period.period === 'all';
    const { roleType } = state.ui.app;
    let roleValue = state.ui.app.activeRole;
    if (roleType === 'Person' && !roleValue) {
      roleValue = state.auth.userId;
    } else if (roleType === 'Company') {
      roleValue = undefined;
    }
    const data = yield call(api.post, {
      data: {
        startDate: isFilterAll ? moment().startOf('year').valueOf() : new Date(period.startDate).getTime(),
        endDate: isFilterAll ? moment().endOf('year').valueOf() : new Date(period.endDate).getTime(),
        periodType: isFilterAll ? 'YEAR' : period.period.toUpperCase(), //'YEAR'
        userId: roleType === 'Person' ? roleValue : undefined,
        unitId: roleType === 'Unit' ? roleValue : undefined
      },
      resource: `${Endpoints.Report}/getWorkLoadPerWeekES`,
    });
    yield put(InsightActions.succeedWorkload(data.workloadPerWeekDTOList));
  } catch (e) {
    yield put(InsightActions.failWorkload(e.message));
  }
}

function* fetchPerformance(): Generator<*, *, *> {
  try {
    const state = yield select();
    const period = getPeriod(state, ObjectTypes.Insight.Activity);
    const isFilterAll = period.period === 'all';
    const { roleType } = state.ui.app;
    let roleValue = state.ui.app.activeRole;
    if (roleType === 'Person' && !roleValue) {
      roleValue = state.auth.userId;
    } else if (roleType === 'Company') {
      roleValue = undefined;
    }
    const data = yield call(api.post, {
      data: {
        startDate: isFilterAll ? moment().startOf('year').valueOf() : new Date(period.startDate).getTime(),
        endDate: isFilterAll ? moment().endOf('year').valueOf() : new Date(period.endDate).getTime(),
        periodType: isFilterAll ? 'YEAR' : period.period.toUpperCase(), //'YEAR'
        userId: roleType === 'Person' ? roleValue : undefined,
        unitId: roleType === 'Unit' ? roleValue : undefined
      },
      resource: `${Endpoints.Report}/gap/activityRecordsES`,
    });
    yield put(InsightActions.succeedPerformance(data.activityRecordDTOList));
  } catch (e) {
    yield put(InsightActions.failPerformance(e.message));
  }
}

function* fetchUpNext(): Generator<*, *, *> {
  try {
    const state = yield select();
    const period = getPeriod(state, ObjectTypes.Insight.Activity);
    const isFilterAll = period.period === 'all';
    const { roleType } = state.ui.app;
    let roleValue = state.ui.app.activeRole;
    if (roleType === 'Person' && !roleValue) {
      roleValue = state.auth.userId;
    } else if (roleType === 'Company') {
      roleValue = undefined;
    }
    const data = yield call(api.post, {
      data: {
        startDate: isFilterAll ? moment().startOf('year').valueOf() : new Date(period.startDate).getTime(),
        endDate: isFilterAll ? moment().endOf('year').valueOf() : new Date(period.endDate).getTime(),
        periodType: isFilterAll ? 'YEAR' : period.period.toUpperCase(), //'YEAR'
        userId: roleType === 'Person' ? roleValue : undefined,
        unitId: roleType === 'Unit' ? roleValue : undefined
      },
      resource: `${Endpoints.Report}/gap/upNextES`,
    });
    yield put(InsightActions.upNextSuccess(data.upNextDTOList));
  } catch (e) {

  }
}

function* fetchSales(): Generator<*, *, *> {
  try {
    const state = yield select();
    const period = getPeriod(state, ObjectTypes.Insight.Sales);
    const isFilterAll = period.period === 'all';
    const { roleType } = state.ui.app;
    let roleValue = state.ui.app.activeRole;
    if (roleType === 'Person' && !roleValue) {
      roleValue = state.auth.userId;
    } else if (roleType === 'Company') {
      roleValue = undefined;
    }

    const salesCall = call(api.post, {
      data: {
        startDate: isFilterAll ? moment().startOf('year').valueOf() : new Date(period.startDate).getTime(),
        endDate: isFilterAll ? moment().endOf('year').valueOf() : new Date(period.endDate).getTime(),
        periodType: isFilterAll ? 'YEAR' : period.period.toUpperCase(), //'YEAR'
        userId: roleType === 'Person' ? roleValue : undefined,
        unitId: roleType === 'Unit' ? roleValue : undefined
      },
      resource: `${Endpoints.Report}/salesES`,
    });

    const profitCall = call(api.post, {
      data: {
        startDate: isFilterAll ? moment().startOf('year').valueOf() : new Date(period.startDate).getTime(),
        endDate: isFilterAll ? moment().endOf('year').valueOf() : new Date(period.endDate).getTime(),
        periodType: isFilterAll ? 'YEAR' : period.period.toUpperCase(), //'YEAR'
        userId: roleType === 'Person' ? roleValue : undefined,
        unitId: roleType === 'Unit' ? roleValue : undefined
      },
      resource: `${Endpoints.Report}/profitForecastES`,
    });

    const pieCall = call(api.post, {
      data: {
        startDate: isFilterAll ? moment().startOf('year').valueOf() : new Date(period.startDate).getTime(),
        endDate: isFilterAll ? moment().endOf('year').valueOf() : new Date(period.endDate).getTime(),
        periodType: isFilterAll ? 'YEAR' : period.period.toUpperCase(), //'YEAR'
        userId: roleType === 'Person' ? roleValue : undefined,
        unitId: roleType === 'Unit' ? roleValue : undefined
      },
      resource: `${Endpoints.Report}/pieChart/listES`,
    });

    const [sales, profit, pie] = yield all([
      salesCall,
      profitCall,
      pieCall
    ])
    yield put(InsightActions.succeedSales(sales, isFilterAll ? 'YEAR' : period.period.toUpperCase() ));
    yield put(InsightActions.succeedProfitForecast(profit));
    yield put(InsightActions.succeedPiechartList(pie));
  } catch (e) {
    console.log('eeee: ', e)
    //yield put(InsightActions.failSales(e.message));
  }
}

// function* fetchProfitForecast(): Generator<*, *, *> {
//   try {
//     const state = yield select();
//     const period = getPeriod(state, ObjectTypes.Insight.Sales);
//     const isFilterAll = period.period === 'all';
//     const { roleType } = state.ui.app;
//     let roleValue = state.ui.app.activeRole;
//     if (roleType === 'Person' && !roleValue) {
//       roleValue = state.auth.userId;
//     } else if (roleType === 'Company') {
//       roleValue = undefined;
//     }
//     const data = yield
//     yield put(InsightActions.succeedProfitForecast(data));
//   } catch (e) {
//     yield put(InsightActions.failProfitForecast(e.message));
//   }
// }

// function* fetchPiechartList(): Generator<*, *, *> {
//   try {
//     const state = yield select();
//     const period = getPeriod(state, ObjectTypes.Insight.Sales);
//     const isFilterAll = period.period === 'all';
//     const { roleType } = state.ui.app;
//     let roleValue = state.ui.app.activeRole;
//     if (roleType === 'Person' && !roleValue) {
//       roleValue = state.auth.userId;
//     } else if (roleType === 'Company') {
//       roleValue = undefined;
//     }
//     const data = yield
//     yield put(InsightActions.succeedPiechartList(data));
//   } catch (e) {
//     yield put(InsightActions.failPiechartList(e.message));
//   }
// }


function* fetchActivityData() {
  yield call(fetchActivities);
 // yield call(fetchWorkload);
  //yield call(fetchPerformance);
  yield put(InsightActions.fetchRecentActivity(0))
  //yield call(fetchUpNext)
}

function* fetchSalesData() {
  yield call(fetchSales);
  // yield call(fetchProfitForecast);
  // yield call(fetchPiechartList);
}

function* periodWatcher({ objectType: actionObjectType }) {
  switch (actionObjectType) {
    case ObjectTypes.Insight.Activity:
      yield call(fetchActivityData);
    break;
    case ObjectTypes.Insight.Sales:
      yield call(fetchSales);
      yield call(fetForecast)
    break;
    case ObjectTypes.Insight.TopLists:
      yield call(fetchTopListsData);
    break;
    case ObjectTypes.Insight.Resource:
      yield call(getReportResource)
      break;
  }
}


function* fetchAllTopLists(): Generator<*, *, *> {
  try {
    const state = yield select();
    const period = getPeriod(state, ObjectTypes.Insight.TopLists);
    const isFilterAll = period.period === 'all';
    const { roleType } = state.ui.app;
    let roleValue = state.ui.app.activeRole;
    if (roleType === 'Person' && !roleValue) {
      roleValue = state.auth.userId;
    } else if (roleType === 'Company') {
      roleValue = undefined;
    }

    const topLists = call(api.post, {
      data: {
        startDate: isFilterAll ? moment().startOf('year').valueOf() : new Date(period.startDate).getTime(),
        endDate: isFilterAll ? moment().endOf('year').valueOf() : new Date(period.endDate).getTime(),
        periodType: isFilterAll ? 'YEAR' : period.period.toUpperCase(), //'YEAR'
        userId: roleType === 'Person' ? roleValue : undefined,
        unitId: roleType === 'Unit' ? roleValue : undefined
      },
      resource: `${Endpoints.Report}/allTopListES`,
    });

    const performer = call(api.post, {
      data: {
        startDate: isFilterAll ? moment().startOf('year').valueOf() : new Date(period.startDate).getTime(),
        endDate: isFilterAll ? moment().endOf('year').valueOf() : new Date(period.endDate).getTime(),
        periodType: isFilterAll ? 'YEAR' : period.period.toUpperCase(), //'YEAR'
        userId: roleType === 'Person' ? roleValue : undefined,
        unitId: roleType === 'Unit' ? roleValue : undefined
      },
      resource: `${Endpoints.Report}/topListES/PERFORMERS`,
    });
    const [topListsData, performerData] = yield all([
      topLists,
      performer
    ])
    yield put(InsightActions.fetchTopListsSuccess(topListsData));
    yield put(InsightActions.fetchTopListsSuccess(performerData, 'performerTopList'));
  } catch (e) {

  }
}

function* fetchPerformers(): Generator<*, *, *> {
  try {
    const state = yield select();
    const period = getPeriod(state, ObjectTypes.Insight.TopLists);
    const isFilterAll = period.period === 'all';
    const { roleType } = state.ui.app;
    let roleValue = state.ui.app.activeRole;
    if (roleType === 'Person' && !roleValue) {
      roleValue = state.auth.userId;
    } else if (roleType === 'Company') {
      roleValue = undefined;
    }
    const data = yield call(api.post, {
      data: {
        startDate: isFilterAll ? moment().startOf('year').valueOf() : new Date(period.startDate).getTime(),
        endDate: isFilterAll ? moment().endOf('year').valueOf() : new Date(period.endDate).getTime(),
        periodType: isFilterAll ? 'YEAR' : period.period.toUpperCase(), //'YEAR'
        userId: roleType === 'Person' ? roleValue : undefined,
        unitId: roleType === 'Unit' ? roleValue : undefined
      },
      resource: `${Endpoints.Report}/topListES/PERFORMERS`,
    });
    yield put(InsightActions.fetchTopListsSuccess(data,'performerTopList'));
  } catch (e) {

  }
}

function* getExcelDownload({ reportType }): Generator<*, *, *> {
  try {
    const state = yield select();
    const period = getPeriod(state, ObjectTypes.Insight.Downloads);
    const isFilterAll = period.period === 'all';
    const { roleType } = state.ui.app;
    let roleValue = state.ui.app.activeRole;
    let isUnit = false;
    if (roleType === 'Person') {
      if (!roleValue)
          roleValue = state.auth.userId;
    } else if (roleType === 'Company') {
      roleValue = undefined;
    } else {
      isUnit = true;
    }
    const data = yield call(api.download, {
      startDate: isFilterAll ? moment().startOf('year').valueOf() : new Date(period.startDate).getTime(),
      endDate: isFilterAll ? moment().endOf('year').valueOf() : new Date(period.endDate).getTime(),
      periodType: isFilterAll ? 'YEAR' : period.period.toUpperCase(), //'YEAR'
      userId: roleValue,
      react: true,
      reportType,
      isUnit
    });
    console.log('datadata: ', data)
    yield put(InsightActions.excelDataSuccess(data, 'FORECAST_OVERVIEW_ES_FILE'));
  } catch (e) {

  }
}

function* fetchTopListsData() {
  yield call(fetchAllTopLists);
  // yield call(fetchPerformers);
  // yield call(fetchPiechartList);
}

//Request URL: https://production-qa.salesbox.com/report-v3.0/columnLineChart/get/REVENUE_FORECAST?token=208f1859-2c62-4d57-bdc9-736edf3d93d8&enterpriseID=ed00b3e4-ecbe-4f01-9585-3ccc2dc693b7


function* fetForecast(): Generator<*, *, *> {
  try {
    const state = yield select();
    const period = getPeriod(state, ObjectTypes.Insight.Sales);
    const isFilterAll = period.period === 'all';
    const { roleType } = state.ui.app;
    let roleValue = state.ui.app.activeRole;
    if (roleType === 'Person' && !roleValue) {
      roleValue = state.auth.userId;
    } else if (roleType === 'Company') {
      roleValue = undefined;
    }

    const revenueCall = call(api.post, {
      data: {
        startDate: isFilterAll ? moment().startOf('year').valueOf() : new Date(period.startDate).getTime(),
        endDate: isFilterAll ? moment().endOf('year').valueOf() : new Date(period.endDate).getTime(),
        periodType: isFilterAll ? 'YEAR' : period.period.toUpperCase(), //'YEAR'
        userId: roleType === 'Person' ? roleValue : undefined,
        unitId: roleType === 'Unit' ? roleValue : undefined
      },
      resource: `${Endpoints.Report}/columnLineChart/get/REVENUE_FORECAST`,
    });
    const profitCall = call(api.post, {
      data: {
        startDate: isFilterAll ? moment().startOf('year').valueOf() : new Date(period.startDate).getTime(),
        endDate: isFilterAll ? moment().endOf('year').valueOf() : new Date(period.endDate).getTime(),
        periodType: isFilterAll ? 'YEAR' : period.period.toUpperCase(), //'YEAR'
        userId: roleType === 'Person' ? roleValue : undefined,
        unitId: roleType === 'Unit' ? roleValue : undefined
      },
      resource: `${Endpoints.Report}/columnLineChart/get/PROFIT_FORECAST`,
    });

    const marginCall = call(api.post, {
      data: {
        startDate: isFilterAll ? moment().startOf('year').valueOf() : new Date(period.startDate).getTime(),
        endDate: isFilterAll ? moment().endOf('year').valueOf() : new Date(period.endDate).getTime(),
        periodType: isFilterAll ? 'YEAR' : period.period.toUpperCase(), //'YEAR'
        userId: roleType === 'Person' ? roleValue : undefined,
        unitId: roleType === 'Unit' ? roleValue : undefined
      },
      resource: `${Endpoints.Report}/columnLineChart/get/MARGIN_FORECAST`,
    });

    //MARGIN_FORECAST
    let revenue, profit, margin;
    switch(state.entities.insight.currentForecastType) {
      case FORECAST_TYPE[0]:
      case FORECAST_TYPE[1]:
        revenue = yield revenueCall;
        break;
      case FORECAST_TYPE[2]:
        profit = yield profitCall;
        break;
      case FORECAST_TYPE[3]:
        margin = yield marginCall;
        break;
    }
    // const [revenue, profit, margin] = yield all([
    //   revenueCall,
    //   profitCall,
    //   marginCall
    // ])
    yield put(InsightActions.fetchForecastSuccess({ revenue, profit, margin, period: isFilterAll ? 'YEAR' : period.period.toUpperCase() }));
  } catch (e) {
    yield put(InsightActionTypes.fetchForecastFailed())
  }
}

function* getParamsReport() {
  const state = yield select();
  const entities = yield select((state) => state.entities);
  const period = getPeriod(state, ObjectTypes.Insight.Resource);

  const { roleType } = state.ui.app;
  let ownerId = state.ui.app.activeRole;
  let roleValue = state.ui.app.activeRole;
  if (roleType === 'Person' && !ownerId) {
    ownerId = state.auth.userId;
  } else if (roleType === 'Company') {
    ownerId = undefined;
  }
  if (roleType === 'Person' && !roleValue) {
    roleValue = state.auth.userId;
  } else if (roleType === 'Company') {
    roleValue = undefined;
  }
  return {
    periodType: entities?.insight?.resourceReport?.periodType,
    roleFilterType:roleType,
    roleFilterValue: roleValue,
    statusType: entities?.insight?.resourceReport?.statusType,
    year: period?.endDate ? new Date(period?.endDate).getFullYear() : new Date().getFullYear()
  }
}

function* getReportResource () {
  try {
    let _data = yield call(getParamsReport)
    const rs = yield call(api.post, {
      data: _data,
      resource: `${Endpoints.Resource}/resource/getReport`,
    });
    if(rs) {
      yield put(InsightActions.setReportResource(rs))
    }
  } catch(ex){
  }
}
function* downloadReportResource() {
  try {
    let _data = yield call(getParamsReport)
    const rs = yield call(api.post, {
      data: _data,
      options: {
        responseType: 'blob',
      },
      resource: `${Endpoints.Resource}/resource/downloadReport`,
    });
    yield put(InsightActions.saveReportResource(rs, `Salesbox resource report` ))
  } catch(ex) {


  }
}


export default function* saga(): Generator<*, *, *> {
  yield takeLatest(InsightActionTypes.FETCH_DATA_REQUEST, fetchActivityData);
  yield takeLatest(InsightActionTypes.FETCH_SALES_DATA_REQUEST, fetchSalesData);
  yield takeLatest(PeriodSelectorActions.PREV, periodWatcher);
  yield takeLatest(PeriodSelectorActions.NEXT, periodWatcher);
  yield takeLatest(PeriodSelectorActions.SELECT, periodWatcher);

  //ActionTypes.SET_ROLE_TAB
  yield takeLatest(PeriodSelectorActions.SELECT_START_DATE, periodWatcher);
  yield takeLatest(PeriodSelectorActions.SELECT_END_DATE, periodWatcher);
  yield takeLatest(InsightActionTypes.FETCH_RECENT_ACTIVITY, fetchAllRecentActivityInfo);
  yield takeLatest(InsightActionTypes.FETCH_TOP_LISTS, fetchTopListsData);
  yield takeLatest(InsightActionTypes.EXCELDATA_REQUEST, getExcelDownload);
  yield takeLatest(InsightActionTypes.FETCH_FORECAST, fetForecast);
  yield takeLatest(InsightActionTypes.GET_REPORT_RESOURCE, getReportResource);
  yield takeLatest(InsightActionTypes.SET_PARAMS_REPORT_RESOURCE, getReportResource);
  yield takeLatest(InsightActionTypes.DOWNLOAD_REPORT_RESOURCE, downloadReportResource)
  //FETCH_FORECAST
  //fetchAllRecentActivityInfo
}
