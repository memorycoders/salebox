// @flow
import { schema } from 'normalizr';

export const tagSchema = new schema.Entity(
  'tag',
  {},
  {
    idAttribute: 'uuid',
  }
);

export const tagList = new schema.Object({
  tagDTOList: new schema.Array(tagSchema),
});
