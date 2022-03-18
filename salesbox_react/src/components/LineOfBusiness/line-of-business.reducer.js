// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import OverviewActionTypes from 'components/Overview/overview.actions';
import { OverviewTypes } from 'Constants';

import AuthActionTypes from '../Auth/auth.actions';

export const initialState = {};

const consumeEntities = createConsumeEntities('lineOfBusiness');

export default createReducer(initialState, {
  [OverviewActionTypes.CREATE_ENTITY]: (draft, { overviewType, defaults }) => {
    if (overviewType === OverviewTypes.LineOfBusiness) {
      draft.__CREATE = {
        ...defaults,
      };
    }
  },
  // [AuthActionTypes.LOGOUT]: (draft) => {
  //   Object.keys(draft).forEach((id) => delete draft[id]);
  // },
  default: consumeEntities,
});
