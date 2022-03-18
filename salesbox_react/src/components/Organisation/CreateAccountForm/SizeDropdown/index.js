//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as SizeActions from 'components/Size/size.actions';
import { getSizesForAccount } from 'components/Size/size.selector';
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

const SizeDropdown = ({ handleSearch, sizes, isFetching, ...other }: PropsT) => {
  return (
    <Dropdown loading={isFetching} onSearchChange={handleSearch} fluid search selection options={sizes} {...other} />
  );
};

export default compose(
  connect(
    (state) => ({
      sizes: getSizesForAccount(state),
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
