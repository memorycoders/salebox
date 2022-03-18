// @flow
import { createSelector } from 'reselect';
import { createTemplate } from './overview.reducer';

const emptyOverview = createTemplate();

export const getTotalRowSelected = createSelector(
  (state, overviewType) => getOverview(state, overviewType),
  (overview) => {
    console.log('================]', overview);
    if (overview?.selectAll) return overview?.itemCount;

    return Object.keys(overview?.selected)?.filter((e) => overview?.selected[e] === true)?.length;
  }
);
export const getOverview = createSelector(
  (state, overviewType) => state.overview[overviewType],
  (overview) => {
    return overview || emptyOverview;
  }
);

export const isItemSelected = createSelector(
  (state, overviewType, itemId) => getOverview(state, overviewType).selected[itemId],
  (state, overviewType) => getOverview(state, overviewType).selectAll,
  (selected, selectAll) => {
    if (selected === false) {
      return selected;
    }
    return selected || selectAll;
  }
);

export const isItemHighlighted = createSelector(
  (state, overviewType, itemId) => getOverview(state, overviewType).highlighted[itemId],
  (highlighted) => highlighted
);

export const isShowSpiner = createSelector(
  (state, overviewType) => getOverview(state, overviewType),
  (overview) => {
    const keys = Object.keys(overview.selected);
    if (keys.length > 0) {
      let isShow = false;
      keys.forEach((key) => {
        if (overview.selected[key] === true) {
          isShow = true;
        }
      });
      if (overview.selectAll) {
        return true;
      }
      return isShow;
    }
    if (overview.selectAll) {
      return true;
    }
    return false;
  }
);

export const isHighlightActionFor = createSelector(
  (state, overviewType) => getOverview(state, overviewType),
  (state, overviewType, itemId) => itemId,
  (state, overviewType, itemId, action) => action,
  (overview, itemId, action) => overview && overview.highlighted[itemId] && overview.highlightAction === action
);

export const isSelectAction = createSelector(
  (state, overviewType) => getOverview(state, overviewType),
  (state, overviewType, action) => action,
  (overview, action) => {
    return (overview && overview.selectAction === action) || false;
  }
);

export const isHighlightAction = createSelector(
  (state, overviewType) => getOverview(state, overviewType),
  (state, overviewType, action) => action,
  (overview, action) => {
    return (overview && overview.highlightAction === action) || false;
  }
);

export const getHighlighted = createSelector(
  (state, overviewType) => getOverview(state, overviewType).highlighted,
  (highlighted) => {
    const items = Object.keys(highlighted).filter((itemId) => highlighted[itemId]);
    if (items.length > 0) {
      return items[0];
    }
    return null;
  }
);

export const getHighlightAction = createSelector(
  (state, overviewType) => getOverview(state, overviewType),
  (overviewObject) => {
    return overviewObject ? overviewObject.highlightAction : '';
  }
);

export const getItemSelected = createSelector(
  (state, overviewType) => getOverview(state, overviewType),
  (overview) => {
    return overview.itemSelected;
  }
);

export const getTempDataQualifiedDeal = createSelector(
  (state, overviewType) => getOverview(state, overviewType),
  (overview) => {
    return overview.tempData;
  }
);
export const getAllItem = (state, overviewType, objectType) => {
  let key = 'task';
  switch (overviewType) {
    case 'ACTIVITIES_TASKS':
      key = 'task';
      break;
    case 'PIPELINE_LEADS':
      key = 'unqualifiedDeal';
      break;
    case 'DELEGATION_TASKS':
      key = 'task';
    default:
      break;
  }

  let orderBy = 'dateAndTime';
  const search = state.search[objectType];
  if (search) {
    orderBy = search.orderBy;
  }

  if (state && state.entities[key]) {
    const entities = state.entities[key];
    const keys = Object.keys(entities);
    let result = keys
      .filter((key) => {
        return !key.startsWith('__');
      })
      .map((k) => entities[k])
      .sort((a, b) => {
        return a[orderBy] >= b[orderBy] ? 1 : -1;
      });

    if (overviewType === 'DELEGATION_TASKS') {
      result = result.filter((item) => !item.ownerId);
    }

    if (overviewType === 'ACTIVITIES_TASKS') {
      result = result.filter((item) => item.ownerId);
    }
    return result;
  }

  return [];
};
