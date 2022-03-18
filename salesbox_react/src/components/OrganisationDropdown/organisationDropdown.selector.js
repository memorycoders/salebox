// @flow
import { createSelector } from 'reselect';
import { UIDefaults, ObjectTypes } from 'Constants';
import addNone from 'lib/addNone';
import { getDropdown } from 'components/Dropdown/dropdown.selector';

const dropdownSort = (a, b) => {
  const aFirst = (a.text || '').toLowerCase();
  const bFirst = (b.text || '').toLowerCase();
  if (aFirst < bFirst) return -1;
  if (aFirst > bFirst) return 1;
  return 0;
};

export const getOrganisationForDropdown = createSelector(
  (state) => state.entities.organisationDropdown,
  (state) => getDropdown(state, ObjectTypes.OrganisationDropdown).searchTerm,
  (state, selected) => selected,
  (organisations, searchTerm, selected) => {
    if (!organisations) return addNone([]);
    let choices = Object.keys(organisations);
    if (searchTerm) {
      let regExp;
      try {
        // regExp = new RegExp(searchTerm, 'i');
      } catch (error) {
        return false;
      }
      choices = choices.filter((organisationId) => {
        if (organisationId === '__CREATE' || organisationId === '__EDIT') return false;
        const organisation = organisations[organisationId];
        // return organisationId === selected || (organisation.displayName && organisation.displayName.match(regExp));
        return organisation.displayName && organisation.displayName?.toLowerCase().includes(searchTerm?.toLowerCase());
      });
    }
    choices = choices
      .filter((organisationId, index) => {
        if (
          organisationId === '__CREATE' ||
          organisationId === '__EDIT' ||
          organisationId === '__EDIT_APPOINTMENT_TARGET' ||
          organisationId === '__EDIT_SALE_TARGET'
        )
          return false;
        // return organisationId === selected || index < UIDefaults.DropdownMaxItems;
        return true;
      })
      .map((organisationId) => {
        const organisation = organisations[organisationId];
        if(organisation && !organisation.displayName) console.log('CHECK THIS ACCOUNT:', organisation.uuid);
        return {
          key: organisation.uuid,
          value: organisation.uuid,
          text: organisation.displayName,
        };
      });

    choices.sort(dropdownSort);
    return addNone(choices);
  }
);

export const emptyOrganisation = {
  firstName: '',
  lastName: '',
  formalName: '',
  vatNumber: '',
  displayName: '',
  zipCode: '',
  street: '',
  region: '',
  country: null,
  industry: null,
  owner: null,
  orderIntake: 0,
  wonProfit: 0,
  grossPipeline: 0,
  netPipeline: 0,
  numberAccountTeam: 0,
  numberActiveProspect: 0,
  numberActiveMeeting: 0,
  numberActiveTask: 0,
  pipeMargin: 0,
  pipeProfit: 0,
  type: {},
  additionalPhoneList: [],
  additionalEmailList: [],
  customFields: [],
  multiRelations: [],
  participants: [],
  latestCommunication: [],
  numberCall: 0,
  numberPick: 0,
  medianDealSize: 0,
  medianDealTime: 0,
  closedMargin: 0,
  accountGrowth: 'NONE',
  size: null,
  web: null,
};

const empty = {};
