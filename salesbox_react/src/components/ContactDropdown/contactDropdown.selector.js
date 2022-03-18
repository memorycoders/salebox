// @flow
import { createSelector } from 'reselect';
import { UIDefaults, ObjectTypes } from 'Constants';
import addNone from 'lib/addNone';
import { getDropdown } from 'components/Dropdown/dropdown.selector';
import contactImg from '../../../public/Contacts.svg';

const { isArray } = Array;

const imageUrl = (id) => {
  return `https://d3si3omi71glok.cloudfront.net/salesboxfiles/${id.slice(-3)}/${id}`;
};
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
  (state) => state.entities.contactDropdown,
  (state) => getDropdown(state, ObjectTypes.ContactDropdown).searchTerm,
  (state, organisationId) => organisationId,
  (state, organisationId, selected) => selected,
  (contacts, searchTerm, organisationId, selected) => {
    if (!contacts) return addNone([]);
    let choices = Object.keys(contacts);
    if (searchTerm) {
      // const regExp = new RegExp(searchTerm, 'i');
      choices = choices.filter((contactId) => {
        if (contactId === '__CREATE' || contactId === '__EDIT') return false;
        const contact = contacts[contactId];
        if (isArray(selected)) {
          return (
            selected.indexOf(contactId) > -1 || contact.displayName?.toLowerCase().includes(searchTerm?.toLowerCase())
          );
        }
        return contactId === selected || contact.displayName?.toLowerCase().includes(searchTerm?.toLowerCase());
      });
    }
    if (organisationId) {
      choices = choices
        .filter((contactId, index) => {
          if (contactId === '__CREATE' || contactId === '__EDIT') {
            return false;
          }
          if (isArray(selected)) {
            return selected.indexOf(contactId) > -1 || true;
          }
          // return contactId === selected || \index < UIDefaults.DropdownMaxItems;
          return contactId === selected || true;
        })
        .filter((contactId) => {
          const contact = contacts[contactId];
          if ((contact.organisationId && organisationId === contact.organisationId) || organisationId === contact.relationId ) {
            return contactId;
          }
        })
        .map((contactId) => {
          const contact = contacts[contactId];
          if (contact && !contact.displayName) console.log('CHECK THIS CONTACT: ', contact.uuid);
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
            return selected.indexOf(contactId) > -1 || true;
          }
          if (contactId === '__CREATE' || contactId === '__EDIT') {
            return false;
          }
          // return contactId === selected || index < UIDefaults.DropdownMaxItems;
          return contactId === selected || true;
        })
        .map((contactId) => {
          const contact = contacts[contactId];
          if (contact && !contact.displayName) console.log('CHECK THIS CONTACT: ', contact.uuid);
          return {
            key: contact.uuid,
            value: contact.uuid,
            text: contact.displayName,
          };
        });
    }

    // choices.sort(dropdownSort);
    return addNone(choices);
  }
);

export const getContactsForOrganisationWithEmail = createSelector(
  (state) => state.entities.contactDropdown,
  (state) => getDropdown(state, ObjectTypes.ContactDropdown).searchTerm,
  (state, organisationId) => organisationId,
  (state, organisationId, selected) => selected,
  (contacts, searchTerm, organisationId, selected) => {
    if (!contacts) return addNone([]);
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
            return selected.indexOf(contactId) > -1 || true;
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
            text: contact.email ? `${contact.displayName} (${contact.email})` : contact.displayName,
          };
        });
    } else {
      choices = choices
        .filter((contactId, index) => {
          if (isArray(selected)) {
            return selected.indexOf(contactId) > -1 || true;
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
            text: contact.email ? `${contact.displayName} (${contact.email})` : contact.displayName,
            // image: {avatar: true, src: contact.avatar ? imageUrl(contact.avatar) : contactImg}
          };
        });
    }

    // choices.sort(dropdownSort);
    return addNone(choices);
  }
);
export default getContacts;
