// @flow
import { createSelector } from 'reselect';
import { UIDefaults, ObjectTypes } from 'Constants';
import { getDropdown } from 'components/Dropdown/dropdown.selector';

const { isArray } = Array;

export const getCallListContacts = createSelector(
  (state) => state.entities.callListContact,
  (state, selected) => selected,
  (callListContacts, selected) => {
    return Object.keys(callListContacts)
      .filter((callListContactId, index) => callListContactId === selected || index < UIDefaults.DropdownMaxItems)
      .map((callListContactId) => {
        const callListContact = callListContacts[callListContactId];
        return {
          key: callListContact.uuid,
          value: callListContact.uuid,
          text: callListContact.displayName,
        };
      });
  }
);

const dropdownSort = (a, b) => {
  const aFirst = (a.text || '').toLowerCase();
  const bFirst = (b.text || '').toLowerCase();
  if (aFirst < bFirst) return -1;
  if (aFirst > bFirst) return 1;
  return 0;
};

export const getCallListContactsForOrganisation = createSelector(
  (state) => state.entities.callListContact,
  (state) => getDropdown(state, ObjectTypes.CallListContact).searchTerm,
  (state, organisationId) => organisationId,
  (state, organisationId, selected) => selected,
  (callListContacts, searchTerm, organisationId, selected) => {
    let choices = Object.keys(callListContacts);
    if (searchTerm) {
      const regExp = new RegExp(searchTerm, 'i');
      choices = choices.filter((callListContactId) => {
        if (callListContactId === '__CREATE' || callListContactId === '__EDIT') return false;
        const callListContact = callListContacts[callListContactId];
        if (isArray(selected)) {
          return selected.indexOf(callListContactId) > -1 || callListContact.displayName.match(regExp);
        }
        return callListContactId === selected || callListContact.displayName.match(regExp);
      });
    }

    choices = choices
      .filter((callListContactId, index) => {
        if (isArray(selected)) {
          return selected.indexOf(callListContactId) > -1 || index < UIDefaults.DropdownMaxItems;
        }
        return callListContactId === selected || index < UIDefaults.DropdownMaxItems;
      })
      .map((callListContactId) => {
        const callListContact = callListContacts[callListContactId];
        return {
          key: callListContact.uuid,
          value: callListContact.uuid,
          text: callListContact.displayName,
        };
      });
    choices.sort(dropdownSort);
    return choices;
  }
);

const emptyCallListContact = {
  firstName: '',
  lastName: '',
  displayName: '',
  zipCode: '',
  street: '',
  region: '',
  country: null,
  industry: null,
  organisation: {},
  owner: null,
  orderIntake: 0,
  wonProfit: 0,
  grossPipeline: 0,
  netPipeline: 0,
  numberContactTeam: 0,
  numberActiveProspect: 0,
  numberProspect: 0,
  numberActiveMeeting: 0,
  numberActiveTask: 0,
  pipeMargin: 0,
  pipeProfit: 0,
  additionalPhoneList: [],
  additionalEmailList: [],
  customFields: [],
  multiRelations: [],
  participants: [],
  colleagues: [],
  latestCommunication: [],
  numberCall: 0,
  numberPick: 0,
  medianDealSize: 0,
  medianDealTime: 0,
  closedMargin: 0,
  numberClosedProspect: 0,
  numberColleague: 0,
  numberNote: 0,
  numberPhoto: 0,
  numberDocument: 0,
  callListContactGrowth: 'NONE',
  favorite: false,
};

const makeGetOrganisationForContact = () => {
  const emptyOrganisation = {};
  return createSelector((state, callListContactId) => {
    const callListContact = state.entities.callListContact[callListContactId];
    if (callListContact && callListContact.organisation) {
      return state.entities.organisation[callListContact.organisation];
    }
    return emptyOrganisation;
  }, (organisation) => organisation);
};

const makeGetOwnerForContact = () => {
  const emptyCreator = {};
  return createSelector((state, callListContactId) => {
    const callListContact = state.entities.callListContact[callListContactId];
    if (callListContact && callListContact.owner) {
      return state.entities.user[callListContact.owner];
    }
    return emptyCreator;
  }, (user) => user);
};

export const getCallListContact = (state, callListContactId) => state.entities.callListContact[callListContactId];

export const getSubCallListContact = (state, callListContactId) => {
  const callList = (state.entities.callListContact.currentContact && state.entities.callListContact.currentContact[callListContactId]) || (state.entities.callListContact[callListContactId] && state.entities.callListContact[callListContactId].contactList) ||{};
  const keys = Object.keys(callList);
  return keys.map(key => callList[key])
}

export const getSubCallListContact1 = (state, callListContactId) => {
  const callList = state.entities.callListContact.currentContact[callListContactId] || state.entities.callListContact[callListContactId].contactList || {};
  const keys = Object.keys(callList);
  return keys.map(key => callList[key])
}


export const makeGetCallListContact = () => {
  const getOrganisation = makeGetOrganisationForContact();
  const getOwner = makeGetOwnerForContact();
  return createSelector(getCallListContact, getOrganisation, getOwner, (callListContact, organisation, owner) => {
    if (!callListContact) {
      return emptyCallListContact;
    }
    return {
      ...emptyCallListContact,
      ...callListContact,
      organisation,
      owner,
    };
  });
};

export default getCallListContacts;
