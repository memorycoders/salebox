// @flow
import { schema } from 'normalizr';
import { createExtractor } from 'lib';
import { organisationSchema, extractOrganisation } from '../Organisation/organisation.schema';
import { extractUser, userSchema } from '../User/user.schema';
import { industrySchema } from '../Industry/industry.schema';
import { typeSchema } from '../Type/type.schema';

export const extractContact = createExtractor({
  name: 'Name',
  phone: 'Phone',
  email: 'Email',
  firstName: 'FirstName',
  lastName: 'LastName',
});

export const contactSchema = new schema.Entity(
  'callListContact',
  {
    organisation: organisationSchema,
    owner: userSchema,
    industry: industrySchema,
    participants: [userSchema],
    relation: typeSchema,
    type: typeSchema,
  },
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {
      return {
        cityList: entity.cityList,
        contactList: entity.contactList,
        countryList: entity.countryList,
        createdDate: entity.createdDate,
        creator: entity.creator,
        deadlineDate: entity.deadlineDate,
        genius: entity.genius,
        industryList: entity.industryList,
        isDeleted: entity.isDeleted,
        isFinished: entity.isFinished,
        isGenius: entity.isGenius,
        name: entity.name,
        numberAccount: entity.numberAccount,
        numberCall: entity.numberCall,
        numberCalledAccount: entity.numberCalledAccount,
        numberCalledContact: entity.numberCalledContact,
        numberContact: entity.numberContact,
        numberDial: entity.numberDial,
        numberMeeting: entity.numberMeeting,
        numberProspect: entity.numberProspect,
        organisationList: entity.organisationList,
        ownerAvatar: entity.ownerAvatar,
        ownerDiscProfile: entity.ownerDiscProfile,
        ownerFirstName: entity.ownerFirstName,
        ownerId: entity.ownerId,
        ownerLastName: entity.ownerLastName,
        periodInMonth: entity.periodInMonth,
        sharedContactId: entity.sharedContactId,
        startCommunicationDate: entity.startCommunicationDate,
        titleList: entity.titleList,
        unitId: entity.unitId,
        unitList: entity.unitList,
        updatedDate: entity.updatedDate,
        userList: entity.userList,
        uuid: entity.uuid,
        version: entity.version,
      };
    },
  }
);

export const contactList = new schema.Object({
  callListDTOList: new schema.Array(contactSchema),
});
