// @flow
import { createSelector } from 'reselect';
import { UIDefaults, ObjectTypes } from 'Constants';
import { getDropdown } from 'components/Dropdown/dropdown.selector';

const { isArray } = Array;
const entityName = 'unqualifiedDeal';

export const getUnqualifiedDeals = createSelector(
  (state) => state.entities.unqualifiedDeal,
  (state, selected) => selected,
  (unqualifiedDeals, selected) => {
    return Object.keys(unqualifiedDeals)
      .filter((unqualifiedDealId, index) => unqualifiedDealId === selected || index < UIDefaults.DropdownMaxItems)
      .map((unqualifiedDealId) => {
        const unqualifiedDeal = unqualifiedDeals[unqualifiedDealId];
        return {
          key: unqualifiedDeal.uuid,
          value: unqualifiedDeal.uuid,
          text: unqualifiedDeal.displayName,
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

export const getUnqualifiedDealsForOrganisation = createSelector(
  (state) => state.entities.unqualifiedDeal,
  (state) => getDropdown(state, ObjectTypes.PipelineLead).searchTerm,
  (state, organisationId) => organisationId,
  (state, organisationId, selected) => selected,
  (unqualifiedDeals, searchTerm, organisationId, selected) => {
    let choices = Object.keys(unqualifiedDeals);
    if (searchTerm) {
      const regExp = new RegExp(searchTerm, 'i');
      choices = choices.filter((unqualifiedDealId) => {
        if (unqualifiedDealId === '__CREATE' || unqualifiedDealId === '__EDIT') return false;
        const unqualifiedDeal = unqualifiedDeals[unqualifiedDealId];
        if (isArray(selected)) {
          return selected.indexOf(unqualifiedDealId) > -1 || unqualifiedDeal.displayName.match(regExp);
        }
        return unqualifiedDealId === selected || unqualifiedDeal.displayName.match(regExp);
      });
    }

    choices = choices
      .filter((unqualifiedDealId, index) => {
        if (isArray(selected)) {
          return selected.indexOf(unqualifiedDealId) > -1 || index < UIDefaults.DropdownMaxItems;
        }
        return unqualifiedDealId === selected || index < UIDefaults.DropdownMaxItems;
      })
      .map((unqualifiedDealId) => {
        const unqualifiedDeal = unqualifiedDeals[unqualifiedDealId];
        return {
          key: unqualifiedDeal.uuid,
          value: unqualifiedDeal.uuid,
          text: unqualifiedDeal.displayName,
        };
      });
    choices.sort(dropdownSort);
    return choices;
  }
);

const emptyunqualifiedDeal = {
  accepted: null,
  campaignId: null,
  contactEmail: null,
  contactFirstName: '',
  contactId: '',
  contactLastName: '',
  contactPhone: null,
  countOfActiveAppointment: null,
  countOfActiveTask: null,
  createdDate: 0,
  creatorAvatar: '',
  creatorDiscProfile: '',
  creatorFirstName: '',
  creatorId: '',
  creatorLastName: '',
  deadlineDate: null,
  deleted: false,
  distributionDate: null,
  facebookId: null,
  finished: false,
  finishedDate: null,
  gmt: null,
  lastSyncTime: 0,
  leadBoxerId: null,
  lineOfBusiness: { uuid: null, name: null, salesMethodDTO: null, numberOfProducts: null, numberActiveProducts: null },
  linkedInId: null,
  mailChimpId: null,
  mailChimpTotalClick: null,
  mailChimpTotalOpen: null,
  note: null,
  organisationEmail: null,
  organisationId: '',
  organisationName: '',
  organisationPhone: null,
  ownerAvatar: '',
  ownerDiscProfile: '',
  ownerFirstName: '',
  ownerId: '',
  ownerLastName: '',
  ownerMedianLeadTime: null,
  priority: 0,
  productList: [],
  prospectId: null,
  sharedContactId: '',
  source: '',
  status: null,
  tempCompanyName: null,
  tempEmail: null,
  tempFirstName: null,
  tempLastName: null,
  type: '',
  updatedDate: null,
  uuid: '',
  visitMore: false,
};

const makeGetOrganisationForUnqualifiedDeal = () => {
  const emptyOrganisation = {};
  return createSelector((state, unqualifiedDealId) => {
    const unqualifiedDeal = state.entities.unqualifiedDeal[unqualifiedDealId];
    
    if (unqualifiedDeal && unqualifiedDeal.organisationId) {
      return state.entities.organisation[unqualifiedDeal.organisationId];
    }
    return emptyOrganisation;
  }, (organisation) => organisation);
};

const makeGetOwnerForUnqualifiedDeal = () => {
  const emptyCreator = {};
  return createSelector((state, unqualifiedDealId) => {
    const unqualifiedDeal = state.entities.unqualifiedDeal[unqualifiedDealId];
    if (unqualifiedDeal && unqualifiedDeal.owner) {
      return state.entities.user[unqualifiedDeal.owner];
    }
    return emptyCreator;
  }, (user) => user);
};

export const getUnqualifiedDeal = (state, unqualifiedDealId) => {

  return state.entities.unqualifiedDeal[unqualifiedDealId];
}

const makeGetContactForUnqualified = () => {
  const emptyContact = {};

  return createSelector(
    (state, unqualifiedDealId) => {
      
      const unqualifiedDeal = state.entities.unqualifiedDeal[unqualifiedDealId];
      if (unqualifiedDeal && unqualifiedDeal.contactId) {
        return state.entities.contact[unqualifiedDeal.contactId];
      }
      return emptyContact;
    },
    (contact) => contact
  );
};

export const makeGetUnqualifiedDeal = () => {
  const getOrganisation = makeGetOrganisationForUnqualifiedDeal();
  const getOwner = makeGetOwnerForUnqualifiedDeal();
  const getContact = makeGetContactForUnqualified();
  return createSelector(
    getUnqualifiedDeal, 
    getOrganisation, 
    getOwner, 
    getContact,
    (unqualifiedDeal, organisation, owner, contact) => {
    
    if (!unqualifiedDeal) {
      return emptyunqualifiedDeal;
    }
    return {
      ...emptyunqualifiedDeal,
      ...unqualifiedDeal,
      organisation,
      owner,
      contact
    };
  });
};

export const getEntityErros = createSelector(
  (state) => state.entities.unqualifiedDeal.__ERRORS,
  (errors) => {
    return errors;
  }
);

export const getCreateUnqualifiedDeal = createSelector(
  (state) => state.entities.unqualifiedDeal.__CREATE,
  (task) => {
    return task;
  }
);

export const getUpdateUnqualifiedDeal = createSelector(
  (state) => state.entities.unqualifiedDeal.__EDIT,
  (task) => {
    return task;
  }
);

export const getUnqualified = createSelector(
  (state, id) => state.entities.unqualifiedDeal[id],
  (unqualifiedDeal) => {
    return unqualifiedDeal;
  }
);
export default getUnqualifiedDeals;
