// @flow
import { schema } from 'normalizr';

export const customFieldSchema = new schema.Entity(
  'customField',
  {
    // users: [userSchema],
  },
  {
    idAttribute: 'uuid',
  }
);

const customFieldArray = new schema.Array(customFieldSchema);

export const customFieldList = new schema.Object({
  customFieldDTOList: customFieldArray,
});
