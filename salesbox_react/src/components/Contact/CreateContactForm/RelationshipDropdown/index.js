//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { getRelationshipOptions } from 'lib/common';
import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';

addTranslations({
  'en-US': {
    'Select relationship': 'Select relationship',
  },
});

const RelationshipDropdown = (props) => {
  return <Dropdown fluid search selection {...props} />;
};

export default compose(
  connect((state) => ({
    options: getRelationshipOptions(state),
  })),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ dispatch, ...other }) => ({
    ...other,
  }))
)(RelationshipDropdown);
