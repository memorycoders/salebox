// @flow
import { schema } from 'normalizr';

export const categorySchema = new schema.Entity(
  'category',
  {},
  {
    idAttribute: 'uuid',
  }
);

export const categoryList = new schema.Object({
  workDataActivityDTOList: new schema.Array(categorySchema),
});
