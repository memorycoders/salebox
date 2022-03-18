// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import OverviewActionTypes from 'components/Overview/overview.actions';
import ContactActionTypes from '../Contact/contact.actions';
import { OverviewTypes } from 'Constants';
import AuthActionTypes from 'components/Auth/auth.actions';

export const initialState = {};

const consumeEntities = createConsumeEntities('contactDropdown');

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
  [ContactActionTypes.CONTACT_ITEM]: (draft, { data }) => {
    data.map((item) => {
      const right = draft[item.uuid];
      if (!right) {
        draft[item.uuid] = {
          ...item,
          displayName: `${item.firstName} ${item.lastName}`,
        };
      }
    });
  },
  default: consumeEntities,
});
