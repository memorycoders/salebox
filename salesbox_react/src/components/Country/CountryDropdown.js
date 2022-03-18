//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { getListCountryOptions } from 'lib/common';
import { compose, mapProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';

addTranslations({
  'en-US': {
    'Select country': 'Select country',
  },
});

const CountryDropdown = (props) => {
  return <Dropdown lazyLoad placeholder={_l`Select country`} fluid search selection {...props} />;
};

export default compose(
  connect((state) => ({
    options: getListCountryOptions(state),
  })),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ dispatch, ...other }) => ({
    ...other,
  }))
)(CountryDropdown);
