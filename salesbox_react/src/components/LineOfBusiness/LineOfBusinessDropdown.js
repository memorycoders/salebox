//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as DropdownActions from 'components/Dropdown/dropdown.actions';
import { getLineOfBusinesses } from 'components/LineOfBusiness/line-of-business.selector';
import { compose, lifecycle, mapProps } from 'recompose';
import { ObjectTypes } from 'Constants';
import { connect } from 'react-redux';
import { getDropdown } from 'components/Dropdown/dropdown.selector';
import _l from 'lib/i18n';

type PropsT = {
  lobs: Array<{}>,
  isFetching: boolean,
};

addTranslations({
  'en-US': {
    'Product group': 'Product group',
  },
});

const objectType = ObjectTypes.LineOfBusiness;

const LineOfBusinessDropdown = ({ lobs, isFetching, ...other }: PropsT) => {
  return (
    <Dropdown
      loading={isFetching}
      fluid
      selection
      options={lobs}
      {...other}
    />
  );
};

export default compose(
  connect(
    (state) => {
      const dropdown = getDropdown(state, objectType);
      const lobs = getLineOfBusinesses(state);
      return {
        lobs,
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
      requestFetchDropdown(objectType);
    },
  }),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ requestFetchDropdown, dispatch, ...other }) => ({
    ...other,
  }))
)(LineOfBusinessDropdown);
