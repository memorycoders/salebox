// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import UnitActionTypes from 'components/Unit/unit.actions';
import AuthActionTypes from 'components/Auth/auth.actions';

export const initialState = {};

const consumeEntities = createConsumeEntities('unit');

export default createReducer(initialState, {
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },
  default: consumeEntities,
  [UnitActionTypes.FETCH_DROPDOWN]: consumeEntities,
});
