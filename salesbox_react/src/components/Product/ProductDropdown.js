//@flow
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as DropdownActions from 'components/Dropdown/dropdown.actions';
import { getProductsForLOB } from 'components/Product/product.selector';
import { compose, lifecycle, mapProps } from 'recompose';
import { ObjectTypes } from 'Constants';
import { connect } from 'react-redux';
import { getDropdown } from 'components/Dropdown/dropdown.selector';
import _l from 'lib/i18n';

addTranslations({
  'en-US': {
    Product: 'Product',
  },
});

const objectType = ObjectTypes.Product;

const ProductDropdown = ({
  products,
  isFetching,
  value,
  colId,
  _class,
  calculatingPositionMenuDropdown,
  isMultiple = true,
  isAddDealResource,
  profileDetail,
  handleProductChange,
  lineOfBusinessId,
  ...other
}: any) => {
  useEffect(() => {
    if (!!lineOfBusinessId && !!profileDetail && !!isAddDealResource && !!handleProductChange) {
      const name = `${profileDetail.ownerFirstName || ''} ${profileDetail.ownerLastName || ''}`.trim().toLowerCase();
      if (!!products && products.length > 0) {
        const findItem = products.find((i) => i.text.toLowerCase() == name);
        if (findItem) {
          handleProductChange(null, { value: findItem.value });
        }
      }
    }
  }, [lineOfBusinessId, isAddDealResource, profileDetail, handleProductChange, products]);

  const [productFilter, setProductFilter] = useState([])

  useEffect(() => {
    let _product = [];
    _product = products.filter((item) => {
      return item.active || (value && value.indexOf(item.value) !== -1)
    })
    setProductFilter(_product);
  }, [products])

  return (
    <Dropdown
      id={colId}
      className={_class}
      onClick={() => {
        calculatingPositionMenuDropdown && calculatingPositionMenuDropdown(colId);
      }}
      fluid
      selection
      multiple={isMultiple}
      options={productFilter}
      value={value}
      search
      {...other}
    />
  );
};

export default compose(
  connect(
    (state, { lineOfBusinessId }) => {
      const dropdown = getDropdown(state, objectType);
      const products = getProductsForLOB(state, lineOfBusinessId);
      return {
        products: lineOfBusinessId ? products : [],
        isFetching: dropdown.isFetching,
        profileDetail: state.entities?.resources?.__DETAIL,
      };
    },
    {
      requestFetchDropdown: DropdownActions.requestFetch,
    }
  ),
  lifecycle({
    componentWillMount() {
      const { lineOfBusinessId, requestFetchDropdown} = this.props;

      if (lineOfBusinessId) {
        requestFetchDropdown(objectType, null, lineOfBusinessId);
      }
    },
    componentDidUpdate: function(prevProps) {
      const { lineOfBusinessId, requestFetchDropdown } = this.props;
      if (lineOfBusinessId !== prevProps.lineOfBusinessId && lineOfBusinessId) {
        requestFetchDropdown(objectType, null, lineOfBusinessId);
      }
    },
  })
  // eslint-disable-next-line no-unused-vars
)(ProductDropdown);
