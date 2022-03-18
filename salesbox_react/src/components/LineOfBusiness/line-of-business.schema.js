// @flow
import { schema } from 'normalizr';

export const lineOfBusinessSchema = new schema.Entity(
  'lineOfBusiness',
  {},
  {
    idAttribute: 'uuid',
  }
);

const lineOfBusinessArray = new schema.Array(lineOfBusinessSchema);

export const lineOfBusinessList = new schema.Object({
  lineOfBusinessDTOList: lineOfBusinessArray,
});
