// @flow
import { schema } from 'normalizr';
export const recruitmentSchema = new schema.Entity(
  'recruitment',
  {},
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {
      return { ...entity };
    },
  }
);
export const recruitment = new schema.Object({
  candidateDTOList: new schema.Array(recruitmentSchema),
});
