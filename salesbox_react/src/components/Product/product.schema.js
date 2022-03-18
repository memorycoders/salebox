// @flow
import { schema } from 'normalizr';

export const productSchema = new schema.Entity(
  'product',
  {},
  {
    idAttribute: 'uuid',
  }
);

const productArray = new schema.Array(productSchema);

export const productList = new schema.Object({
  productDTOList: productArray,
});
