// @flow
import { schema } from 'normalizr';

export const sizeSchema = new schema.Entity(
  'size',
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

const sizeArray = new schema.Array(sizeSchema);

export const sizeList = new schema.Object({
  sizeTypeList: sizeArray,
});
