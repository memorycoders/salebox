// @flow
import { schema } from 'normalizr';

export const unitSchema = new schema.Entity(
  'unit',
  {
    // users: [userSchema],
  },
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {
      // eslint-disable-next-line no-unused-vars
      const { uuid, type, name, description, avatar, userDTOList: users, ...other } = entity;
      return {
        uuid,
        type,
        name,
        description,
        avatar,
        users,
      };
    },
  }
);

const unitArray = new schema.Array(unitSchema);

export const unitList = new schema.Object({
  unitDTOList: unitArray,
});
