import { createSelector } from 'reselect';
import { UIDefaults } from 'Constants';

export const getQualifiedDeals = createSelector(
  (state) => state.entities.qualifiedDeal,
  (state, selected) => selected,
  (qualifiedDeal, selected) => {
    return Object.keys(qualifiedDeal)
      .filter((unqualifiedDealId, index) => unqualifiedDealId === selected || index < UIDefaults.DropdownMaxItems)
      .map((unqualifiedDealId) => {
        const unqualifiedDeal = qualifiedDeal[unqualifiedDealId];
        return {
          key: unqualifiedDeal.uuid,
          value: unqualifiedDeal.uuid,
          text: unqualifiedDeal.displayName,
        };
      });
  }
);

export const makeGetUnqualifiedDeal = () => {
  return createSelector(getQualifiedDeals, (qualifiedDeal) => {
    if (!qualifiedDeal) {
      return {};
    }
    return {
      ...qualifiedDeal,
    };
  });
};

export const getQualified = createSelector(
  (state, id) => state.entities.qualifiedDeal[id],
  (qualifiedDeal) => {
    if (!qualifiedDeal) {
      return {};
    }
    return qualifiedDeal;
  }
);

export const getQualifiedValue = createSelector(
  (state, overviewType) => state.overview[overviewType],
  (overview) => {
    if (overview !== null &&  overview && overview.otherParam !== null) {
      return overview.otherParam;
    }
    return null;
  }
);

export const getCreateQualifiedDeal = createSelector(
  (state) => state.entities.qualifiedDeal.__CREATE,
  (qualifiedDeal) => {
    return qualifiedDeal;
  }
);


export const getDetailBySteps = createSelector(
  (state) => state.entities.qualifiedDeal,
  (qualifiedDeal) => {
    return qualifiedDeal.__TASK_STEPS
  }
);

export const getSaleProcessActive = createSelector(
  (state) => state.entities.qualifiedDeal,
  (qualifiedDeal) => {
    const salesMethodUsing = qualifiedDeal.__COMMON_DATA && qualifiedDeal.__COMMON_DATA.salesMethodUsing ? qualifiedDeal.__COMMON_DATA.salesMethodUsing : [];
    const isAll = qualifiedDeal.__COMMON_DATA.isAll;
    const active = salesMethodUsing.find((value) => value.isActive);
    return isAll ? null : active ? active.uuid : null;
  }
);

export const getSaleProcessInOrderActive = createSelector(
  (state) => state.entities.qualifiedDeal,
  (qualifiedDeal) => {
    const isAll = qualifiedDeal.__ORDER_SALE.isAll;
    const active = qualifiedDeal.__ORDER_SALE.saleId;
    return isAll ? null : active ? active : null;
  }
);
export const getSaleProcessActiveMode = createSelector(
  (state) => state.entities.qualifiedDeal,
  (qualifiedDeal) => {
    const salesMethodUsing = qualifiedDeal.__COMMON_DATA && qualifiedDeal.__COMMON_DATA.salesMethodUsing ? qualifiedDeal.__COMMON_DATA.salesMethodUsing : [];
    const isAll = qualifiedDeal.__COMMON_DATA.isAll;
    const active = salesMethodUsing.find((value) => value.isActive);
    return isAll ? null : active ? active.mode : null;
  }
);
export const isListShowQualified = createSelector(
  (state) => state.entities.qualifiedDeal,
  (qualifiedDeal) => {
    return qualifiedDeal.__COMMON_DATA ? qualifiedDeal.__COMMON_DATA.listShow : false
  }
);
export const getSaleMethodActive = createSelector(
  (state) => state.entities.qualifiedDeal,
  (qualifiedDeal) => {
    const salesMethodUsing = qualifiedDeal.__COMMON_DATA && qualifiedDeal.__COMMON_DATA.salesMethodUsing ? qualifiedDeal.__COMMON_DATA.salesMethodUsing : [];
    const isAll = qualifiedDeal.__COMMON_DATA.isAll;
    const active = salesMethodUsing.find((value) => value.isActive);
    return active ? active.uuid : null;
  }
);

//OpportunityReportInfo
export const getOpportunityReportInfo = createSelector(
  (state) => state.entities.qualifiedDeal,
  (qualifiedDeal) => {
    return qualifiedDeal.__COMMON_DATA ? qualifiedDeal.__COMMON_DATA.OpportunityReportInfo : null
  }
);

