// @flow
import { schema } from 'normalizr';

export const measurementTypeSchema = new schema.Entity(
  'measurementType',
  {},
  {
    idAttribute: 'uuid',
  }
);

const measurementTypeArray = new schema.Array(measurementTypeSchema);

export const measurementTypeList = new schema.Object({
  measurementTypeDTOList: measurementTypeArray,
});
