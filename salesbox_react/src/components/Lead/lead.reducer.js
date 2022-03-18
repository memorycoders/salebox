// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import AuthActionTypes from 'components/Auth/auth.actions';
import ActionTypes from './lead.actions';

export const initialState = {
  __DETAIL: {},
  isFetching: false,
};

const consumeEntities = createConsumeEntities('lead');

export default createReducer(initialState, {
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },
  [ActionTypes.FETCH_LEAD_DETAIL_SUCCESS]: (draft, { unqualifiedDealId, data }) => {
    if (!draft) {
      draft = initialState;
    }
    draft[unqualifiedDealId] = data;
  },
  [ActionTypes.START_FETCH_DETAIL]: (draft) => {
    draft.__DETAIL = {};
    draft.isFetching = true;
  },
  [ActionTypes.FETCH_SUCCESS]: (draft, { unqualifiedDealId, unqualified }) => {
    draft.__DETAIL = {
      ...unqualified,
    };
  },
  default: consumeEntities,
});
