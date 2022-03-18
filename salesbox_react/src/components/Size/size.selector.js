// @flow
import { createSelector } from 'reselect';
import addNone from '../../lib/addNone';

export const getSizes = createSelector(
  (state) => state.entities.size,
  (sizes) => {
    let _data = Object.keys(sizes).map((sizeId) => {
      const size = sizes[sizeId];
      return {
        type: size.type,
        key: size.uuid,
        value: size.uuid,
        text: size.name,
        size: size.name.split('-')[0]
      };
    });
    _data.sort((value1, value2) => value1.size - value2.size);
    return _data;
  }
);

export const getSizesForAccount = createSelector(
  (state) => state.entities.size,
  (sizes) => {
    let _data = Object.keys(sizes).map((sizeId) => {
      const size = sizes[sizeId];
      return {
        type: size.type,
        key: size.uuid,
        value: size.uuid,
        text: size.name,
        size: size.name.split('-')[0]
      };
    });
    _data.sort((value1, value2) => value1.size - value2.size);
    return addNone(_data);
  }
);

export default getSizes;
