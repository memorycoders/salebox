//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as SizeActions from 'components/Size/size.actions';
import { getSizes } from 'components/Size/size.selector';
import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';
import { withGetData } from 'lib/hocHelpers';
import _l from 'lib/i18n';
import type { DropdownType } from 'types/semantic-ui.types';

type PropsT = {
  sizes: Array<DropdownType>,
  handleSearch: (event: Event, { value: string }) => void,
  isFetching: boolean,
};

addTranslations({
  'en-US': {
    'Select size': 'Select size',
  },
});

const SizeDropdown = ({ handleSearch, sizes, isFetching, _class, colId, calculatingPositionMenuDropdown, ...other }: PropsT) => {
  return (
    <Dropdown
      id={colId}
      className={_class}
      onClick={() => {calculatingPositionMenuDropdown(colId)}}
      loading={isFetching}
      onSearchChange={handleSearch}
      fluid
      search
      selection
      placeholder={_l`Select size`}
      options={sizes}
      {...other}
    />
  );
};

export default compose(
  connect(
    (state) => ({
      sizes: getSizes(state),
      isFetching: state.ui.focus.dropdownFetching,
    }),
    {
      requestFetchDropdown: SizeActions.requestFetchDropdown,
    }
  ),
  withGetData(({ requestFetchDropdown }) => () => requestFetchDropdown()),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ requestFetchDropdown, getData, dispatch, ...other }) => ({
    ...other,
  }))
)(SizeDropdown);
