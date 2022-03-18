// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import CustomFieldActionTypes from 'components/CustomField/custom-field.actions';
import MultiRelationActionTypes from 'components/MultiRelation/multi-relation.actions';
import OverviewActionTypes from '../Overview/overview.actions';
import { OverviewTypes, ObjectTypes, FORM_KEY } from 'Constants';
import AuthActionTypes from 'components/Auth/auth.actions';
import ContactActionTypes from './callListContact.actions';

export const initialState = {
  __CREATE: {},
  __EDIT: {},
  currentContact: {},
};

const consumeEntities = createConsumeEntities('callListContact');

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
    if (overviewType === OverviewTypes.CallList.Contact) {
      draft.__EDIT = {
        ...draft[itemId],
      };
    }
  },
  [CustomFieldActionTypes.FETCH_SUCCESS]: (draft, { entities, objectId, objectType }) => {
    if (objectType === ObjectTypes.Contact && entities && entities.customField) {
      draft[objectId] = draft[objectId] || {};
      draft[objectId].customFields = Object.keys(entities.customField);
    }
  },
  [MultiRelationActionTypes.FETCH_SUCCESS]: (draft, { entities, objectId, objectType }) => {
    if (objectType === ObjectTypes.Contact && entities && entities.multiRelation) {
      draft[objectId] = draft[objectId] || {};
      draft[objectId].multiRelations = Object.keys(entities.multiRelation);
    }
  },
  [ContactActionTypes.GET_CONTACT_ON_CALL_LIST_SUCCESS]: (draft, props) => {
    const { callListContactId, entities, pageIndex } = props;

    if (pageIndex === 0) {
      draft[callListContactId].contactList = entities.beans;
      draft.currentContact = {
        [callListContactId]: entities.beans,
      };
    } else {
      draft.currentContact = {
        [callListContactId]: {
          ...(draft.currentContact[callListContactId] || {}),
          ...entities.beans,
        },
      };
      draft[callListContactId].contactList = {
        ...draft[callListContactId].contactList,
        ...entities.beans,
      };
    }
  },
  [ContactActionTypes.FETCH_ORGANISATION_DROPDOWN]: (draft, { organisationId, entities }) => {
    const contacts = entities.contact;
    if (contacts) {
      Object.keys(contacts).forEach((contactId) => {
        contacts[contactId]._organisationId = organisationId;
      });
      consumeEntities(draft, { entities: { contact: contacts } });
    }
  },
  [ContactActionTypes.FETCH_COLLEAGUE_SUCCESS]: (draft, { contactId, entities, pageIndex }) => {
    draft[contactId] = draft[contactId] || {};
    if (pageIndex === 0 || pageIndex == null) {
      draft[contactId].colleagues = Object.keys(entities.contact).filter((colleagueId) => colleagueId !== contactId);
    } else if (entities.contact != null) {
      draft[contactId].colleagues = draft[contactId].colleagues.contact(
        Object.keys(entities.contact).filter((colleagueId) => colleagueId !== contactId)
      );
    }
  },
  [ContactActionTypes.UPDATE]: (draft, { callListContactId, updateData }) => {
    draft[callListContactId] = draft[callListContactId] || {};
    Object.keys(updateData).forEach((key) => {
      draft[callListContactId][key] = updateData[key];
    });
  },
  [OverviewActionTypes.SET_ACTION_FOR_HIGHLIGHT]: (draft, { overviewType, highlightAction }) => {
    if (overviewType === OverviewTypes.CallList.List && highlightAction === 'create') {
      draft['__CREATE'] = {
        ...draft['__CREATE'],
        name: '',
        unit: '',
        deadline: '',
      };
    }
  },
  [ContactActionTypes.DELETE_ROW_SUCCESS_CONTACT_ON_SUB_LIST]: (draft, { callListContactId, contactId }) => {
    draft[callListContactId] = draft[callListContactId] || {};
    if (draft[callListContactId].contactList != null && contactId != null) {
      const keys = Object.keys(draft[callListContactId].contactList);
      let keyDeleted = null;
      keys.forEach((key) => {
        if (draft[callListContactId].contactList[key].contactId == contactId) {
          keyDeleted = key;
          delete draft[callListContactId].contactList[key];
          return;
        }
      });
      let currentListContact = Object.keys(draft.currentContact[callListContactId]);
      currentListContact.forEach((e) => {
        if (draft.currentContact[callListContactId][e].contactId == contactId) {
          delete draft.currentContact[callListContactId][e];
          return;
        }
      });
      draft[callListContactId].numberContact = draft[callListContactId].numberContact - 1;
    }
  },
  [ContactActionTypes.ADD_CONTACT_TO_CALLLIST]: (draft, { callListId, contacts }) => {
    draft[callListId] = draft[callListId] || {};
    draft[callListId].numberContact = draft[callListId].numberContact + contacts.length;
    contacts.map((e) => {
      draft[callListId].contactList[e.contactId] = { contactId: e.contactId };
    });
  },
  [ContactActionTypes.UPDATE_CALLLIST_CONTACT_BY_ID]: (draft, { callList }) => {
    if (callList && draft[callList.uuid]) {
      Object.keys(callList).forEach((key) => {
        draft[callList.uuid][key] = callList[key];
      });
    }
  },
  [ContactActionTypes.REMOVE_CONTACT_FROM_CALLLIST_CONTACT_SUCCESS]: (draft, { contactId, callListContactId }) => {
    let keys = Object.keys(draft[callListContactId].contactList);
    keys.map((e) => {
      if (draft[callListContactId].contactList[e].contactId === contactId) {
        delete draft[callListContactId].contactList[e];
        return;
      }
    });
    let currentListContact = Object.keys(draft.currentContact[callListContactId]);
    currentListContact.forEach((e) => {
      if (draft.currentContact[callListContactId][e].contactId == contactId) {
        delete draft.currentContact[callListContactId][e];
        return;
      }
    });
    draft[callListContactId].numberContact = draft[callListContactId].numberContact - 1;
  },
  [ContactActionTypes.CLEAR_CREATE_ENTITY]: (draft, { ownerId }) => {
    draft.__CREATE = { ...initialState.__CREATE, ownerId: ownerId, name: '', unitId: '', deadlineDate: '' };
  },
  [ContactActionTypes.STORE_NEW_VALUE]: (draft, { callListAccount }) => {
    draft.newValue = { ...callListAccount };
  },
  [ContactActionTypes.CLEAR_STORE_NEW_VALUE]: (draft, { }) => {
    draft.newValue = null;
  },
});
