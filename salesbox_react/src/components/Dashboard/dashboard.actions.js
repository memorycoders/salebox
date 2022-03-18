// @flow

const ActionTypes = {
  FETCH_DASHBOARD_REQUEST: 'dashboard/fetchData/request',
  FETCH_DASHBOARD_FAIL: 'dashboard/fetchData/fail',
  FETCH_DASHBOARD_START: 'dashboard/fetchData/start',
  FETCH_DASHBOARD: 'dashboard/fetchData',
  ENABLE_FULLSCREEN: 'dashboard/enableFullscreen',
  DISABLE_FULLSCREEN: 'dashboard/disableFullscreen',
  SET_COLUMNS: 'dashboard/setColumns',
  NEXT_ITEM: 'dashboard/nextItem',
  SET_FULLSCREEN: 'dashboard/setFullscreen',
  SET_DATA_EDIT: 'dashboard/setDataEdit',
  DELETE_CHART: 'dashboard/deleteChart',
  ADD_CHART: 'dashboard/addChart',
  UPDATE_CHART: 'dashboard/updateChart',
  UPDATE_ITEMS: 'dashboard/updateItems',
  UPDATE_INDEX: 'dashboard/updateIndex'
};
export const addChart = (chart) => ({
  type: ActionTypes.ADD_CHART,
  chart
});
export const updateChart = (chart) => ({
  type: ActionTypes.UPDATE_CHART,
  chart
});

export const deleteChart = (chartId) => ({
  type: ActionTypes.DELETE_CHART,
  chartId
});

export const setDataEdit = (editData) => ({
  type: ActionTypes.SET_DATA_EDIT,
  editData
});

export const requestFetchData = () => ({
  type: ActionTypes.FETCH_DASHBOARD_REQUEST,
});

export const startFetchData = () => ({
  type: ActionTypes.FETCH_DASHBOARD_START,
});

export const failFetchData = (message) => ({
  type: ActionTypes.FETCH_DASHBOARD_FAIL,
  message,
});

export const succeedFetchData = (data) => ({
  type: ActionTypes.FETCH_DASHBOARD,
  data,
});

export const enableFullscreen = () => ({
  type: ActionTypes.ENABLE_FULLSCREEN,
});

export const disableFullscreen = () => ({
  type: ActionTypes.DISABLE_FULLSCREEN,
});


export const setFullscreen = (fullscreen) => ({
  type: ActionTypes.SET_FULLSCREEN,
  fullscreen,
});


export const setColumns = (columns) => ({
  type: ActionTypes.SET_COLUMNS,
  columns,
});

export const nextItem = () => ({
  type: ActionTypes.NEXT_ITEM,
});

export const updateItems = (items) => ({
  type: ActionTypes.UPDATE_ITEMS,
  items
});

export const updateIndex = (data) => ({
  type: ActionTypes.UPDATE_INDEX,
  data
})

export default ActionTypes;
