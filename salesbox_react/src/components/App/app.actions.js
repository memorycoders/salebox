// @flow
const ActionTypes = {
  SHOW_DRAWER: 'app/showDrawer',
  HIDE_DRAWER: 'app/hideDrawer',
  TOGGLE_DRAWER: 'app/toggleDrawer',
  FINISH_LOADING: 'app/finishLoading',
  SET_HELP_MODE: 'app/setHelpMode',
  SET_HELP_MODE_REQUEST: 'app/setHelpMode/request',
  SET_LOCALE: 'app/setLocale',
  SET_LOCALE_REQUEST: 'app/setLocale/request',
  INIT: 'app/init',
  FETCH_AVERAGE_VALUES_REQUEST: 'app/fetchAverageValues/request',
  FETCH_AVERAGE_VALUES_FAIL: 'app/fetchAverageValues/fail',
  FETCH_AVERAGE_VALUES: 'app/fetchAverageValues',
  SET_ROLE_TAB: 'app/setRoleTab',
  SET_ACTIVE_ROLE: 'app/setActiveRole',
  REDRAW: 'app/redraw',
  DETECT_LOCALE_REQUEST: 'app/locale/request',    // By IP
  UPDATE_CURRENCY: 'app/updateCurrency',
  RULE_PACKAGE: 'app/rulePackage',
  UPDATE_DETAIL_SECTIONS: 'app/updateDetailSections',
  FET_DETAIL_SECTIONS: 'app/fetchDetailSections',
  UPDATE_CATEGORY_DETAIL_SECTIONS: 'app/updateCategoryDetailSections',
  UPDATE_LOCALIZATION_CONST:'app/updateLocalizationConst',
  UPDATE_LAST_TIME_USED_REQUEST:'app/updateLastTimeUsedRequest',
  UPDATE_LAST_TIME_USED:'app/updateLastTimeUsed'
};

export const showDrawer = () => ({
  type: ActionTypes.SHOW_DRAWER,
});

export const redraw = () => ({
  type: ActionTypes.REDRAW,
});

export const hideDrawer = () => ({
  type: ActionTypes.HIDE_DRAWER,
});

export const toggleDrawer = () => ({
  type: ActionTypes.TOGGLE_DRAWER,
});

export const setHelpMode = (helpMode: string) => ({
  type: ActionTypes.SET_HELP_MODE,
  helpMode,
});

export const setHelpModeRequest = (helpMode: string) => ({
  type: ActionTypes.SET_HELP_MODE_REQUEST,
  helpMode,
});

export const setLocale = (locale: string) => ({
  type: ActionTypes.SET_LOCALE,
  locale,
});

export const setLocaleRequest = (locale: string) => ({
  type: ActionTypes.SET_LOCALE_REQUEST,
  locale,
});

export const finishLoading = () => ({
  type: ActionTypes.FINISH_LOADING,
});

export const init = () => ({
  type: ActionTypes.INIT,
});

export const failFetchAverageValues = (error) => ({
  type: ActionTypes.FETCH_AVERAGE_VALUES_FAIL,
  error,
});

export const requestFetchAverageValues = () => ({
  type: ActionTypes.FETCH_AVERAGE_VALUES_REQUEST,
});

export const fetchAverageValues = (averageValues: {}) => ({
  type: ActionTypes.FETCH_AVERAGE_VALUES,
  averageValues,
});

export const setRoleTab = (roleTab: string) => ({
  type: ActionTypes.SET_ROLE_TAB,
  roleTab,
});

export const setActiveRole = (roleType: string, activeRole: string) => ({
  type: ActionTypes.SET_ACTIVE_ROLE,
  roleType,
  activeRole,
});

// export const detectLocaleRequest = (token: string) => ({
//   type: ActionTypes.DETECT_LOCALE_REQUEST,
//   token,
// });

export const updateCurrency = (currency) => ({
  type: ActionTypes.UPDATE_CURRENCY,
  currency,
});

export const fetchDetailSections = ()=> {
  return {
    type: ActionTypes.FET_DETAIL_SECTIONS
  }
}

export const updateDetailSections = data => {
  return {
    type: ActionTypes.UPDATE_DETAIL_SECTIONS,
    data
  }
}

export const updateCategoryDetailSections = (detailType, data) => {
  return {
    type: ActionTypes.UPDATE_CATEGORY_DETAIL_SECTIONS,
    detailType,
    data
  }
}
export const updateLocalizationConst = () => {
  return {
    type: ActionTypes.UPDATE_LOCALIZATION_CONST,
  }
}
export const updateLastTimeUsed = () => {
  return {
    type: ActionTypes.UPDATE_LAST_TIME_USED,
  }
}
export const updateLastTimeUsedRequest = () => {
  return {
    type: ActionTypes.UPDATE_LAST_TIME_USED_REQUEST,
  }
}
export default ActionTypes;
