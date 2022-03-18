// @flow
import { schema } from 'normalizr';
import { contactSchema, extractContact } from '../Contact/contact.schema';
import { organisationSchema, extractOrganisation } from '../Organisation/organisation.schema';
import { userSchema, extractUser } from '../User/user.schema';
import { typeSchema } from '../Type/type.schema';

export const leadSchema = new schema.Entity(
  'lead',
  {
    organisation: organisationSchema,
    creator: userSchema,
    participants: [userSchema],
    relation: typeSchema,
    type: typeSchema,
    contact: contactSchema,
  },
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {
 
      return {
        // ...entity,
        // uuid: entity.uuid,
        // status: entity.status,
        // note: entity.note,
        // source: entity.source,
        // createdDate: entity.createdDate,
        // deadlineDate: entity.deadlineDate,
        // distributionDate: entity.distributionDate,
        // priority: entity.priority,
        // productList: entity.productList,
        // creator: extractUser(entity, 'creator', 'creator'),
        // lineOfBusiness: entity.lineOfBusiness,
        // organisation: extractOrganisation(entity, 'organisationDTO', 'organisation'),
        // ownerId: entity.ownerId,
        // prospectId: entity.prospectId,
        // finished: entity.finished
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

export const leadList = new schema.Object({
  leadDTOList: new schema.Array(leadSchema),
});
