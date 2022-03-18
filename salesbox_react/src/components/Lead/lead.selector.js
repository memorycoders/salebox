// @flow
import { createSelector } from 'reselect';

const emptyLead = {
  contact: {},
  organisation: {},
  creator: {},
  lineOfBusiness: {},
};

export const getLeads = createSelector(
  (state) => state.entities.lead,
  (entities) => {
    return Object.keys(entities);
  }
);

const makeGetCreatorForLead = () => {
  const emptyCreator = {};
  return createSelector((state, leadId) => {
    const lead = state.entities.lead[leadId];
    if (lead && lead.creator) {
      return state.entities.user[lead.creator];
    }
    return emptyCreator;
  }, (user) => user);
};

const makeGetContactForLead = () => {
  const emptyContact = {};
  const emptyOrganisation = {};

  return createSelector(
    (state, leadId) => {
      const lead = state.entities.lead[leadId];
      if (lead && lead.contact) {
        return state.entities.contact[lead.contact];
      }
      return emptyContact;
    },
    (state, leadId) => {
      const lead = state.entities.lead[leadId];
      if (lead && lead.contact) {
        const contact = state.entities.contact[lead.contact];
        if (contact.organisation) {
          return state.entities.organisation[contact.organisation];
        }
      }
      return emptyOrganisation;
    },
    (contact, organisation) => ({
      ...contact,
      organisation,
    })
  );
};

const makeGetOrganisationForLead = () => {
  const emptyOrganisation = {};
  return createSelector((state, leadId) => {
    const lead = state.entities.lead[leadId];
    if (lead && lead.organisation) {
      return state.entities.organisation[lead.organisation];
    }
    return emptyOrganisation;
  }, (organisation) => organisation);
};

export const makeGetLead = () => {
  const getContact = makeGetContactForLead();
  const getCreator = makeGetCreatorForLead();
  const getOrganisation = makeGetOrganisationForLead();

  return createSelector(
    (state, leadId) => state.entities.lead[leadId],
    getContact,
    getCreator,
    getOrganisation,
    (lead, contact, creator, organisation) => {
      if (!lead) {
        return emptyLead;
      }
      return {
        ...lead,
        contact,
        organisation,
        creator,
      };
    }
  );
};
