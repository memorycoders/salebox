// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import AuthActionTypes from 'components/Auth/auth.actions';
import InsightActionTypes from 'components/Insight/insight.actions';
import humanFormat from 'human-format';
import moment from 'moment';
import { FORECAST_TYPE, RESOURCE_REPORT } from '../../Constants';
import FileSaver from 'file-saver';
import _l from 'lib/i18n';

export const initialState = {
  activities: {},
  timeline: {
    list: [],
    count: 0
  },
  workload: {},
  performance: {},
  sales: {},
  profitForecast: {},
  piechartList: {},
  forecast: {
    column: [],
    line: []
  },
  revenue: {
    column: [],
    line: []
  },
  profit: {
    column: [],
    line: []
  },
   margin: {
    column: [],
    line: []
  },
  salesObjectInfo: {},
  topLists: {},
  upNext: [],
  excelData: {},
  currentForecastType: FORECAST_TYPE[0],
  isLoading: false,
  resourceReport: {
    statusType: RESOURCE_REPORT.BOOKED,
    periodType: 'MONTH',
    year: '2020',
  },
  resourceReportDatas: []
};


function getDisplayByQuarter(value, startOfFirstPeriod, startOfLastPeriod, endOfFirstPeriod, endOfLastPeriod) {
  var result;
  if (value == startOfFirstPeriod) {
    result = moment(startOfFirstPeriod).format('D') + "-" + moment(endOfFirstPeriod).format('D')
      + "/" + moment(startOfFirstPeriod).format('MMM');
  }

  else if (value == startOfLastPeriod) {
    result = moment(startOfLastPeriod).format('D') + "-"
      + moment(endOfLastPeriod + 1000 * 60 * 60 * 24 * 1).format('D')
      + "/" + moment(startOfLastPeriod).format('MMM')
  } else {
    result = moment(value).format('D') + "-" + moment(value + 1000 * 60 * 60 * 24 * 6).format('D');
    if (moment(value).format('MMM') != moment(value + 1000 * 60 * 60 * 24 * 6).format('MMM')) {
      result += "/" + moment(value + 1000 * 60 * 60 * 24 * 6).format('MMM');
    } else {
      result += "/" + moment(value).format('MMM')
    }
  }
  return result;
}

function getDisplayByMonth(value, startOfLastPeriod, endOfLastPeriod) {
  var result;
  if (value == startOfLastPeriod) {
    result = moment(startOfLastPeriod).format('D') + "-"
      + moment(endOfLastPeriod + 1000 * 60 * 60 * 24 * 1).format('D');
  } else {
    result = moment(value).format('D') + "-" + moment(value + 1000 * 60 * 60 * 24 * 2).format('D');
  }
  return result;
}

function generateLabel(value, period, startOfFirstPeriod, startOfLastPeriod, endOfFirstPeriod, endOfLastPeriod) {
  console.log('startOfFirstPeriod, startOfLastPeriod, endOfFirstPeriod, endOfLastPeriod: ', startOfFirstPeriod, startOfLastPeriod, endOfFirstPeriod, endOfLastPeriod)
  switch (period.toUpperCase()) {
    case "YEAR":
      return moment(value).format('MMM')
    case "QUARTER":
      return getDisplayByQuarter(value, startOfFirstPeriod, startOfLastPeriod, endOfFirstPeriod, endOfLastPeriod)
    case "MONTH":
      return getDisplayByMonth(value, startOfLastPeriod, endOfLastPeriod);
    case "WEEK":
      return moment(value).format('D');
    case "DAY":
      return moment(value).format('D');
  }
}

const consumeEntities = createConsumeEntities('insight');

export default createReducer(initialState, {
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => {
      if(id !== 'resourceReport')
        delete draft[id]
    });

  },
  [InsightActionTypes.SUCCESS_TIMELINE_FETCH]: (draft, { data, count, pageIndex }) => {
    console.log('pageIndexpageIndex: ', pageIndex)
    if (pageIndex === 0) {
      draft.timeline = {
        list: data,
        count
      }
    } else {
      draft.timeline = {
        list: draft.timeline.list.concat(data),
        count
      }
    }

  },
  //activities
  [InsightActionTypes.ACTIVITY_INFO_SUCCESS]: (draft, { data }) => {
    if (Array.isArray(data)) {
      draft.activities = draft.activities || {};
      data.forEach((data) => {
        draft.activities[data.activityType] = data;
      });
    }
  },
  [InsightActionTypes.UP_NEXT_SUCCESS]: (draft, { data }) => {
    draft.upNext = data;
  },

  //EXCELDATA_SUCCESS
  [InsightActionTypes.EXCELDATA_SUCCESS]: (draft, { data, dataType }) => {
    draft.excelData = draft.excelData || {};
    draft.excelData = data;
  },
  [InsightActionTypes.WORKLOAD_SUCCESS]: (draft, { data }) => {
    if (Array.isArray(data)) {
      draft.workload = draft.workload || {};
      data.forEach((data) => {
        draft.workload[data.workloadType] = data;
      });
    }
  },
  [InsightActionTypes.PERFORMANCE_SUCCESS]: (draft, { data }) => {
    if (Array.isArray(data)) {
      draft.performance = draft.performance || {};
      data.forEach((data) => {
        draft.performance[data.activityType] = data;
      });
    }
  },
  [InsightActionTypes.PROFIT_FORECAST_SUCCESS]: (draft, { data }) => {
    draft.profitForecast = draft.profitForecast || {};
    Object.keys(data).forEach((key) => {
      draft.profitForecast[key] = data[key];
    });
  },
  [InsightActionTypes.PIECHART_LIST_SUCCESS]: (draft, { data }) => {
    draft.piechartList = draft.piechartList || {};
    Object.keys(data.pieChartDTOList).forEach((key) => {
      const piechart = data.pieChartDTOList[key];
      draft.piechartList[piechart.label] = piechart.piecesDTOList.map((data) => ({
        x: data.label === '' ? '?' : data.label,
        y: data.percent,
      }));
    });
  },
  [InsightActionTypes.SALES_SUCCESS]: (draft, { data, period }) => {
    draft.sales = draft.sales || {};
    if (data.circleListDTO && data.circleListDTO.circleDTOList) {
      draft.sales.pipelineSales = draft.sales.pipelineSales || {};
      Object.keys(data.circleListDTO.circleDTOList).forEach((key) => {
        const sale = data.circleListDTO.circleDTOList[key];
        draft.sales.pipelineSales[sale.labelType] = sale;
      });
    }
    if (data.quickStatsDTO && data.quickStatsDTO.circleDTOList) {
      draft.sales.salesStats = draft.sales.salesStats || {};
      Object.keys(data.quickStatsDTO.circleDTOList).forEach((key) => {
        const salesStat = data.quickStatsDTO.circleDTOList[key];
        draft.sales.salesStats[salesStat.labelType] = salesStat;
      });
    }
    if (data.recordDTO) {
      draft.sales.records = draft.sales.records || {};
      let newRecords = {};
      Object.keys(data.recordDTO.dealRecordDTOList).forEach((key) => {
        const record = data.recordDTO.dealRecordDTOList[key];
        newRecords[record.dealRecordType] = record;
      });
      draft.sales.records = newRecords;
    }
    if (data.salesForecastColumnLineChartDTO && data.salesForecastColumnLineChartDTO.columnLineDTOList) {
      let prev = 0;
      draft.forecast = {};
      draft.forecast.column = [];
      draft.forecast.line = [];
      let startOfFirstPeriod,startOfLastPeriod, endOfFirstPeriod, endOfLastPeriod;
      data.salesForecastColumnLineChartDTO.columnLineDTOList.forEach((item, idx) => {


        if (idx === 0) {
          startOfFirstPeriod = item.periodDTO.startDate;
          endOfFirstPeriod = item.periodDTO.endDate;
        }

        if (idx === data.salesForecastColumnLineChartDTO.columnLineDTOList.length -1) {
          startOfLastPeriod = item.periodDTO.startDate;
          endOfLastPeriod = item.periodDTO.endDate;
        }
      });

      data.salesForecastColumnLineChartDTO.columnLineDTOList.forEach((data, idx) => {
        prev += data.periodDTO.numberDaysBetweenStartDateAndEndDate;


        draft.forecast.column.push({
          x: generateLabel(data.periodDTO.startDate, period, startOfFirstPeriod, startOfLastPeriod, endOfFirstPeriod, endOfLastPeriod),
          y: data.columnValue,
          label: humanFormat(data.columnValue),
        });
        draft.forecast.line.push({
          x: generateLabel(data.periodDTO.startDate, period, startOfFirstPeriod, startOfLastPeriod, endOfFirstPeriod, endOfLastPeriod),
          y: data.lineValue,
          label: humanFormat(data.lineValue),
        });
      });
    }
    if (data.salesObjectInfoDTO) {
      draft.salesObjectInfo = {
        campaign: data.salesObjectInfoDTO.campaignDTO,
        lead: data.salesObjectInfoDTO.leadDTO,
        prospect: data.salesObjectInfoDTO.prospectDTO,
      };
    }
  },
  [InsightActionTypes.FETCH_FORECAST]: (draft) => {
    draft.isLoading = true
  },
  [InsightActionTypes.FETCH_FORECAST_FAILED]: (draft) => {
    draft.isLoading = false
  },
  [InsightActionTypes.FETCH_FORECAST_SUCCESS]: (draft, { revenue, profit, margin, period }) => {
    draft.isLoading = false
    let prevRevenue = 0;
    draft.revenue = {};
    draft.revenue.column = [];
    draft.revenue.line = [];
    let startOfFirstPeriod, startOfLastPeriod, endOfFirstPeriod, endOfLastPeriod;
    if(revenue){
      revenue.columnLineDTOList.forEach((data, idx) => {

        if (idx === 0) {
          startOfFirstPeriod = data.periodDTO.startDate;
          endOfFirstPeriod = data.periodDTO.endDate;
        }

        if (idx === revenue.columnLineDTOList.length - 1) {
          startOfLastPeriod = data.periodDTO.startDate;
          endOfLastPeriod = data.periodDTO.endDate;
        }
      });
      revenue.columnLineDTOList.forEach((data) => {
        prevRevenue += data.periodDTO.numberDaysBetweenStartDateAndEndDate;
        draft.revenue.column.push({
          x: generateLabel(data.periodDTO.startDate, period, startOfFirstPeriod, startOfLastPeriod, endOfFirstPeriod, endOfLastPeriod ),
          y: data.columnValue,
          label: humanFormat(data.columnValue),
        });
        draft.revenue.line.push({
          x: generateLabel(data.periodDTO.startDate, period, startOfFirstPeriod, startOfLastPeriod, endOfFirstPeriod, endOfLastPeriod),
          y: data.lineValue,
          label: humanFormat(data.lineValue),
        });
      });
    }

    let prevProfit = 0;
    draft.profit = {};
    draft.profit.column = [];
    draft.profit.line = [];
    if(profit) {
      profit.columnLineDTOList.forEach((data, idx) => {

        if (idx === 0) {
          startOfFirstPeriod = data.periodDTO.startDate;
          endOfFirstPeriod = data.periodDTO.endDate;
        }

        if (idx === profit.columnLineDTOList.length - 1) {
          startOfLastPeriod = data.periodDTO.startDate;
          endOfLastPeriod = data.periodDTO.endDate;
        }
      });
      profit.columnLineDTOList.forEach((data) => {
        prevProfit += data.periodDTO.numberDaysBetweenStartDateAndEndDate;
        draft.profit.column.push({
          x: generateLabel(data.periodDTO.startDate, period, startOfFirstPeriod, startOfLastPeriod, endOfFirstPeriod, endOfLastPeriod),
          y: data.columnValue,
          label: humanFormat(data.columnValue),
        });
        draft.profit.line.push({
          x: generateLabel(data.periodDTO.startDate, period, startOfFirstPeriod, startOfLastPeriod, endOfFirstPeriod, endOfLastPeriod),
          y: data.lineValue,
          label: humanFormat(data.lineValue),
        });
      });
    }

    let prevMargin = 0;
    draft.margin = {};
    draft.margin.column = [];
    draft.margin.line = [];
    if(margin) {
      margin.columnLineDTOList.forEach((data, idx) => {

        if (idx === 0) {
          startOfFirstPeriod = data.periodDTO.startDate;
          endOfFirstPeriod = data.periodDTO.endDate;
        }

        if (idx === margin.columnLineDTOList.length -1) {
          startOfLastPeriod = data.periodDTO.startDate;
          endOfLastPeriod = data.periodDTO.endDate;
        }
      });
      margin.columnLineDTOList.forEach((data) => {
        prevMargin += data.periodDTO.numberDaysBetweenStartDateAndEndDate;
        draft.margin.column.push({
          x: generateLabel(data.periodDTO.startDate, period, startOfFirstPeriod, startOfLastPeriod, endOfFirstPeriod, endOfLastPeriod),
          y: data.columnValue,
          label: humanFormat(data.columnValue),
        });
        draft.margin.line.push({
          x: generateLabel(data.periodDTO.startDate, period, startOfFirstPeriod, startOfLastPeriod, endOfFirstPeriod, endOfLastPeriod),
          y: data.lineValue,
          label: humanFormat(data.lineValue),
        });
      });
    }
  },
  [InsightActionTypes.FETCH_TOP_LISTS_SUCCESS]: (draft, { data, actionId }) => {

    if (actionId) {
      draft.topLists = {
        ...draft.topLists,
        [actionId]: data
      }
    } else {
      draft.topLists = data;
    }
  },
  [InsightActionTypes.SET_CURRENT_FORECAST_TYPE]: (draft, {typeForecast}) => {
    draft.currentForecastType = typeForecast;
  },
  [InsightActionTypes.SET_PARAMS_REPORT_RESOURCE]: (draft, {key, value}) => {
    if(draft?.resourceReport[key])
      draft.resourceReport[key] = value;
  },
  [InsightActionTypes.SET_REPORT_RESOURCE]: (draft, {data}) => {
    draft.resourceReportDatas = data;
  },
  [InsightActionTypes.SAVE_REPORT_RESOURCE]: (draft, {blob, name}) => {
    FileSaver.saveAs(blob, `${_l`Salesbox resource report`} - ${draft.resourceReport?.statusType === RESOURCE_REPORT.BOOKED ? _l`Booked` : _l`Coming` }.xls`)
  },

  default: consumeEntities,
});
