//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { getDiscProfileOptions } from 'lib/common';
import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';

addTranslations({
  'en-US': {
    'Select behavior profile': 'Select behavior profile',
  },
});

const DiscProfileDropdown = (props) => {
  return <Dropdown fluid search selection {...props} />;
};

export default compose(
  connect((state) => ({
    options: getDiscProfileOptions(state),
  })),
  mapProps(({ dispatch, ...other }) => ({
    ...other,
  }))
)(DiscProfileDropdown);
