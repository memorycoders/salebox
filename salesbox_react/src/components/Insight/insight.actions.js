// @flow

const ActionTypes = {
  FETCH_DATA_REQUEST: 'insight/data/request',
  FETCH_SALES_DATA_REQUEST: 'insight/salesData/request',
  ACTIVITY_INFO_REQUEST: 'insight/activityInfo/request',
  ACTIVITY_INFO_FAIL: 'insight/activityInfo/fail',
  ACTIVITY_INFO_SUCCESS: 'insight/activityInfo/success',
  WORKLOAD_REQUEST: 'insight/workload/request',
  WORKLOAD_FAIL: 'insight/workload/fail',
  WORKLOAD_SUCCESS: 'insight/workload/success',
  PERFORMANCE_REQUEST: 'insight/performance/request',
  PERFORMANCE_FAIL: 'insight/performance/fail',
  PERFORMANCE_SUCCESS: 'insight/performance/success',
  UP_NEXT_REQUEST: 'insight/upNext/request',
  UP_NEXT_SUCCESS: 'insight/upNext/success',
  SALES_REQUEST: 'insight/sales/request',
  SALES_FAIL: 'insight/sales/fail',
  SALES_SUCCESS: 'insight/sales/success',
  PROFIT_FORECAST_REQUEST: 'insight/profitForecast/request',
  PROFIT_FORECAST_FAIL: 'insight/profitForecast/fail',
  PROFIT_FORECAST_SUCCESS: 'insight/profitForecast/success',
  PIECHART_LIST_REQUEST: 'insight/piechartList/request',
  PIECHART_LIST_FAIL: 'insight/piechartList/fail',
  PIECHART_LIST_SUCCESS: 'insight/piechartList/success',
  SUCCESS_TIMELINE_FETCH: 'insight/timeline/success',
  FETCH_RECENT_ACTIVITY: 'insight/timeline/fetch',

  FETCH_TOP_LISTS: 'insight/topLists/fetch',
  FETCH_TOP_LISTS_SUCCESS: 'insight/topLists/success',

  EXCELDATA_REQUEST: 'insight/excelData/request',
  EXCELDATA_SUCCESS: 'insight/excelData/success',

  FETCH_FORECAST: 'insight/fetchForecast/request',
  FETCH_FORECAST_SUCCESS: 'insight/fetchForecast/success',
  FETCH_FORECAST_FAILED: 'insight/fetchForecast/failed',
  SET_CURRENT_FORECAST_TYPE: 'insight/setCurrentForecastType',
  GET_REPORT_RESOURCE: 'insight/getReportResource',
  SET_PARAMS_REPORT_RESOURCE: 'insight/setParamsReportResource',
  SET_REPORT_RESOURCE: 'insight/setReportResource',
  DOWNLOAD_REPORT_RESOURCE: 'insight/downloadReportResource',
  SAVE_REPORT_RESOURCE: 'insight/saveReportResource'
};

export const fetchForecast = (typeForecast) => ({
  type: ActionTypes.FETCH_FORECAST,
  typeForecast
});

export const fetchForecastSuccess = (data) => ({
  type: ActionTypes.FETCH_FORECAST_SUCCESS,
  ...data
});


export const excelDataSuccess = (data) => ({
  type: ActionTypes.EXCELDATA_SUCCESS,
  data
});

export const excelDataRequest = (reportType) => ({
  type: ActionTypes.EXCELDATA_REQUEST,
  reportType
});

//UP_NEXT_SUCCESS
export const upNextSuccess = (data) => ({
  type: ActionTypes.UP_NEXT_SUCCESS,
  data
});

export const fetchTopLists = () => ({
  type: ActionTypes.FETCH_TOP_LISTS
});

export const fetchTopListsSuccess = (data, actionId) => ({
  type: ActionTypes.FETCH_TOP_LISTS_SUCCESS,
  data,
  actionId
});

export const fetchRecentActivity = (pageIndex) => ({
  type: ActionTypes.FETCH_RECENT_ACTIVITY,
  pageIndex
});

export const successTimeline = (data, count, pageIndex) => {
  return {
    type: ActionTypes.SUCCESS_TIMELINE_FETCH,
    data,
    count,
    pageIndex
  }
}

export const fetchDataRequest = () => ({
  type: ActionTypes.FETCH_DATA_REQUEST,
});

export const fetchSalesDataRequest = () => ({
  type: ActionTypes.FETCH_SALES_DATA_REQUEST,
});

export const requestActivityInfo = () => ({
  type: ActionTypes.ACTIVITY_INFO_REQUEST,
});

export const failActivityInfo = (message) => ({
  type: ActionTypes.ACTIVITY_INFO_FAIL,
  message,
});

export const succeedActivityInfo = (data) => ({
  type: ActionTypes.ACTIVITY_INFO_SUCCESS,
  data,
});

export const requestWorkload = () => ({
  type: ActionTypes.WORKLOAD_REQUEST,
});

export const failWorkload = (message) => ({
  type: ActionTypes.WORKLOAD_FAIL,
  message,
});

export const succeedWorkload = (data) => ({
  type: ActionTypes.WORKLOAD_SUCCESS,
  data,
});

export const requestPerformance = () => ({
  type: ActionTypes.PERFORMANCE_REQUEST,
});

export const failPerformance = (message) => ({
  type: ActionTypes.PERFORMANCE_FAIL,
  message,
});

export const succeedPerformance = (data) => ({
  type: ActionTypes.PERFORMANCE_SUCCESS,
  data,
});

export const requestSales = () => ({
  type: ActionTypes.SALES_REQUEST,
});

export const failSales = (message) => ({
  type: ActionTypes.SALES_FAIL,
  message,
});

export const succeedSales = (data, period) => ({
  type: ActionTypes.SALES_SUCCESS,
  data,
  period
});
export const requestProfitForecast = () => ({
  type: ActionTypes.PROFIT_FORECAST_REQUEST,
});

export const failProfitForecast = (message) => ({
  type: ActionTypes.PROFIT_FORECAST_FAIL,
  message,
});

export const succeedProfitForecast = (data) => ({
  type: ActionTypes.PROFIT_FORECAST_SUCCESS,
  data,
});

export const requestPiechartList = () => ({
  type: ActionTypes.PIECHART_LIST_REQUEST,
});

export const failPiechartList = (message) => ({
  type: ActionTypes.PIECHART_LIST_FAIL,
  message,
});

export const succeedPiechartList = (data) => ({
  type: ActionTypes.PIECHART_LIST_SUCCESS,
  data,
});

export const setCurrentForecastType = (typeForecast) => ({
  type: ActionTypes.SET_CURRENT_FORECAST_TYPE,
  typeForecast
})

export const fetchForecastFailed = () => ({
  type: ActionTypes.FETCH_FORECAST_FAILED
})

export const getReportResource = () => ({
  type: ActionTypes.GET_REPORT_RESOURCE,
})

export const setParamsReportResource = (key, value) => ({
  type: ActionTypes.SET_PARAMS_REPORT_RESOURCE,
  key,
  value
})

export const setReportResource = (data) => ({
  type: ActionTypes.SET_REPORT_RESOURCE,
  data
})

export const downloadReportResource = () => ({
  type: ActionTypes.DOWNLOAD_REPORT_RESOURCE
})

export const saveReportResource = (blob, name) => ({
  type: ActionTypes.SAVE_REPORT_RESOURCE,
  blob,
  name
})

export default ActionTypes;
