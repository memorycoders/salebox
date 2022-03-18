// @flow
import { schema } from 'normalizr';
export const qualifiedDealSchema = new schema.Entity(
  'qualifiedDeal',
  {},
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {
      return { ...entity };
    },
  }
);
export const qualifiedDeal = new schema.Object({
  prospectDTOList: new schema.Array(qualifiedDealSchema),
});
