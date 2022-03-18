// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';

import AuthActionTypes from 'components/Auth/auth.actions';
import SaleMethodActionTypes from './sales-method.actions';

export const initialState = {};

const consumeEntities = createConsumeEntities('salesMethod');

export default createReducer(initialState, {
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },
  [SaleMethodActionTypes.DELETE_SALES_METHOD]: (draft, { id }) => {
    console.log('DELETE:', id);

    if (id) {
      delete draft[id];
    }
  },
  default: consumeEntities,
});
