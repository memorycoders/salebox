// @flow
import { createSelector } from 'reselect';
import { UIDefaults, ObjectTypes } from 'Constants';
import { getDropdown } from 'components/Dropdown/dropdown.selector';

const { isArray } = Array;

export const getCallListAccounts = createSelector(
  (state) => state.entities.callListAccount,
  (state, selected) => selected,
  (callListAccounts, selected) => {
    return Object.keys(callListAccounts)
      .filter((callListAccountId, index) => callListAccountId === selected || index < UIDefaults.DropdownMaxItems)
      .map((callListAccountId) => {
        const callListAccount = callListAccounts[callListAccountId];
        return {
          key: callListAccount.uuid,
          value: callListAccount.uuid,
          text: callListAccount.displayName,
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

export const getCallListAccountsForOrganisation = createSelector(
  (state) => state.entities.callListAccount,
  (state) => getDropdown(state, ObjectTypes.CallListAccount).searchTerm,
  (state, organisationId) => organisationId,
  (state, organisationId, selected) => selected,
  (callListAccounts, searchTerm, organisationId, selected) => {
    let choices = Object.keys(callListAccounts);
    if (searchTerm) {
      const regExp = new RegExp(searchTerm, 'i');
      choices = choices.filter((callListAccountId) => {
        if (callListAccountId === '__CREATE' || callListAccountId === '__EDIT') return false;
        const callListAccount = callListAccounts[callListAccountId];
        if (isArray(selected)) {
          return selected.indexOf(callListAccountId) > -1 || callListAccount.displayName.match(regExp);
        }
        return callListAccountId === selected || callListAccount.displayName.match(regExp);
      });
    }

    choices = choices
      .filter((callListAccountId, index) => {
        if (isArray(selected)) {
          return selected.indexOf(callListAccountId) > -1 || index < UIDefaults.DropdownMaxItems;
        }
        return callListAccountId === selected || index < UIDefaults.DropdownMaxItems;
      })
      .map((callListAccountId) => {
        const callListAccount = callListAccounts[callListAccountId];
        return {
          key: callListAccount.uuid,
          value: callListAccount.uuid,
          text: callListAccount.displayName,
        };
      });
    choices.sort(dropdownSort);
    return choices;
  }
);

const emptyCallListAccount = {
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
  contactGrowth: 'NONE',
  favorite: false,
};

const makeGetOrganisationForCallListAccount = () => {
  const emptyOrganisation = {};
  return createSelector(
    (state, callListAccountId) => {
      const callListAccount = state.entities.callListAccount[callListAccountId];
      if (callListAccount && callListAccount.organisation) {
        return state.entities.organisation[callListAccount.organisation];
      }
      return emptyOrganisation;
    },
    (organisation) => organisation
  );
};

const makeGetOwnerForCallListAccount = () => {
  const emptyCreator = {};
  return createSelector(
    (state, callListAccountId) => {
      const callListAccount = state.entities.callListAccount[callListAccountId];
      if (callListAccount && callListAccount.owner) {
        return state.entities.user[callListAccount.owner];
      }
      return emptyCreator;
    },
    (user) => user
  );
};

export const getCallListAccount = (state, callListAccountId) => state.entities.callListAccount[callListAccountId];
export const getSubCallListAccount = (state, callListAccountId) => {
  const callList = (state.entities.callListAccount.currentContact &&
    state.entities.callListAccount.currentContact[callListAccountId]) ||
    (state.entities.callListAccount[callListAccountId] && state.entities.callListAccount[callListAccountId].contactList || {});
  if (callList) {
    const keys = Object.keys(callList);
    return keys.map((key) => callList[key]);
  } else return [];
};

export const getSubCallListAccount1 = (state, callListAccountId) => {
  const callList = state.entities.callListAccount[callListAccountId].contactList || {};
  if (callList) {
    const keys = Object.keys(callList);
    return keys.map((key) => callList[key]);
  } else return [];
};

export const makeGetCallListAccount = () => {
  const getOrganisation = makeGetOrganisationForCallListAccount();
  const getOwner = makeGetOwnerForCallListAccount();
  return createSelector(getCallListAccount, getOrganisation, getOwner, (callListAccount, organisation, owner) => {
    if (!callListAccount) {
      return emptyCallListAccount;
    }
    return {
      ...emptyCallListAccount,
      ...callListAccount,
      organisation,
      owner,
    };
  });
};
export const makeGetSubCallListAccount = (state, callListAccountId) => {
  const getOrganisation = makeGetOrganisationForCallListAccount();
  const getOwner = makeGetOwnerForCallListAccount();
  return createSelector(getCallListAccount, getOrganisation, getOwner, (callListAccount, organisation, owner) => {
    if (!callListAccount) {
      return emptyCallListAccount;
    }
    return {
      ...emptyCallListAccount,
      ...callListAccount,
      callListAccountId,
      organisation,
      owner,
    };
  });
};

export default getCallListAccounts;
