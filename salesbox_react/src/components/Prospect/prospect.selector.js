// @flow
import { createSelector } from 'reselect';
import { UIDefaults, ObjectTypes } from 'Constants';
import { getDropdown } from 'components/Dropdown/dropdown.selector';
import { addNone } from 'lib';

const dropdownSort = (a, b) => {
  const aFirst = (a.text || '').toLowerCase();
  const bFirst = (b.text || '').toLowerCase();
  if (aFirst < bFirst) return -1;
  if (aFirst > bFirst) return 1;
  return 0;
};

const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = arr1.length; i--; ) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
};

export const getProspectsForContact = createSelector(
  (state) => state.entities.prospect,
  (state) => getDropdown(state, ObjectTypes.Prospect).searchTerm,
  (state, contactId) => contactId,
  (state, contactId, selected) => selected,
  (prospects, searchTerm, contactId, selected) => {
    let choices = Object.keys(prospects);
    if (searchTerm) {
      const regExp = new RegExp(searchTerm, 'i');
      choices = choices.filter((prospectId) => {
        if (prospectId === '__CREATE' || prospectId === '__EDIT') return false;
        const prospect = prospects[prospectId];
        return prospectId === selected || prospect.description.match(regExp);
      });
    }
    choices = choices
      .filter((prospectId, index) => {
        const prospect = prospects[prospectId];
        if (contactId && prospect.contacts && !arraysEqual(prospect.contacts, contactId)) return false;
        return prospectId === selected || index < UIDefaults.DropdownMaxItems;
      })
      .map((prospectId) => {
        const prospect = prospects[prospectId];
        return {
          key: prospect.uuid,
          value: prospect.uuid,
          text: prospect.description,
        };
      });
    choices.sort(dropdownSort);
    return addNone(choices);
  }
);

export const getProspectsByContact = createSelector(
  (state) => state.entities.prospect,
  (state) => getDropdown(state, ObjectTypes.Prospect).searchTerm,
  (state, contactId) => contactId,
  (state, contactId, selected) => selected,
  (prospects, searchTerm, contactId, selected) => {
    let choices = Object.keys(prospects);
    if (searchTerm) {
      const regExp = new RegExp(searchTerm, 'i');
      choices = choices.filter((prospectId) => {
        if (prospectId === '__CREATE' || prospectId === '__EDIT') return false;
        const prospect = prospects[prospectId];
        return prospectId === selected || prospect.description.match(regExp);
      });
    }
    // let numRes={filterNum:0};

    choices = choices
      .filter((prospectId, index) => {
        const prospect = prospects[prospectId];
        if (contactId && prospect.contacts && !arraysEqual(prospect.contacts, contactId)) return false;
        // return prospectId === selected || index < UIDefaults.DropdownMaxItems;
        // numRes.filterNum++;
        // return prospectId === selected || numRes.filterNum < UIDefaults.DropdownMaxItems;
        return prospectId === selected || true;
        // return true;
      })
      .filter((prospectId) => {
        const prospect = prospects[prospectId];
        if (contactId && prospect.contacts && JSON.stringify(contactId) == JSON.stringify(prospect.contacts)) {
          return prospect;
        }
      })
      .map((prospectId) => {
        const prospect = prospects[prospectId];
        return {
          key: prospect.uuid,
          value: prospect.uuid,
          text: prospect.description,
        };
      });
    choices.sort(dropdownSort);
    return addNone(choices);
  }
);

export const getProspectsByContactTask = createSelector(
  (state) => state.entities.prospect.prospectsByContacts,
  (prospects) => {
    if (prospects != null && prospects.prospect != null) {
      let choices = Object.keys(prospects.prospect);
      let result = choices.map((key) => prospects.prospect[key]);
      return result;
    }
    return [];
  }
);
export default getProspectsForContact;
