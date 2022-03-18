// @flow
import { createSelector } from 'reselect';
import { UIDefaults, ObjectTypes } from 'Constants';
import addNone from 'lib/addNone';
import { getDropdown } from 'components/Dropdown/dropdown.selector';

const { isArray } = Array;

export const getContacts = createSelector(
  (state) => state.entities.contact,
  (state, selected) => selected,
  (contacts, selected) => {
    return Object.keys(contacts)
      .filter((contactId, index) => contactId === selected || index < UIDefaults.DropdownMaxItems)
      .map((contactId) => {
        const contact = contacts[contactId];
        return {
          key: contact.uuid,
          value: contact.uuid,
          text: contact.displayName,
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

export const getContactsForOrganisation = createSelector(
  (state) => state.entities.contact,
  (state) => getDropdown(state, ObjectTypes.Contact).searchTerm,
  (state, organisationId) => organisationId,
  (state, organisationId, selected) => selected,
  (contacts, searchTerm, organisationId, selected) => {
    let choices = Object.keys(contacts);
    if (searchTerm) {
      const regExp = new RegExp(searchTerm, 'i');
      choices = choices.filter((contactId) => {
        if (contactId === '__CREATE' || contactId === '__EDIT') return false;
        const contact = contacts[contactId];
        if (isArray(selected)) {
          return selected.indexOf(contactId) > -1 || contact.displayName.match(regExp);
        }
        return contactId === selected || contact.displayName.match(regExp);
      });
    }
    if (organisationId) {
      choices = choices
        .filter((contactId, index) => {
          if (contactId === '__CREATE' || contactId === '__EDIT') {
            return false;
          }
          if (isArray(selected)) {
            return selected.indexOf(contactId) > -1 || index < UIDefaults.DropdownMaxItems;
          }
          // return contactId === selected || index < UIDefaults.DropdownMaxItems;
          return contactId === selected || true;
        })
        .filter((contactId) => {
          const contact = contacts[contactId];
          if (contact.organisationId && organisationId === contact.organisationId) {
            return contactId;
          }
        })
        .map((contactId) => {
          const contact = contacts[contactId];
          return {
            key: contact.uuid,
            value: contact.uuid,
            text: contact.displayName,
          };
        });
    } else {

      choices = choices
        .filter((contactId, index) => {
          if (isArray(selected)) {
            return selected.indexOf(contactId) > -1 || index < UIDefaults.DropdownMaxItems;
          }
          if (contactId === '__CREATE' || contactId === '__EDIT') {
            return false;
          }
          // return contactId === selected || index < UIDefaults.DropdownMaxItems;
          return contactId === selected || true;
        })
        .map((contactId) => {
          const contact = contacts[contactId];
          return {
            key: contact.uuid,
            value: contact.uuid,
            text: contact.displayName,
          };
        });
    }

    choices.sort(dropdownSort);
    return addNone(choices);
  }
);

const emptyContact = {
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
  orderIntake: '',
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

const makeGetOrganisationForContact = () => {
  const emptyOrganisation = {};
  return createSelector(
    (state, contactId) => {
      const contact = state.entities.contact[contactId];
      if (contact && contact.organisation) {
        return state.entities.organisation[contact.organisation];
      }
      return emptyOrganisation;
    },
    (organisation) => organisation
  );
};

const makeGetOwnerForContact = () => {
  const emptyCreator = {};
  return createSelector(
    (state, contactId) => {
      const contact = state.entities.contact[contactId];
      if (contact && contact.owner) {
        return state.entities.user[contact.owner];
      }
      return emptyCreator;
    },
    (user) => user
  );
};

export const getContact = (state, contactId) => state.entities.contact[contactId];

export const makeGetContact = () => {
  const getOrganisation = makeGetOrganisationForContact();
  const getOwner = makeGetOwnerForContact();
  return createSelector(getContact, getOrganisation, getOwner, (contact, organisation, owner) => {
    if (!contact) {
      return emptyContact;
    }
    return {
      ...emptyContact,
      ...contact,
      organisation,
      owner,
    };
  });
};

export const getItemsContactCount = createSelector(
  (state) => (state.overview.CONTACTS ? state.overview.CONTACTS.itemCount : 0),
  (total) => {
    return total;
  }
);

export default getContacts;
