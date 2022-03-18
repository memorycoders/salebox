// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import ActionTypes from './user.actions';
import AuthActionTypes from 'components/Auth/auth.actions';

export const initialState = {};

const consumeEntities = createConsumeEntities('user');

export default createReducer(initialState, {
  [ActionTypes.SET_FIELD]: (draft, action) => {
    const { userId, field, value } = action;
    draft[userId][field] = value;
  },
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },
  default: consumeEntities,
});
