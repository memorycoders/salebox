// @flow
import { createSelector } from 'reselect';
import addNone from 'lib/addNone';

export const getCategories = createSelector(
  (state) => state.entities.category,
  (categories) => {
    const choices = Object.keys(categories).map((catId) => {
      const category = categories[catId];
      return {
        key: category.uuid,
        value: category.uuid,
        text: category.name,
      };
    });

    return addNone(choices);
  }
);

export default getCategories;
