// @flow
import { createSelector } from 'reselect';

export const getOrderRows = createSelector(
  (state) => state.entities.orderRow,
  (orderRows) => {
    return Object.keys(orderRows);
  }
);

export const getOrderRow = createSelector(
  (state) => state.entities.orderRow,
  (state, rowId) => rowId,
  (orderRows, rowId) => {
    return orderRows[rowId] || {};
  }
);

export const makeGetOrderRow = () =>
  createSelector(
    (state) => state.entities.orderRow,
    (state, rowId) => rowId,
    (orderRows, rowId) => {
      return orderRows[rowId] || {};
    }
  );

export const getTotals = createSelector(
  (state) => state.entities.orderRow,
  (orderRows) => {
    let cost = 0;
    let profit = 0;
    let value = 0;
    let discountAmount = 0;
    Object.keys(orderRows).forEach((rowId) => {
      const row = orderRows[rowId];
      cost += Number(row.cost || 0);
      profit += row.profit || 0;
      value += row.value || 0;
      discountAmount += row.discountAmount || 0;
    });
    return {
      cost,
      profit,
      value,
      discountAmount,
    };
  }
);

export const makeGetSizes = (overviewType) =>
  createSelector(
    (state) => state.overview[overviewType],
    (overview) => {
      const disabledColumns = overview.disabledColumns || {};
      let product = 3;
      let date = 2;
      let units = 3;
      let discount = 3;

      if (disabledColumns.product) product--;
      if (disabledColumns.productGroup) product--;
      if (disabledColumns.productType) product--;

      if (disabledColumns.startDate) date--;
      if (disabledColumns.endDate) date--;

      if (disabledColumns.unitAmount) units--;
      if (disabledColumns.unitPrice) units--;
      if (disabledColumns.unitCost) units--;

      if (disabledColumns.discountPercent) discount--;
      if (disabledColumns.discountedPrice) discount--;
      if (disabledColumns.discountAmount) discount--;
      const total = 7 + product + date + units + discount;

      return {
        product,
        date,
        units,
        discount,
      };
    }
  );

export const getListOrderRows = createSelector(
  (state) => state.entities.orderRow,
  (state) => state.entities.lineOfBusiness,
  (state) => state.entities.measurementType,
  (orderRows, lineOfBusiness, measurementType) => {
    return Object.keys(orderRows).map((p) => {
      const line = orderRows[p] && orderRows[p].lineOfBusinessId ? lineOfBusiness[orderRows[p].lineOfBusinessId] : null;
      const meas = orderRows[p] && orderRows[p].measurementTypeId ? measurementType[orderRows[p].measurementTypeId] : null;
      return {
        ...orderRows[p],
        id: p,
        lineOfBusinessName: line ? line.name : '',
        measurementTypeName: meas ? meas.name : '',
      };
    });
  }
);
export default getOrderRows;
