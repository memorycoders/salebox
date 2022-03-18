//@flow
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as DropdownActions from '../Dropdown/dropdown.actions';
import { getProductGroup } from '../ProductGroup/productGroup.selector';
import { compose, lifecycle, mapProps } from 'recompose';
import { ObjectTypes } from 'Constants';
import { connect } from 'react-redux';
import { getDropdown } from 'components/Dropdown/dropdown.selector';

type PropsT = {
  products: Array<OrganisationT>,
  isFetching: boolean,
};

const objectType = ObjectTypes.ProductGroup;

const ProductGroupDropdown = ({ productGroups, isFetching, value, error, colId, _class, calculatingPositionMenuDropdown, ...other }: PropsT) => {
  return (
    <Dropdown
      loading={isFetching}
      id={colId}
      className={_class}
      onClick={() => {calculatingPositionMenuDropdown && calculatingPositionMenuDropdown(colId)}}
      fluid
      selection
      size="small"
      search
      options={productGroups}
      error={error}
      value={value || (productGroups && productGroups[0].value)}
      {...other}
    />
  );
};

export default compose(
  connect(
    (state) => {
      const dropdown = getDropdown(state, objectType);
      const productGroups = getProductGroup(state);
      return {
        productGroups,
        isFetching: dropdown.isFetching,
      };
    },
    {
      requestFetchDropdown: DropdownActions.requestFetch,
    }
  ),
  lifecycle({
    componentWillMount() {
      const { requestFetchDropdown } = this.props;
      requestFetchDropdown(objectType, null);
    },
  }),
  mapProps(({ requestFetchDropdown, dispatch, ...other }) => ({
    ...other,
  }))
)(ProductGroupDropdown);
