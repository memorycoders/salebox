// @flow
import { schema } from 'normalizr';
import { createExtractor } from 'lib';
import { participantSchema } from '../User/Participant/participant.schema';
import { extractUser, userSchema } from '../User/user.schema';
import { typeSchema, extractType } from '../Type/type.schema';
import { sizeSchema } from '../Size/size.schema';

export const extractOrganisation = createExtractor({
  name: 'Name',
  phone: 'Phone',
  email: 'Email',
  avatar: 'Avatar'
});

export const organisationDropdownSchema = new schema.Entity(
  'organisationDropdown',
  {
    owner: userSchema,
    participants: [participantSchema],
    size: sizeSchema,
    type: typeSchema
    // contacts: [contactSchema],
  },
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {
 
      const { uuid, type, name, city, fullAddress, avatar, ...other } = entity;

      return {
        ...entity,
        uuid: entity.uuid,
        additionalPhoneList: entity.additionalPhoneList || [],
        additionalEmailList: entity.additionalEmailList || [],
        displayName: entity.displayName || entity.name || `${entity.firstName} ${entity.lastName}`,
        name: entity.name,
        formalName: entity.formalName,
        vatNumber: entity.vatNumber,
        discProfile: entity.discProfile,
        city: entity.city,
        relationship: entity.relationship,
        region: entity.region,
        country: entity.country,
        budget: entity.budget || 0,
        fullAddress: entity.fullAddress,
        title: entity.title,
        avatar: entity.avatar,
        type: entity.type,
        favorite: entity.favorite,
        email: entity.email,
        phone: entity.phone,
        zipCode: entity.zipCode,
        street: entity.street,
        industry: entity.industry,
        relation: entity.relation,
        orderIntake: entity.orderIntake || 0,
        wonProfit: entity.wonProfit || 0,
        grossPipeline: entity.grossPipeline || 0,
        netPipeline: entity.netPipeline || 0,
        pipeMargin: entity.pipeMargin || 0,
        pipeProfit: entity.pipeProfit || 0,
        recentActionType: entity.recentActionType,
        lastViewed: entity.lastViewed,

        numberActiveLead: entity.numberActiveLead || 0,
        numberAccountTeam: entity.numberContactTeam || 0,
        numberActiveProspect: entity.numberActiveProspect || 0,
        numberActiveMeeting: entity.numberActiveMeeting || 0,
        numberActiveTask: entity.numberActiveTask || 0,
        numberCall: entity.numberCall || 0,
        numberClosedProspect: entity.numberClosedProspect || 0,
        numberContact: entity.numberContact || 0,
        numberDocument: entity.numberDocument || 0,
        numberFinishedLead: entity.numberFinishedLead || 0,
        numberFinishedMeeting: entity.numberFinishedMeeting || 0,
        numberFinishedMeetingCurrentWeek: entity.numberFinishedMeeting || 0,
        numberGoalsMeeting: entity.numberGoalsMeeting || 0,
        numberNote: entity.numberNote || 0,
        numberPhoto: entity.numberPhoto || 0,
        numberPick: entity.numberPick || 0,

        medianDealSize: entity.medianDealSize || 0,
        medianDealTime: entity.medianDealTime || 0,
        closedMargin: entity.closedMargin || 0,
        accountGrowth: entity.accountGrowth || 'NONE',

        owner: extractUser(entity, 'owner', 'owner'),
        latestCommunication: entity.latestCommunicationHistoryDTOList,
        customFields: entity.customFields,
        web: entity.web,
        size: entity.size,
        multiRelations: entity.multiRelations,
        participantList: entity.participantList || [],
        type: extractType(entity, 'type', 'type'),
        contacts: entity.contacts,
        tasks: entity.tasks,
      };
    },
  }
);

const organisationArray = new schema.Array(organisationDropdownSchema);

export const organisationDropdownList = new schema.Object({
  organisationDTOList: organisationArray,
});
