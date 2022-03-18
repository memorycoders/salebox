// @flow
import { createSelector } from 'reselect';
import { addNone } from 'lib';

export const getLineOfBusinesses = createSelector(
  (state) => state.entities.lineOfBusiness,
  (lineOfBusinesses) => {
    let choices = Object.keys(lineOfBusinesses);
    choices = choices.map((lobId) => {
      const lob = lineOfBusinesses[lobId];
      return {
        key: lob.uuid,
        value: lob.uuid,
        text: lob.name,
      };
    });
    return addNone(choices);
  }
);

export default getLineOfBusinesses;
