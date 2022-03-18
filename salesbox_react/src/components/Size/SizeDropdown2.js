//@flow
import * as React from 'react';
import { Form, Dropdown } from 'semantic-ui-react';
import * as SizeActions from 'components/Size/size.actions';
import { getSizes } from 'components/Size/size.selector';
import { compose, mapProps, defaultProps } from 'recompose';
import { connect } from 'react-redux';
import { withGetData } from 'lib/hocHelpers';
import _l from 'lib/i18n';
import type { DropdownType } from 'types/semantic-ui.types';

type PropsT = {
  sizes: Array<DropdownType>,
  handleSearch: (event: Event, { value: string }) => void,
  isFetching: boolean,
  label: string,
  meta: any,
};

addTranslations({
  'en-US': {
    'Select size': 'Select size',
  },
});

// Integrated to Redux-Form.

const SizeDropdown2 = ({ handleSearch, sizes, isFetching, meta, label, input, ...other }: PropsT) => {
  const { error } = meta;

  return (
    <Form.Field error={!!error}>
      <label>{label}</label>
      <Dropdown
        value={input.value}
        loading={isFetching}
        onSearchChange={handleSearch}
        fluid
        search
        selection {...input}
        placeholder={_l`Select size`}
        options={sizes}
        onChange={(param, sizes) => input.onChange(sizes.value)}
        {...other}
      />
    </Form.Field>
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
)(SizeDropdown2);
