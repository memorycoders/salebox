// @flow
import { schema } from 'normalizr';
import { createExtractor } from 'lib';
import { organisationSchema, extractOrganisation } from '../Organisation/organisation.schema';
import { userSchema } from '../User/user.schema';
import { typeSchema } from '../Type/type.schema';
import { contactSchema, extractContact } from '../Contact/contact.schema';


export const unqualifiedDealSchema = new schema.Entity(
  'unqualifiedDeal',
  {
    organisation: organisationSchema,
    owner: userSchema,
    participants: [userSchema],
    relation: typeSchema,
    type: typeSchema,
    contact: contactSchema
  },
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {
      
      return {
        accepted: entity.accepted,
        campaignId: entity.campaignId,
        contactEmail: entity.contactEmail,
        contactFirstName: entity.contactFirstName,
        contactId: entity.contactId,
        contactLastName: entity.contactLastName,
        contactPhone: entity.contactPhone,
        countOfActiveAppointment: entity.countOfActiveAppointment,
        countOfActiveTask: entity.countOfActiveTask,
        createdDate: entity.createdDate,
        creatorAvatar: entity.creatorAvatar,
        creatorDiscProfile: entity.creatorDiscProfile,
        creatorFirstName: entity.creatorFirstName,
        creatorId: entity.creatorId,
        creatorLastName: entity.creatorLastName,
        deadlineDate: entity.deadlineDate,
        deleted: entity.deleted,
        distributionDate: entity.distributionDate,
        facebookId: entity.facebookId,
        finished: entity.finished,
        finishedDate: entity.finishedDate,
        // contact: entity.contactDTO,
        contact: extractContact(entity, 'contactDTO', 'contact'),
        organisation: extractOrganisation(entity, 'organisationDTO', 'organisation'),
        organisationDTO: entity.organisationDTO,
        gmt: entity.gmt,
        lastSyncTime: entity.lastSyncTime,
        leadBoxerId: entity.leadBoxerId,
        lineOfBusiness: entity.lineOfBusiness,
        linkedInId: entity.linkedInId,
        mailChimpId: entity.mailChimpId,
        mailChimpTotalClick: entity.mailChimpTotalClick,
        mailChimpTotalOpen: entity.mailChimpTotalOpen,
        note: entity.note,
        organisationEmail: entity.organisationEmail,
        organisationId: entity.organisationId,
        organisationName: entity.organisationName,
        organisationPhone: entity.organisationPhone,
        ownerAvatar: entity.ownerAvatar,
        ownerDiscProfile: entity.ownerDiscProfile,
        ownerFirstName: entity.ownerFirstName,
        ownerId: entity.ownerId,
        ownerLastName: entity.ownerLastName,
        ownerMedianLeadTime: entity.ownerMedianLeadTime,
        priority: entity.priority,
        productList: entity.productList,
        prospectId: entity.prospectId,
        sharedContactId: entity.sharedContactId,
        source: entity.source,
        status: entity.status,
        tempCompanyName: entity.tempCompanyName,
        tempEmail: entity.tempEmail,
        tempFirstName: entity.tempFirstName,
        tempLastName: entity.tempLastName,
        type: entity.type,
        updatedDate: entity.updatedDate,
        uuid: entity.uuid,
        visitMore: entity.visitMore,
      };
    },
  }
);

export const unqualifiedDeal = new schema.Object({
  leadDTOList: new schema.Array(unqualifiedDealSchema),
});
