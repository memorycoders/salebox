import React from 'react';
import { Grid } from 'semantic-ui-react';
import ProductGroups from './ProductGroups';
import ProductGroup from './ProductGroup';
import ProductTypes from './ProductTypes';
import Products from './Products';
import ProductExample from './ProductExample';

const Product = () => {
  return (
    <div style={{ padding: '0px', margin: '10px' }}>
      <Grid>
        <Grid.Row columns={3}>
          <Grid.Column>
            <ProductGroups />
          </Grid.Column>
          <Grid.Column>
            <ProductTypes />
          </Grid.Column>
          <Grid.Column>
            <Products />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column>
            <ProductGroup />
          </Grid.Column>
        </Grid.Row>
        {/* <Grid.Row>
          <Grid.Column floated="right" width={5}>
            <ProductExample />
          </Grid.Column>
        </Grid.Row> */}
      </Grid>
    </div>
  );
};

export default Product;
