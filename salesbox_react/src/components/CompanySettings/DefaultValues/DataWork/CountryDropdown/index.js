//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { getCurrencies } from 'lib/common';
import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';

addTranslations({
  'en-US': {
    'Select country': 'Select country',
  },
});

const CountryDropdown = (props) => {
  return <Dropdown lazyLoad fluid search selection upward={false} {...props} />;
};

export default compose(
  connect(() => ({
    options: getCurrencies(),
  })),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ dispatch, ...other }) => ({
    ...other,
  }))
)(CountryDropdown);
