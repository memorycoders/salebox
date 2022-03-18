// @flow
import { createSelector } from 'reselect';
import { addNone } from 'lib';

export const getProductGroup = createSelector(
  (state) => state.entities.productGroup,
  (productGroup) => {
    let choices = Object.keys(productGroup);
    choices = choices.map((productId) => {
      const product = productGroup[productId];
      return {
        key: product.uuid,
        value: product.uuid,
        text: product.name,
      };
    });
    return addNone(choices);
  }
);
export default getProductGroup;
