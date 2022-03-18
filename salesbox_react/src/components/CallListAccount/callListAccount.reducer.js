// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import CustomFieldActionTypes from 'components/CustomField/custom-field.actions';
import MultiRelationActionTypes from 'components/MultiRelation/multi-relation.actions';
import OverviewActionTypes from 'components/Overview/overview.actions';
import { OverviewTypes, ObjectTypes } from 'Constants';
import AuthActionTypes from 'components/Auth/auth.actions';
import AccountActionTypes from './callListAccount.actions';

export const initialState = {
  __CREATE: {},
  __EDIT: {},
  currentContact: {},
};

const consumeEntities = createConsumeEntities('callListAccount');

export default createReducer(initialState, {
  default: consumeEntities,
  [AuthActionTypes.LOGIN]: (draft, { result }) => {
    draft.__CREATE = {
      ownerId: result,
    };
  },
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },
  [OverviewActionTypes.EDIT_ENTITY]: (draft, { overviewType, itemId }) => {
    if (overviewType === OverviewTypes.CallList.Account) {
      draft.__EDIT = {
        ...draft[itemId],
      };
    }
  },

  [AccountActionTypes.FETCH_ORGANISATION_DROPDOWN]: (draft, { organisationId, entities }) => {
    const contacts = entities.contact;
    if (contacts) {
      Object.keys(contacts).forEach((contactId) => {
        contacts[contactId]._organisationId = organisationId;
      });
      consumeEntities(draft, { entities: { contact: contacts } });
    }
  },
  [CustomFieldActionTypes.FETCH_SUCCESS]: (draft, { entities, objectId, objectType }) => {
    if (objectType === ObjectTypes.Contact && entities && entities.customField) {
      draft[objectId] = draft[objectId] || {};
      draft[objectId].customFields = Object.keys(entities.customField);
    }
  },
  [AccountActionTypes.FETCH_COLLEAGUE_SUCCESS]: (draft, { contactId, entities }) => {
    draft[contactId] = draft[contactId] || {};
    draft[contactId].colleagues = Object.keys(entities.contact).filter((colleagueId) => colleagueId !== contactId);
  },
  [MultiRelationActionTypes.FETCH_SUCCESS]: (draft, { entities, objectId, objectType }) => {
    if (objectType === ObjectTypes.Contact && entities && entities.multiRelation) {
      draft[objectId] = draft[objectId] || {};
      draft[objectId].multiRelations = Object.keys(entities.multiRelation);
    }
  },
  [AccountActionTypes.FETCH_ACCOUNT_ON_CALL_LIST_SUCCESS]: (draft, props) => {
    const { callListAccountId, entities, pageIndex } = props;
    // draft.currentContact = {
    //   [callListAccountId]: entities.beans,
    // };
    if (pageIndex !== 0) {
      draft[callListAccountId].contactList = {
        ...draft[callListAccountId].contactList,
        ...entities.beans,
      };
      draft.currentContact = {
        [callListAccountId]: {
          ...(draft.currentContact[callListAccountId] || {}),
          ...entities.beans,
        }
      }
    } else {
      draft.currentContact = {
        [callListAccountId]: entities.beans,
      };
      draft[callListAccountId].contactList = entities.beans;
    }
  },
  [AccountActionTypes.FETCH_CALL_LIST_ACCOUNT_BY_HISTORY_SUCCESS]: (draft, { entities }) => {
    const callListAccount = entities.callListAccount;
    if (callListAccount) {
      consumeEntities(draft, { entities: { callListAccount: callListAccount } });
    }
  },
  [AccountActionTypes.UPDATE]: (draft, { callListAccountId, updateData }) => {
    draft[callListAccountId] = draft[callListAccountId] || {};
    Object.keys(updateData).forEach((key) => {
      draft[callListAccountId][key] = updateData[key];
    });
  },
  [OverviewActionTypes.SET_ACTION_FOR_HIGHLIGHT]: (draft, { overviewType, highlightAction }) => {
    if (overviewType === OverviewTypes.CallList.List && highlightAction === 'create') {
      draft['__CREATE'] = {
        ...draft['__CREATE'],
        name: '',
        unitId: '',
        deadlineDate: '',
      };
    }
  },
  [AccountActionTypes.DELETE_ROW_SUCCESS_CONTACT_ON_SUB_LIST]: (
    draft,
    { callListAccountId, contactId, organisationId }
  ) => {
    draft[callListAccountId] = draft[callListAccountId] || {};
    if (draft[callListAccountId].contactList != null && organisationId != null) {
      const keys = Object.keys(draft[callListAccountId].contactList);
      let keyDeleted = null;
      keys.forEach((key) => {
        if (draft[callListAccountId].contactList[key].organisationId == organisationId) {
          keyDeleted = key;
          delete draft[callListAccountId].contactList[key];
          return;
        }
      });

      let currentListAccount = Object.keys(draft.currentContact[callListAccountId]);
      currentListAccount.forEach((e) => {
        if (draft.currentContact[callListAccountId][e].organisationId == organisationId) {
          delete draft.currentContact[callListAccountId][e];
          return;
        }
      });
      draft[callListAccountId].numberAccount = draft[callListAccountId].numberAccount - 1;
    }
  },
  [AccountActionTypes.ADD_ACCOUNT_TO_CALLLIST]: (draft, { callListId, numberAdded }) => {
    draft[callListId].numberAccount = draft[callListId].numberAccount + numberAdded;
  },
  [AccountActionTypes.REMOVE_ACCOUNT_FROM_CALLLIST_ACCOUNT_SUCCESS]: (draft, { accountId, callListAccountId }) => {
    let keys = Object.keys(draft[callListAccountId].contactList);
    keys.map((e) => {
      if (draft[callListAccountId].contactList[e].organisationId === accountId) {
        delete draft[callListAccountId].contactList[e];
        return;
      }
    });
    let currentListAccount = Object.keys(draft.currentContact[callListAccountId]);
    currentListAccount.forEach((e) => {
      if (draft.currentContact[callListAccountId][e].organisationId == accountId) {
        delete draft.currentContact[callListAccountId][e];
        return;
      }
    });
    draft[callListAccountId].numberAccount = draft[callListAccountId].numberAccount - 1;
  },
  [AccountActionTypes.UPDATE_CALLLIST_ACCOUNT_BY_ID]: (draft, { callList }) => {
    if (callList && draft[callList.uuid]) {
      Object.keys(callList).forEach((key) => {
        draft[callList.uuid][key] = callList[key];
      });
    }
  },
  // [AccountActionTypes.SET_ACCOUNT]: (draft, { overviewType, itemId }) => {
  //   const overview = ensureOverview(draft, overviewType);
  //   const index = overview.items.indexOf(itemId);
  //   // overview.isFetching = true;
  //   if (index !== -1) {
  //     overview.items = [...overview.items.slice(0, index), ...overview.items.slice(index + 1)];
  //     overview.itemCount = overview.items.length;
  //   }
  // },
  [AccountActionTypes.CLEAR_CREATE_ENTITY]: (draft, { ownerId }) => {
    draft.__CREATE = {
      ...initialState.__CREATE,
      ownerId: ownerId,
      name: '',
      unitId: '',
      deadlineDate: '',
    };
  },
  [AccountActionTypes.STORE_NEW_VALUE]: (draft, { callListAccount }) => {
    draft.newValue = {
      ...callListAccount
    };
  },
  [AccountActionTypes.CLEAR_STORE_NEW_VALUE]: (draft, { }) => {
    draft.newValue = null;
  },
});
