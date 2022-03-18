// @flow
import { createSelector } from 'reselect';
import { addNone } from 'lib';

export const getTypes = createSelector(
  (state) => state.entities.type,
  (state, filterType) => filterType,
  (types, filterType) => {
    const choices = Object.keys(types)
      .map((typeId) => {
        const type = types[typeId];
        return {
          type: type.type,
          key: type.uuid,
          value: type.uuid,
          text: type.name,
        };
      })
      .filter((type) => type.type === filterType);
      choices.sort((value1, value2) => value1.text.localeCompare(value2.text) );
    return addNone(choices);
  }
);

export default getTypes;
