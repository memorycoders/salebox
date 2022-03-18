// @flow
import { createSelector } from 'reselect';
import { addNone } from 'lib';

export const getProducts = createSelector(
  (state) => state.entities.product,
  (products) => {
    let choices = Object.keys(products);
    choices = choices.map((productId) => {
      const product = products[productId];
      return {
        key: product.uuid,
        value: product.uuid,
        text: product.name,
        resourceId: product.resourceId
      };
    });
    return addNone(choices);
  }
);

export const getProduct = createSelector(
  (state) => state.entities.product,
  (state, productId) => productId,
  (products, productId) => {
    if (productId) {
      return products[productId];
    }
    return null;
  }
);

export const getProductsForLOB = createSelector(
  (state) => state.entities.product,
  (state, lineOfBusinessId) => lineOfBusinessId,
  (products, lineOfBusinessId) => {
    let choices = Object.keys(products);
    choices = choices
    // .filter(productId => productId && products?.[productId]?.active)
      .map((productId) => {
        const product = products[productId];
        return {
          active: product.active,
          lineOfBusinessId: product.lineOfBusinessId,
          key: product.uuid,
          value: product.uuid,
          text: product.name,
          resourceId: product.resourceId
        };
      })
      .filter((product) => product.lineOfBusinessId === lineOfBusinessId);
    return choices;
  }
);

export default getProducts;
