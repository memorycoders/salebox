// @flow
import { schema } from 'normalizr';
import { userSchema } from '../User/user.schema';

export default new schema.Entity(
  'auth',
  {
    userDTO: userSchema,
  },
  {
    idAttribute: (value) => (value && value.userDTO && value.userDTO.uuid) || null,
  }
);
