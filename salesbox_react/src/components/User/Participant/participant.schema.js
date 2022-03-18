// @flow
import { schema } from 'normalizr';
import { createExtractor } from 'lib';

export const extractParticipant = createExtractor(
  {
    firstName: 'FirstName',
    avatar: 'Avatar',
    discProfile: 'DiscProfile',
  },
  (entity, extracted, prefix) => {
    return {
      ...extracted,
      firstName,
      lastName,
    };
  }
);

export const participantSchema = new schema.Entity(
  'participant',
  {},
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {
      return {
        uuid: entity.uuid,
        firstName: entity.firstName,
        lastName: entity.lastName,
        avatar: entity.avatar,
        email: entity.email,
        phone: entity.phone,
        discProfile: entity.discProfile,
        sharedPercent: entity.sharedPercent,
      };
    },
  }
);

export const participantList = new schema.Object({
  participantList: [participantSchema],
});
