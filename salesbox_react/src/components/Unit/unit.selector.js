// @flow
import { createSelector } from 'reselect';

export const getUnitsForDropdown = createSelector(
  (state) => state.entities.unit,
  (units) => {
    let _data = []
    for(const unitId in units) {
      const unit = units[unitId];
      const { avatar, uuid, name, type} = unit;
      const image = avatar && {
        avatar: true,
        src: `https://d3si3omi71glok.cloudfront.net/salesboxfiles/${avatar.slice(-3)}/${avatar}`,
      };
      let _unit = {
        type: type,
        key: uuid,
        value: uuid,
        text: name,
        image: image || undefined,
      };
      _data.push(_unit);
    }
    return _data;
  }
);

const emptyUnit = {};

export const makeGetUnit = () =>
  createSelector(
    (state, unitId) => state.entities.unit[unitId],
    (unit) => {
      if (!unit) {
        return emptyUnit;
      }
      return unit;
    }
  );

export const getUnits = createSelector((state) => state.entities.unit, (entities) => Object.keys(entities));
export const getUnitsDTO = createSelector((state) => state.entities.unit, (entities) => entities);
export const isFetchingUnits = createSelector((state) => state.ui.unit.fetching.list,(fetching)=>fetching);

export default getUnits;
