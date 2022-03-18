// @flow
import { createSelector } from 'reselect';
import { addNone } from 'lib';

export const getMeasurementTypes = createSelector(
  (state) => state.entities.measurementType,
  (measurementTypes) => {
    let choices = Object.keys(measurementTypes);
    choices = choices.map((mtId) => {
      const mt = measurementTypes[mtId];
      return {
        key: mt.uuid,
        value: mt.uuid,
        text: mt.name,
      };
    });
    return addNone(choices);
  }
);

export default getMeasurementTypes;
