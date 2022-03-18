// @flow
import { schema } from 'normalizr';

export const productGroupSchema = new schema.Entity(
  'productGroup',
  {},
  {
    idAttribute: 'uuid',
  }
);

const productGroupArray = new schema.Array(productGroupSchema);

export const productGroupList = new schema.Object({
  lineOfBusinessDTOList: productGroupArray,
});
