// @flow
import { schema } from 'normalizr';
import { createExtractor } from 'lib';

export const extractType = createExtractor({
  name: 'Name',
});

export const typeSchema = new schema.Entity(
  'type',
  {},
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {
      // eslint-disable-next-line no-unused-vars
      const { uuid, type, name, code, keyCode, ...other } = entity;
      return {
        uuid,
        name,
        code,
        keyCode,
        type,
      };
    },
  }
);

const typeArray = new schema.Array(typeSchema);

export const typeList = new schema.Object({
  workDataOrganisationDTOList: typeArray,
});
