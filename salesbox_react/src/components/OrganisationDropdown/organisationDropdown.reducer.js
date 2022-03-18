// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import OverviewActionTypes from 'components/Overview/overview.actions';
import OrganisationActionTypes from '../Organisation/organisation.actions';
import { OverviewTypes } from 'Constants';
import AuthActionTypes from 'components/Auth/auth.actions';

export const initialState = {};

const consumeEntities = createConsumeEntities('organisationDropdown');

export default createReducer(initialState, {
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },

  [OverviewActionTypes.CREATE_ENTITY]: (draft, { overviewType, defaults }) => {
    if (overviewType === OverviewTypes.ProductGroup) {
      draft.__CREATE = {
        ...defaults,
      };
    }
  },
  [OrganisationActionTypes.ORGANISATION_ITEM]: (draft, { data }) => {
    if (data) {
      const right = draft[data.uuid];
      if (!right) {
        draft[data.uuid] = {
          ...data,
          displayName: `${data.name}`,
        };
      }
    }
  },
  default: consumeEntities,
});
