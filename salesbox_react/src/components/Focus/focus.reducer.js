// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import FocusActionTypes from 'components/Focus/focus.actions';
import AuthActionTypes from 'components/Auth/auth.actions';

export const initialState = {};

const consumeEntities = createConsumeEntities('focus');

export default createReducer(initialState, {
  default: consumeEntities,
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },
  [FocusActionTypes.FETCH_DROPDOWN]: (draft, action) => {
    Object.keys(draft).forEach((id) => {
      delete draft[id];
    });
    return consumeEntities(draft, action);
  },
});
