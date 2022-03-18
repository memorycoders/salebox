//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as FocusActions from 'components/Focus/focus.actions';
import { getFocusActivities } from 'components/Focus/focus.selector';
import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';
import { withGetData } from 'lib/hocHelpers';
import _l from 'lib/i18n';
import type { DropdownType } from 'types/semantic-ui.types';

type PropsT = {
  focusActivities: Array<DropdownType>,
  handleSearch: (event: Event, { value: string }) => void,
  isFetching: boolean,
};

const FocusActivityDropdown = ({ handleSearch, focusActivities, isFetching, _class, colId, calculatingPositionMenuDropdown, ...other }: PropsT) => {
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
      placeholder={_l`Select focus`}
      options={focusActivities}
      {...other}
    />
  );
};

export default compose(
  connect(
    (state) => ({
      focusActivities: getFocusActivities(state),
      isFetching: state.ui.focus.activityDropdownFetching,
    }),
    {
      requestFetchActivityDropdown: FocusActions.requestFetchActivityDropdown,
    }
  ),
  withGetData(({ requestFetchActivityDropdown }) => () => requestFetchActivityDropdown()),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ requestFetchActivityDropdown, getData, dispatch, ...other }) => ({
    ...other,
  }))
)(FocusActivityDropdown);
