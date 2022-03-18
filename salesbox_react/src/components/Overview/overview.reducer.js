// @flow
/* eslint-disable no-param-reassign */
import createReducer from 'store/createReducer';
import OverviewActionTypes from 'components/Overview/overview.actions';
import AuthActionTypes from 'components/Auth/auth.actions';
import { OverviewTypes } from '../../Constants';

export const createTemplate = () => ({
  lastFetch: 0,
  selectAction: null,
  highlightAction: null,
  detailAction: null,
  panelAction: null,
  selected: {},
  selectAll: false,
  highlighted: {},
  isFetching: false,
  pristine: true,
  itemCount: 0,
  items: [],
  disabledColumns: {
    productType: true,
    unitCost: true,
    discountAmount: true,
    discountPercent: true,
    discountedPrice: true,
    cost: true,
    currency: true,
    margin: true,
    profit: true,
    startDate: true,
    endDate: true,
    occupied: true
  },
  currentItemLv1: null,
});

export const initialState = {};

const ensureOverview = (draft, overviewType) => {
  if (!draft[overviewType]) {
    draft[overviewType] = createTemplate();
  }
  return draft[overviewType];
};

const mapKeys = {
  product: 'product',
  productGroup: 'productGroup',
  productType: 'productType',
  deliveryStartDate: 'startDate',
  deliveryEndDate: 'endDate',
  unitAmount: 'unitAmount',
  costUnit: 'unitCost',
  unitPrice: 'unitPrice',
  discountAmount: 'discountAmount',
  discountPercent: 'discountPercent',
  discountedPrice: 'discountedPrice',
  cost: 'cost',
  value: 'value',
  currency: 'currency',
  margin: 'margin',
  profit: 'profit',
  description: 'description',
  occupied: 'occupied'
};
export default createReducer(initialState, {
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },
  [OverviewActionTypes.SET_ORDER_BY]: (draft, { overviewType, orderBy }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.orderBy = orderBy;
  },
  [OverviewActionTypes.SELECT]: (draft, { overviewType, itemId }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.selected[itemId] = true;
  },
  [OverviewActionTypes.UNSELECT]: (draft, { overviewType, itemId }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.selected[itemId] = false;
  },
  [OverviewActionTypes.HIGHLIGHT]: (draft, { overviewType, itemId, highlightAction, item }) => {
    const overview = ensureOverview(draft, overviewType);
    const keysId = Object.keys(overview.highlighted);
    keysId.forEach((id) => {
      overview.highlighted[id] = false;
    });
    overview.highlighted[itemId] = true;
    overview.itemSelected = item;
    if (typeof highlightAction !== 'undefined') {
      overview.highlightAction = highlightAction;
    }
  },
  [OverviewActionTypes.EDIT_ENTITY]: (draft, { overviewType, itemId }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.highlighted[itemId] = true;
    overview.highlightAction = 'edit';
  },
  [OverviewActionTypes.CREATE_ENTITY]: (draft, { overviewType }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.highlightAction = 'create';
  },
  [OverviewActionTypes.CLEAR_HIGHLIGHT]: (draft, { overviewType, itemId }) => {
    const overview = ensureOverview(draft, overviewType);
    if (itemId) {
      overview.highlighted[itemId] = false;
    }
    overview.highlightAction = null;
  },
  [OverviewActionTypes.UNHIGHLIGHT]: (draft, { overviewType, itemId }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.highlighted[itemId] = false;
  },
  [OverviewActionTypes.SET_ACTION_FOR_SELECT]: (draft, { overviewType, selectAction }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.selectAction = selectAction;
  },
  [OverviewActionTypes.CLEAR_SELECT_ACTION]: (draft, { overviewType }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.selectAction = null;
  },
  [OverviewActionTypes.SET_DETAIL_ACTION]: (draft, { overviewType, detailAction }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.detailAction = detailAction;
  },
  [OverviewActionTypes.SET_PANEL_ACTION]: (draft, { overviewType, panelAction }) => {
    const overview = ensureOverview(draft, overviewType);
    if (overview.panelAction === panelAction) {
      overview.panelAction = null;
    } else {
      overview.panelAction = panelAction;
    }
  },
  [OverviewActionTypes.SET_ACTION_FOR_HIGHLIGHT]: (draft, { overviewType, highlightAction }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.highlightAction = highlightAction;
  },
  [OverviewActionTypes.CLEAR_HIGHLIGHT_ACTION]: (draft, { overviewType }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.highlightAction = null;
    overview.itemSelected = undefined;
  },
  [OverviewActionTypes.FETCH_START]: (draft, { overviewType }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.isFetching = true;
  },
  [OverviewActionTypes.FETCH_SUCCESS]: (draft, { overviewType, items, itemCount, clear }) => {
    const overview = ensureOverview(draft, overviewType);

    if (clear) {
      overview.items = items;
    } else {
      overview.items = [...overview.items, ...items];
    }
    if (typeof itemCount !== 'undefined') {
      overview.itemCount = itemCount;
    }
    overview.isFetching = false;
    overview.pristine = false;
    overview.lastFetch = new Date();
  },
  [OverviewActionTypes.FETCH_FAIL]: (draft, { overviewType, error }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.isFetching = false;
    draft.errorFetch = error;
  },
  [OverviewActionTypes.SET_SELECT_ALL]: (draft, { overviewType, selectAll }) => {
    const overview = ensureOverview(draft, overviewType);
    const { selected } = overview;
    const keys = Object.keys(selected);
    if (selectAll) {
      keys.forEach((item) => {
        overview.selected[item] = true;
      });
    } else {
      keys.forEach((item) => {
        overview.selected[item] = false;
      });
    }
    overview.selectAll = selectAll;
  },
  [OverviewActionTypes.SET_UNSELECT_ALL]: (draft, { overviewType, selectAll }) => {
    const overview = ensureOverview(draft, overviewType);
    const { selected } = overview;
    const keys = Object.keys(selected);
    if (selectAll) {
      keys.forEach((item) => {
        overview.selected[item] = false;
      });
    } else {
      keys.forEach((item) => {
        overview.selected[item] = false;
      });
    }
    overview.selectAll = selectAll;
  },
  [OverviewActionTypes.ENABLE_COLUMN]: (draft, { overviewType, column }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.disabledColumns = overview.disabledColumns || {};
    overview.disabledColumns[column] = false;
  },
  [OverviewActionTypes.DISABLE_COLUMN]: (draft, { overviewType, column }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.disabledColumns = overview.disabledColumns || {};
    overview.disabledColumns[column] = true;
  },
  [OverviewActionTypes.CURRENT_ITEM_LEVEL_1]: (draft, { overviewType, itemId }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.currentItemLv1 = itemId;
  },
  [OverviewActionTypes.DELETE_ROW_SUCCESS]: (draft, { overviewType, itemId }) => {
    const overview = ensureOverview(draft, overviewType);
    const index = overview.items.indexOf(itemId);
    // overview.isFetching = true;
    if (index !== -1) {
      overview.itemCount = draft[overviewType].itemCount - 1;
      overview.items = [...overview.items.slice(0, index), ...overview.items.slice(index + 1)];
    }
  },
  [OverviewActionTypes.DELETE_ROW_SUCCESS_FOR_RECRUITMENT]: (draft, { overviewType }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.itemCount = draft[overviewType].itemCount - 1;
  },
  [OverviewActionTypes.SET_TASK]: (draft, { overviewType, itemId }) => {
    const overview = ensureOverview(draft, overviewType);
    const index = overview.items.indexOf(itemId);
    // overview.isFetching = true;
    if (index !== -1) {
      overview.items = [...overview.items.slice(0, index), ...overview.items.slice(index + 1)];
      overview.itemCount = overview.items.length;
    }
  },
  [OverviewActionTypes.DELEGATE_TASK_SUCCESS]: (draft, { overviewType, itemId }) => {
    const overview = ensureOverview(draft, overviewType);
    const index = overview.items.indexOf(itemId);
    if (index !== -1) {
      overview.itemCount = draft[overviewType].itemCount - 1;
      overview.items = [...overview.items.slice(0, index), ...overview.items.slice(index + 1)];
    }
  },
  [OverviewActionTypes.CLEAR_SELECTED_ON_CHANGE_MENU]: (draft, { overviewType }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.selected = {};
    overview.selectAll = false;
  },
  [OverviewActionTypes.COLLECT_OTHER_RESULT_NOT_IN_LIST]: (draft, { overviewType, data }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.otherParam = {};
    if (data.count) {
      overview.itemCount = data.count;
    }
    Object.keys(data).forEach((key) => {
      overview.otherParam[key] = data[key];
    });
  },
  [OverviewActionTypes.COLLECT_OTHER_RESULT_FILTER]: (draft, { overviewType, data }) => {
    const overview = ensureOverview(draft, overviewType);
    if (data.count) {
      overview.itemCount = data.count;
    }
    const oldCount = overview.otherParam ? overview.otherParam.countProspectBySalesProcessDTOs : [];
    const countProspectBySalesProcessDTOs = (oldCount ? oldCount : []).map((i) => {
      const countProspect = (data.countProspectBySalesProcessDTOs ? data.countProspectBySalesProcessDTOs : []).find(
        (value) => value.salesProcessId === i.salesProcessId
      );
      return countProspect || i;
    });
    overview.otherParam = {
      ...data,
      countProspectBySalesProcessDTOs,
      // countProspectBySalesProcessDTOs: [
      //   ...overview.otherParam.countProspectBySalesProcessDTOs,
      //   ...data.countProspectBySalesProcessDTOs,
      // ],
    };
  },
  [OverviewActionTypes.STORE_QUALIFIED_DEAL_VALUE]: (draft, { overviewType, data }) => {
    const overview = ensureOverview(draft, overviewType);
    overview.tempData = {};
    Object.keys(data).forEach((key) => {
      overview.tempData[key] = data[key];
    });
  },
  [OverviewActionTypes.UPDATE_COLUMN_ORDER_ROW_FROM_SETTING]: (draft, { data }) => {
    // const overviewT = OverviewTypes.CommonOrderRow;
    // draft.COMMON_ORDER_ROW = draft.COMMON_ORDER_ROW || {}
    const overview = ensureOverview(draft, OverviewTypes.CommonOrderRow);
    if (data && data.orderRows && data.orderRows.viewList) {
      let arrayKeys = data.orderRows.viewList;
      let key = '';
      for (let i = 0; i < arrayKeys.length; i++) {
        key = mapKeys[arrayKeys[i].name];
        if (key !== undefined) {
          overview.disabledColumns[key] = !arrayKeys[i].selected;
        }
      }
    }
  },
  [OverviewActionTypes.UPDATE_FAVORITE_SUCCESS]: (draft, { candidateId, flag }) => {
    if (candidateId) {
      let arrayKeys = draft.CANDIDATE_CLOSE.items;
      for (let i = 0; i < arrayKeys.length; i++) {
        if (arrayKeys[i].uuid === candidateId) {
          arrayKeys[i].favorite = flag;
        }
      }
    }
  },
  [OverviewActionTypes.DELETE_CANDIDATE_CLOSED_SUCCESS]: (draft, { candidateId }) => {
    if (candidateId) {
      let a = draft.CANDIDATE_CLOSE?.items?.filter((e) => e.uuid !== candidateId);
      draft.CANDIDATE_CLOSE.items = a;
    }
  },
  [OverviewActionTypes.ADD_NEW_ITEM_TO_LIST] : (draft, {id, oldId}) => {

    if(draft.CONTACTS && draft.CONTACTS.items) {
      let index = draft.CONTACTS?.items?.indexOf(oldId);
      let length = draft.CONTACTS.items.length;
        draft.CONTACTS.items =[...draft.CONTACTS.items?.slice(0, index), id, ...draft.CONTACTS.items?.slice(index+1, length)];
    }

  }
});
