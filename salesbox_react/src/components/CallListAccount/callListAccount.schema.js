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

export const callListAccountSchema = new schema.Entity(
  'callListAccount',
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
        deadlineDate: entity.deadlineDate,
        creator: entity.creator,
        entity: entity.entity,
        genius: entity.genius,
        industryList: entity.industryList,
        isDeleted: entity.isDeleted,
        isFinished: entity.isFinished,
        isGenius: entity.isGenius,
        name: entity.name,
        numberAccount: entity.numberAccount || 0,
        numberCall: entity.numberCall || 0,
        numberCalledAccount: entity.numberCalledAccount || 0,
        numberCalledContact: entity.numberCalledContact || 0,
        numberContact: entity.numberContact || 0,
        numberDial: entity.numberDial || 0,
        numberMeeting: entity.numberMeeting || 0,
        numberProspect: entity.numberProspect || 0,
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

export const callListAccount = new schema.Object({
  callListDTOList: new schema.Array(callListAccountSchema),
});
