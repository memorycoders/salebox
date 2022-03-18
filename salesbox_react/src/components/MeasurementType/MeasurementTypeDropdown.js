//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as DropdownActions from 'components/Dropdown/dropdown.actions';
import { getMeasurementTypes } from 'components/MeasurementType/measurement-type.selector';
import { compose, lifecycle, mapProps } from 'recompose';
import { ObjectTypes } from 'Constants';
import { connect } from 'react-redux';
import { getDropdown } from 'components/Dropdown/dropdown.selector';
import _l from 'lib/i18n';

type PropsT = {
  measurementTypes: Array<{}>,
  isFetching: boolean,
};

addTranslations({
  'en-US': {
    'Product type': 'Product type',
  },
});

const objectType = ObjectTypes.MeasurementType;

const MeasurementTypeDropdown = ({ measurementTypes, isFetching, ...other }: PropsT) => {
  return (
    <Dropdown
      loading={isFetching}
      fluid
      selection
      options={measurementTypes}
      {...other}
    />
  );
};

export default compose(
  connect(
    (state) => {
      const dropdown = getDropdown(state, objectType);
      const measurementTypes = getMeasurementTypes(state);
      return {
        measurementTypes,
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
)(MeasurementTypeDropdown);
