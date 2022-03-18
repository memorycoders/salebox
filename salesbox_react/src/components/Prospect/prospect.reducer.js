// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import OverviewActionTypes from 'components/Overview/overview.actions';
import { OverviewTypes } from 'Constants';

import AuthActionTypes from 'components/Auth/auth.actions';
import { ActionTypes } from './prospect.action';

export const initialState = {
  __APPOINTMENT_PROSPECT: {

  }
};

const consumeEntities = createConsumeEntities('prospect');

export default createReducer(initialState, {
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },
  [OverviewActionTypes.CREATE_ENTITY]: (draft, { overviewType, defaults }) => {
    if (overviewType === OverviewTypes.Prospect) {
      draft.__CREATE = {
        ...defaults,
      };
    }
  },
  [ActionTypes.LIST_BY_CONTACTS_DATA]: (draft, { prospects }) => {
    draft.prospectsByContacts=prospects;
  },
  [ActionTypes.PROSPECT_CONCAT_ITEM]: (draft, { data }) => {
    const right = draft[data.uuid];
    if (!right) {
      draft[data.uuid] = {
        ...data,
        description: `${data.description}`,
        contacts: data.sponsorList && data.sponsorList.length > 0 ? data.sponsorList[0].uuid : null,
      };
    }
    else if(right.description==null){
      draft[data.uuid] = {
        ...right,
        description: `${data.description}`,
      };
    }
  },
  default: consumeEntities,
});
