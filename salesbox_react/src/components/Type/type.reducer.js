// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import AuthActionTypes from 'components/Auth/auth.actions';
import ActionTypes from './type.actions';

export const initialState = {};

const consumeEntities = createConsumeEntities('type');

export default createReducer(initialState, {
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },
  [ActionTypes.CONCAT_TYPE]: (draft, { data }) => {
    if (data) {
      const right = draft[data.uuid];
      if (!right) {
        draft[data.uuid] = {
          ...data,
        };
      }
    }
  },
  default: consumeEntities,
});
