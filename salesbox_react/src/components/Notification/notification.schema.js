// @flow
import { schema } from 'normalizr';

const oddBoldRegExp = /(#!!.*?)#!!/gm;
const everyRegExp = /#!!/gm;
const sanitize = (content: string): string => {
  return content.replace(oddBoldRegExp, '$1</b>').replace(everyRegExp, '<b>');
};

export const notificationSchema = new schema.Entity(
  'notification',
  {
    // users: [userSchema],
  },
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {
      // eslint-disable-next-line no-unused-vars
      return {
        ...entity,
        content: sanitize(entity.content),
      };
    },
  }
);

const notificationArray = new schema.Array(notificationSchema);

export const notificationList = new schema.Object({
  notificationDTOList: notificationArray,
});
