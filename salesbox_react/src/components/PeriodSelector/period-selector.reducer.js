// @flow
/* eslint-disable no-param-reassign */
import createReducer from 'store/createReducer';
import PeriodActionTypes from 'components/PeriodSelector/period-selector.actions';
import AuthActionTypes from 'components/Auth/auth.actions';
import moment from 'moment';
import { ObjectTypes } from '../../Constants';

const dayInSeconds = 24 * 60 * 60;

// Gets the monday for a given date
const getMonday = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

const periodCalculators = {
  // Calculate the next / previous day
  day: (date = new Date(), offset = 0) => {
    const startDate = moment(date)
      .add(offset, 'day')
      .startOf('day');
    return {
      startDate: startDate.toDate(),
      endDate: startDate
        .add(offset, 'day')
        .endOf('day')
        .toDate(),
    };
  },
  // Calculate the next / previous week
  week: (date = new Date(), offset = 0) => {
    const start = moment(date)
      .startOf('isoweek')
      .startOf('day');

    return {
      startDate: start.toDate(),
      endDate: moment(date)
        .endOf('isoweek')
        .endOf('day')
        .toDate(),
    };
  },
  // Calculate the next / previous month
  month: (date = new Date(), offset = 0) => {
    const start = moment(date)
      .startOf('month')
      .startOf('day');
    return {
      startDate: start.toDate(),
      endDate: moment(date)
        .endOf('month')
        .endOf('day')
        .toDate(),
    };
  },
  // Calculate the next / previous quarter
  quarter: (date = new Date(), offset = 0) => {
    const quarter = Math.floor(date.getMonth() / 3);
    const startDate = new Date(date.getFullYear(), quarter * 3 + offset * 3, 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0, 23, 59, 59);

    return {
      startDate,
      endDate,
    };
  },
  // Calculate the next / previous year
  year: (date = new Date(), offset = 0) => {
    const year = moment(date)
      .startOf('year')
      .startOf('day');
    return {
      startDate: year.toDate(),
      endDate: moment(date)
        .endOf('year')
        .endOf('day')
        .toDate(),
    };
  },
};

export const createPeriodTemplate = (objectType) => {
  const period =
    objectType === 'APPOINTMENT'
      ? 'day'
      : objectType === 'INSIGHT_ACTIVITIES' ||
        objectType === 'INSIGHT_SALES' ||
        objectType === 'INSIGHT_TOP_LISTS' ||
        objectType === 'INSIGHT_DOWNLOADS' ||
        objectType === 'INSIGHT_CHART_CREATE' ||
        objectType === 'INSIGHT_RESOURCE'
      ? 'year'
      : 'all';

  const dates =
    period === 'day'
      ? periodCalculators.day()
      : period === 'year'
      ? periodCalculators.year()
      : periodCalculators.month();

  return {
    period,
    currentDate: new Date(),
    ...dates,
  };
};

// Get the start and end date for a given period with an offset.
// This means this can be used to calculate the start and enddate
// of previous / next periods for different period types.
const getDate = (period, date, offset = 0) => {
  return periodCalculators[period](date, offset);
};

const handleSelectPeriod = (draft, objectType, period, startDate) => {
  if (!draft[objectType]) {
    draft[objectType] = createPeriodTemplate(objectType);
  }
  const objectPeriod = draft[objectType];
  if(period!=null)
  objectPeriod.period = period;
  //fix yesterday
  // console.log("handleSelectPeriod period",period);
  // console.log("handleSelectPeriod startDate",startDate);
  // console.log("handleSelectPeriod new Date()",new Date());
  // console.log("handleSelectPeriod objectPeriod.currentDate",objectPeriod.currentDate);

  if(objectPeriod.period == 'day' && startDate == null) startDate = new Date();

  if (startDate) {
    objectPeriod.startDate = moment(startDate)
      .startOf('day')
      .toDate();
    objectPeriod.endDate = moment(startDate)
      .endOf('day')
      .toDate();
    return;
  }
  if (periodCalculators[objectPeriod.period]) {
    // const { startDate, endDate } = getDate(objectPeriod.period, new Date(objectPeriod.currentDate));
    const { startDate, endDate } = getDate(objectPeriod.period, new Date());
    objectPeriod.startDate = startDate;
    objectPeriod.endDate = endDate;
  }
};

export const initialState = {
  INSIGHT_ACTIVITIES: createPeriodTemplate('INSIGHT_ACTIVITIES'),
};

export default createReducer(initialState, {
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },
  [PeriodActionTypes.REGISTER]: (draft, { objectType }) => {
    if(!draft[objectType])
    draft[objectType] = createPeriodTemplate(objectType);
  },
  [PeriodActionTypes.PREV]: (draft, { objectType }) => {
    const objectPeriod = draft[objectType];
    if (objectPeriod) {
      const { startDate, endDate, period } = objectPeriod;
      let offset = 0;
      if (startDate && endDate) {
        if (period === 'custom') {
          offset = moment(moment(endDate).endOf('day')).diff(moment(startDate).startOf('day'), 'day');
        } else if (period === 'week') {
          offset = 7;
        } else if (period === 'day') {
          offset = 1;
        } else if (period === 'quarter') {
          objectPeriod.startDate = moment(startDate)
            .subtract(3, 'month')
            .startOf('month');
          objectPeriod.endDate = moment(endDate)
            .subtract(3, 'month')
            .endOf('month');
          return;
        } else if (period === 'year') {
          objectPeriod.startDate = moment(startDate)
            .subtract(1, 'year')
            .startOf('year');
          objectPeriod.endDate = moment(endDate)
            .subtract(1, 'year')
            .endOf('year');
          return;
        } else if (period === 'month') {
          objectPeriod.startDate = moment(endDate)
            .subtract(1, 'month')
            .startOf('month');
          objectPeriod.endDate = moment(endDate)
            .subtract(1, 'month')
            .endOf('month');
          return;
        }
      }
      objectPeriod.startDate = moment(startDate).subtract(offset, 'day');
      objectPeriod.endDate = moment(endDate).subtract(offset, 'day');
    }
  },
  [PeriodActionTypes.NEXT]: (draft, { objectType }) => {
    const objectPeriod = draft[objectType];
    if (objectPeriod) {
      const { startDate, endDate, period } = objectPeriod;
      let offset = 0;
      if (startDate && endDate) {
        if (period === 'custom') {
          offset = moment(moment(endDate).endOf('day')).diff(moment(startDate).startOf('day'), 'day');
        } else if (period === 'week') {
          offset = 7;
        } else if (period === 'day') {
          offset = 1;
        } else if (period === 'quarter') {
          objectPeriod.startDate = moment(startDate)
            .add(3, 'month')
            .startOf('month');
          objectPeriod.endDate = moment(endDate)
            .add(3, 'month')
            .endOf('month');
          return;
        } else if (period === 'year') {
          objectPeriod.startDate = moment(endDate)
            .add(1, 'year')
            .startOf('year');
          objectPeriod.endDate = moment(endDate)
            .add(1, 'year')
            .endOf('year');
          return;
        } else if (period === 'month') {
          objectPeriod.startDate = moment(endDate)
            .add(1, 'month')
            .startOf('month');
          objectPeriod.endDate = moment(endDate)
            .add(1, 'month')
            .endOf('month');
          return;
        }
      }
      objectPeriod.startDate = moment(startDate).add(offset, 'day');
      objectPeriod.endDate = moment(endDate).add(offset, 'day');
    }
  },
  [PeriodActionTypes.SELECT_START_DATE]: (draft, { objectType, startDate }) => {
    const objectPeriod = draft[objectType];
    objectPeriod.startDate = startDate;
    objectPeriod.period = 'custom';
  },
  [PeriodActionTypes.SELECT_END_DATE]: (draft, { objectType, endDate }) => {
    const objectPeriod = draft[objectType];
    objectPeriod.endDate = endDate;
    objectPeriod.period = 'custom';
  },
  [PeriodActionTypes.UPDATE_WEEK_TYPE]: (draft, { objectType, weekType }) => {
    const objectPeriod = draft[objectType];
    objectPeriod.weekType = weekType;
  },
  [PeriodActionTypes.SELECT]: (draft, { objectType, period, startDate }) => {
    // if (!draft[objectType]) {
    //   draft[objectType] = createPeriodTemplate(objectType);
    // }
    // const objectPeriod = draft[objectType];
    // objectPeriod.period = period;
    // if (startDate) {
    //   objectPeriod.startDate = moment(startDate).startOf('day').toDate();
    //   objectPeriod.endDate = moment(startDate).endOf('day').toDate();
    //   return
    // }
    // if (periodCalculators[objectPeriod.period]) {
    //   const { startDate, endDate } = getDate(objectPeriod.period, new Date(objectPeriod.currentDate));
    //   objectPeriod.startDate = startDate;
    //   objectPeriod.endDate = endDate;
    // }

    handleSelectPeriod(draft, objectType, period, startDate);
  },
  [PeriodActionTypes.UPDATE_PERIOD_FROM_SETTING]: (draft, { setting }) => {
    let objectT = '';
    Object.keys(setting).forEach((key) => {
      switch (key) {
        case 'accounts':
          objectT = ObjectTypes.Account;
          break;
        case 'appointments':
          objectT = ObjectTypes.Appointment;
          break;
        case 'leads':
          objectT = ObjectTypes.PipelineLead;
          break;
        case 'pipeline':
          objectT = ObjectTypes.PipelineQualified;
          break;
        case 'tasks':
          objectT = ObjectTypes.Task;
          break;
        case 'insights':
          objectT = ObjectTypes.Insight.Activity;
          break;
        case 'delegation':
          objectT = ObjectTypes.Delegation;
          break;
        case 'delegationLead':
          objectT = ObjectTypes.DelegationLead;
          break;
        case 'pipelineOrder':
          objectT = ObjectTypes.PipelineOrder;
          break;
      }
      if (objectT !== '') {
        handleSelectPeriod(
          draft,
          objectT,
          setting[key] && setting[key].timeFilterType
            ? setting[key].timeFilterType.toLowerCase()
            : objectT === ObjectTypes.Insight.Activity
            ? 'year'
            : 'all',
          null
        );
      }
      objectT = '';
    });
  },

  [PeriodActionTypes.REFRESH_PERIOD]: (draft, { objectType }) => {
    handleSelectPeriod(draft, objectType, null);
  },

});
