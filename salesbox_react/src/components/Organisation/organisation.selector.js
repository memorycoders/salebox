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
  (state) => state.entities.organisation,
  (state) => getDropdown(state, ObjectTypes.Account).searchTerm,
  (state, selected) => selected,
  (organisations, searchTerm, selected) => {

    let choices = Object.keys(organisations);
    if (searchTerm) {
      let regExp;
      try {
        regExp = new RegExp(searchTerm, 'i');
      } catch (error) {
        return false;
      }
      choices = choices.filter((organisationId) => {
        if (organisationId === '__CREATE' || organisationId === '__EDIT') return false;
        const organisation = organisations[organisationId];
        // return organisationId === selected || (organisation.displayName && organisation.displayName.match(regExp));
        return organisation.displayName && organisation.displayName.match(regExp);
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
  orderIntake: '',
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

const makeGetSizeForOrganisation = () => {
  return createSelector(
    (state, organisationId) => {
      const organisation = state.entities.organisation[organisationId];
      if (organisation && organisation.size) {
        return state.entities.size[organisation.size];
      }
      return empty;
    },
    (size) => size
  );
};

const makeGetIndustryForOrganisation = () => {
  return createSelector(
    (state, organisationId) => {
      const organisation = state.entities.organisation[organisationId];
      if (organisation && organisation.industry) {
        return state.entities.industry[organisation.industry];
      }
      return empty;
    },
    (industry) => industry
  );
};

const makeGetTypeForOrganisation = () => {
  return createSelector(
    (state, organisationId) => {
      const organisation = state.entities.organisation[organisationId];
      if (organisation && organisation.type) {
        return state.entities.type[organisation.type];
      }
      return empty;
    },
    (type) => type
  );
};

const makeGetOwnerForOrganisation = () => {
  const emptyCreator = {};
  return createSelector(
    (state, organisationId) => {
      const organisation = state.entities.organisation[organisationId];
      if (organisation && organisation.owner) {
        return state.entities.user[organisation.owner];
      }
      return emptyCreator;
    },
    (user) => user
  );
};



export const makeGetOrganisation = () => {
  const getOwner = makeGetOwnerForOrganisation();
  const getSize = makeGetSizeForOrganisation();
  const getIndustry = makeGetIndustryForOrganisation();
  const getType = makeGetTypeForOrganisation();
  return createSelector(
    (state, organisationId) => state.entities.organisation[organisationId],
    getOwner,
    getSize,
    getIndustry,
    getType,
    (organisation, owner, size, industry, type) => {
      if (!organisation) {
        return emptyOrganisation;
      }
      return {
        ...organisation,
        owner,
        size,
        industry,
        type,
      };
    }
  );
};

export const getDetailAccountToEdit = createSelector(
  (state) => state.entities.organisation.__DETAIL_TO_EDIT,
  (__DETAIL_TO_EDIT) => {
    return __DETAIL_TO_EDIT;
  }
);

export const getItemsAccountCount = createSelector(
  (state) => (state.overview.ACCOUNTS ? state.overview.ACCOUNTS.itemCount : 0),
  (total) => {
    return total;
  }
);

export const getOrganisation = createSelector(
  (state, id) => state.entities.organisation[id],
  (organisation) => {
    if (!organisation) {
      return {};
    }
    return organisation;
  }
);
