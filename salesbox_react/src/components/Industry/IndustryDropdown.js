//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as IndustryActions from 'components/Industry/industry.actions';
import { getIndustriesForDropdown } from 'components/Industry/industry.selector';
import { compose, mapProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { withGetData } from 'lib/hocHelpers';
import _l from 'lib/i18n';
import type { IndustryT } from 'components/Industry/industry.types';

type PropsT = {
  industries: Array<IndustryT>,
  handleSearch: (event: Event, { value: string }) => void,
  isFetching: boolean,
};

const IndustryDropdown = ({ handleSearch, industries, isFetching, _class, colId, calculatingPositionMenuDropdown ,...other }: PropsT) => {
  return (
    <Dropdown
      id={colId}
      className={_class}
      onClick={() => {calculatingPositionMenuDropdown && calculatingPositionMenuDropdown(colId)}}
      loading={isFetching}
      onSearchChange={handleSearch}
      fluid
      search
      selection
      placeholder={_l`Select industry`}
      options={industries}
      {...other}
    />
  );
};

export default compose(
  connect(
    (state, { value }) => ({
      industries: getIndustriesForDropdown(state, { value }),
      isFetching: state.ui.industry.dropdownFetching,
    }),
    {
      requestFetchDropdown: IndustryActions.requestFetchDropdown,
    }
  ),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if((this.props.industries && this.props.industries.length == 0) || (nextProps.industries && nextProps.industries.length == 0)) {
        this.props.requestFetchDropdown();
      }
    }
  }),
  withGetData(({ requestFetchDropdown }) => () => requestFetchDropdown()),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ requestFetchDropdown, getData, dispatch, ...other }) => ({
    ...other,
  }))
)(IndustryDropdown);
