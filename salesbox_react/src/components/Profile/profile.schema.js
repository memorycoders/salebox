// @flow
import { schema } from 'normalizr';

export const profileSchema = new schema.Entity(
  'profile',
  {
    // users: [userSchema],
  },
  {
    idAttribute: 'uuid',
  }
);
