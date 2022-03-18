// @flow
import { schema } from 'normalizr';

export const multiRelationSchema = new schema.Entity(
  'multiRelation',
  {},
  {
    idAttribute: 'uuid',
  }
);

const multiRelationArray = new schema.Array(multiRelationSchema);

export const multiRelationList = new schema.Object({
  multiRelationDetailDTOList: multiRelationArray,
});
