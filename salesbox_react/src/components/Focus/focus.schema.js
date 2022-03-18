// @flow
import { schema } from 'normalizr';

export const focusSchema = new schema.Entity(
  'focus',
  {},
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {
      // eslint-disable-next-line no-unused-vars
      const { uuid, type, name, description, discProfile, ...other } = entity;
      return {
        uuid,
        type,
        name,
        description,
        discProfile,
      };
    },
  }
);

export const focusActivitySchema = new schema.Entity(
  'focusActivity',
  {},
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {
      // eslint-disable-next-line no-unused-vars
      const { uuid, type, name, description, discProfile, ...other } = entity;
      return {
        uuid,
        type,
        name,
        description,
        discProfile,
      };
    },
  }
);

const focusArray = new schema.Array(focusSchema);
const focusActivityArray = new schema.Array(focusActivitySchema);

export const focusList = new schema.Object({
  workDataActivityDTOList: focusArray,
});

export const focusActivityList = new schema.Object({
  activityDTOList: focusActivityArray,
});
