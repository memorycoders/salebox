// @flow
import { schema } from 'normalizr';
import { createExtractor } from 'lib';
import { extractOrganisation, organisationSchema } from '../Organisation/organisation.schema';
import { extractUser, userSchema } from '../User/user.schema';
import { industrySchema, extractIndustry } from '../Industry/industry.schema';
import { extractType, typeSchema } from '../Type/type.schema';

export const extractContact = createExtractor({
  name: 'Name',
  phone: 'Phone',
  email: 'Email',
  firstName: 'FirstName',
  lastName: 'LastName'
});

export const contactSchema = new schema.Entity(
  'contact',
  {
    organisation: organisationSchema,
    owner: userSchema,
    participants: [userSchema],
  },
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {
      const { uuid, type, name, city, fullAddress, avatar, ...other } = entity;
      return {
        ...entity,
        fullAddress: fullAddress,
        uuid: entity.uuid,
        additionalPhoneList: entity.additionalPhoneList || [],
        additionalEmailList: entity.additionalEmailList || [],
        firstName: entity.firstName,
        lastName: entity.lastName,
        displayName: entity.displayName || entity.name || `${entity.firstName} ${entity.lastName}`,
        discProfile: entity.discProfile,
        city: entity.city,
        relationship: entity.relationship,
        recentActionType: entity.recentActionType,
        lastViewed: entity.lastViewed,
        region: entity.region,
        favorite: entity.favorite,
        country: entity.country,
        title: entity.title,
        avatar: entity.avatar,
        // typeName: extractType(entity, 'name', 'type'),
        type: entity.type,
        zipCode: entity.zipCode,
        street: entity.street,
        industry: extractIndustry(entity, 'industry', 'industry'),
        email: entity.email,
        phone: entity.phone,
        relation: entity.relation,
        orderIntake: entity.orderIntake !== undefined && entity.orderIntake !== null ? (entity.orderIntake === 0 ? 0 : entity.orderIntake) : '',
        wonProfit: entity.wonProfit || 0,
        grossPipeline: entity.grossPipeline || 0,
        netPipeline: entity.netPipeline || 0,
        pipeMargin: entity.pipeMargin || 0,
        pipeProfit: entity.pipeProfit || 0,
        closedMargin: entity.closedMargin || 0,
        numberActiveLead: entity.numberActiveLead || 0,
        numberContactTeam: entity.participantList && entity.participantList.length ? entity.participantList.length : entity.numberContactTeam || 0,
        numberActiveProspect: entity.numberActiveProspect || 0,
        numberProspect: entity.numberProspect || 0,
        numberActiveMeeting: entity.numberActiveMeeting || 0,
        numberActiveTask: entity.numberActiveTask || 0,
        numberCall: entity.numberCall || 0,
        numberPick: entity.numberPick || 0,
        medianDealSize: entity.medianDealSize || 0,
        medianDealTime: entity.medianDealTime || 0,
        numberClosedProspect: entity.numberClosedProspect || 0,
        numberColleague: entity.numberColleague || 0,
        numberNote: entity.numberNote || 0,
        numberPhoto: entity.numberPhoto || 0,
        numberDocument: entity.numberDocument || 0,

        contactGrowth: entity.contactGrowth || 'NONE',
        owner: extractUser(entity, 'owner', 'owner'),
        organisation: extractOrganisation(entity, 'organisationDTO', 'organisation'),
        latestCommunication: entity.latestCommunicationHistoryDTOList,
        communicationHistoryLatest: entity.communicationHistoryLatest,
        customFields: entity.customFields,
        multiRelations: entity.multiRelations,
        participants: entity.participantList && entity.participantList.length ? entity.participantList : undefined,

        tasks: entity.tasks,
        colleagues: entity.colleagues,
      };
    },
  }
);

export const contactList = new schema.Object({
  contactDTOList: new schema.Array(contactSchema),
});
