// @flow
/* eslint-disable no-param-reassign */
import createReducer, { createConsumeEntities } from 'store/createReducer';
import AuthActionTypes from 'components/Auth/auth.actions';
import ActionTypes from './multi-relation.actions';

export const initialState = {
  __RELATION_TYPE: {}
};

const consumeEntities = createConsumeEntities('multiRelation');

export default createReducer(initialState, {
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },
  //FETCH_RELATION_TYPE_SUCCESS
  [ActionTypes.FETCH_RELATION_TYPE_SUCCESS]: (draft, { objectType, data }) => {
    draft.__RELATION_TYPE = draft.__RELATION_TYPE || {};

    draft.__RELATION_TYPE[objectType] = data;
  },
  [ActionTypes.DELETE_RELATION_SUCCESS]: (draft, { uuid }) => {
    delete draft[uuid]
  },
  default: consumeEntities,
});
