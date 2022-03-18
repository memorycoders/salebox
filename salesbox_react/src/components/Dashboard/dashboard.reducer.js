// @flow
import createReducer from 'store/createReducer';
import DashboardActionTypes from 'components/Dashboard/dashboard.actions';

export const initialState = {
  items: [],
  loading: false,
  fullscreen: false,
  columns: 3,
  currentItem: 0,
  __EDIT: {}
};

export default createReducer(initialState, {

  [DashboardActionTypes.ADD_CHART]: (draft, { chart }) => {

    draft.items = draft.items.concat(chart)
  },
  [DashboardActionTypes.UPDATE_CHART]: (draft, { chart }) => {

    const findIndex = draft.items.findIndex(value => value.uuid === chart.uuid);
    if(findIndex !== -1){
      draft.items[findIndex] = chart;
    }
  },
  [DashboardActionTypes.UPDATE_ITEMS]: (draft, { items }) => {
    draft.items = items
  },
  [DashboardActionTypes.DELETE_CHART]: (draft, { chartId }) => {
    draft.items = draft.items.filter(value => value.uuid !== chartId)
  },
  [DashboardActionTypes.SET_DATA_EDIT]: (draft, { editData }) => {
    draft.__EDIT = editData;
  },
  [DashboardActionTypes.FETCH_DASHBOARD_START]: (draft) => {
    draft.loading = true;
  },
  [DashboardActionTypes.FETCH_DASHBOARD_FAIL]: (draft) => {
    draft.loading = false;
  },
  [DashboardActionTypes.FETCH_DASHBOARD]: (draft, { data }) => {
    draft.loading = false;
    draft.items = data.sort((a, b) => a.dashboardIndex - b.dashboardIndex);
  },
  [DashboardActionTypes.ENABLE_FULLSCREEN]: (draft) => {
    draft.fullscreen = true;
  },
  [DashboardActionTypes.DISABLE_FULLSCREEN]: (draft) => {
    draft.fullscreen = false;
  },
  [DashboardActionTypes.SET_FULLSCREEN]: (draft, { fullscreen }) => {
    draft.fullscreen = fullscreen;
  },
  [DashboardActionTypes.NEXT_ITEM]: (draft) => {
    draft.currentItem = (draft.currentItem + 1) % draft.items.length;
  },
  [DashboardActionTypes.SET_COLUMNS]: (draft, { columns }) => {
    draft.columns = columns;
  },
});
