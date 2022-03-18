// @flow
import { schema } from 'normalizr';

export const salesMethodSchema = new schema.Entity(
  'salesMethod',
  {},
  {
    idAttribute: 'uuid',
  }
);

const salesMethodArray = new schema.Array(salesMethodSchema);

export const salesMethodList = new schema.Object({
  salesMethodDTOList: salesMethodArray,
});
