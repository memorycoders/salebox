// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import OverviewActionTypes from 'components/Overview/overview.actions';
import { OverviewTypes } from 'Constants';

export const initialState = {};

const consumeEntities = createConsumeEntities('productGroup');

export default createReducer(initialState, {
  [OverviewActionTypes.CREATE_ENTITY]: (draft, { overviewType, defaults }) => {
    if (overviewType === OverviewTypes.ProductGroup) {
      draft.__CREATE = {
        ...defaults,
      };
    }
  },
  default: consumeEntities,
});
