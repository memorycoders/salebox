// @flow
const ActionTypes = {
  REGISTER: 'period/register',
  NEXT: 'period/next',
  PREV: 'period/previous',
  SELECT: 'period/select',
  SELECT_START_DATE: 'period/selectStartDate',
  SELECT_END_DATE: 'period/selectEndDate',
  UPDATE_PERIOD_FROM_SETTING: 'period/updatePeriodFromSetting',
  UPDATE_WEEK_TYPE: 'period/updateWeekType',
  REFRESH_PERIOD: 'period/refresh',
};

export const updateWeekType = (objectType: string, weekType) => ({
  type: ActionTypes.UPDATE_WEEK_TYPE,
  objectType,
  weekType
});

export const next = (objectType: string) => ({
  type: ActionTypes.NEXT,
  objectType,
});

export const register = (objectType: string) => ({
  type: ActionTypes.REGISTER,
  objectType,
});

export const previous = (objectType: string) => ({
  type: ActionTypes.PREV,
  objectType,
});

export const selectPeriod = (objectType: string, period: string, startDate) => ({
  type: ActionTypes.SELECT,
  objectType,
  period,
  startDate
});

export const selectStartDate = (objectType: string, startDate: Date) => ({
  type: ActionTypes.SELECT_START_DATE,
  objectType,
  startDate,
});

export const selectEndDate = (objectType: string, endDate: Date) => ({
  type: ActionTypes.SELECT_END_DATE,
  objectType,
  endDate,
});

export const updateFromSetting = (setting) => ({
  type: ActionTypes.UPDATE_PERIOD_FROM_SETTING,
  setting
})
export const refreshPeriod = (objectType: string) => ({
  type: ActionTypes.REFRESH_PERIOD,
  objectType
});

export default ActionTypes;
