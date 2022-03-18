// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import AuthActionTypes from 'components/Auth/auth.actions';

export const initialState = {};

const consumeEntities = createConsumeEntities('size');

export default createReducer(initialState, {
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },
  default: consumeEntities,
});
