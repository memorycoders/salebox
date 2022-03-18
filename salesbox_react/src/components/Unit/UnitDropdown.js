//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as UnitActions from 'components/Unit/unit.actions';
import { getUnitsForDropdown } from 'components/Unit/unit.selector';
import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';
import { withGetData } from 'lib/hocHelpers';
import type { UnitT } from 'components/Unit/unit.types';
import AddDropdown from '../AddDropdown/AddDropdown'

type PropsT = {
  units: Array<UnitT>,
  isFetching: (event: Event, { searchQuery: string }) => void,
  isFetching: boolean,
};

const UnitDropdown = ({ units, isFetching, ...other }: PropsT) => {
  return <AddDropdown
    type='notAdd'
    dropdownType='user'
    style={{ height: 28 }}
    loading={isFetching} fluid search selection size="small" options={units} {...other} placeholder=""/>;
};

export default compose(
  connect(
    (state) => ({
      units: getUnitsForDropdown(state),
      isFetching: state.ui.unit.fetching.list,
    }),
    {
      requestFetch: UnitActions.requestFetch,
    }
  ),
  withGetData(({ requestFetch }) => () => requestFetch()),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ requestFetch, getData, dispatch, ...other }) => ({
    ...other,
  }))
)(UnitDropdown);
