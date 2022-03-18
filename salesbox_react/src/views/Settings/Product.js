import React, { memo } from 'react';
import ProductComponent from 'components/Settings/Product';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import * as SetingsActions from 'components/Settings/settings.actions';
import { withGetData } from 'lib/hocHelpers';

const Product = () => {
  return <ProductComponent />;
};

export default compose(
  memo,
  connect(null, {
    requestFetchProductsSettings: SetingsActions.requestFetchProductsSettings,
  }),
  withGetData(({ requestFetchProductsSettings }) => () => requestFetchProductsSettings())
)(Product);
