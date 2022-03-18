// @flow
import { createPeriodTemplate } from './period-selector.reducer';
import { createSelector } from 'reselect';

const emptyPeriod = createPeriodTemplate();

export const getPeriod = createSelector(
  (state, objectType) => state.period[objectType],
  (period) => {
    return period || emptyPeriod;
  }
);
