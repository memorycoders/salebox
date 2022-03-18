/* eslint-disable react/prop-types */
//@flow
import React from 'react';
import * as FocusActions from 'components/Focus/focus.actions';
import { getFoci } from 'components/Focus/focus.selector';
import { compose, mapProps, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { withGetData } from 'lib/hocHelpers';
import AddDropdown from '../AddDropdown/AddDropdown';
import FuzzySearch from 'fuzzy-search';
import _l from 'lib/i18n';
import * as OverviewActions from './../Overview/overview.actions.js';
import type { DropdownType } from 'types/semantic-ui.types';

type PropsT = {
  foci: Array<DropdownType>,
  handleSearch: (event: Event, { value: string }) => void,
  isFetching: boolean,
  addFocus: () => void
};

addTranslations({
  'en-US': {
    Required: 'Required',
  },
});

const FocusDropdown = ({ handleSearch, focus,foci, isFetching, errors, addFocus, onChange, addLabel, value, _class, colId, calculatingPositionMenuDropdown  , ...other }: PropsT) => {
  return (
    <AddDropdown
      colId={colId}
      _class={_class}
      calculatingPositionMenuDropdown={calculatingPositionMenuDropdown}
      loading={isFetching}
      fluid
      search
      selection
      placeholder={' '}
      options={foci}
      error={errors && errors.focusWorkData ? true : false}
      onClickAdd={addFocus}
      onChange={onChange}
      addLabel={addLabel}
      value={value}
      isLoadMore={false}
      // {...other}
    />
  );
};

export default compose(
  connect(
    (state) =>{

    return ({
      foci: getFoci(state),
      isFetching: state.ui.focus.dropdownFetching,
    })
    }
  ,
    {
      requestFetchDropdown: FocusActions.requestFetchDropdown,
      highlight: OverviewActions.highlight,
    }
  ),
  withState('focus', 'setfocus', (props) => {


    return props.foci;
  }),
  withHandlers({
    handleSearch: (props) => (event, { searchQuery }) => {
      const searcher = new FuzzySearch(props.foci, ['text'], {
        caseSensitive: false,
      });
      const result = searcher.search(event.target.value);
      props.setfocus(result);
    },
    addFocus: ({highlight, overviewType, task}) => () => {
      highlight(overviewType,'', 'addFocus');
    },
  }),
  withGetData(({ requestFetchDropdown, taskId, focusType }) => () => requestFetchDropdown(taskId, focusType)),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ requestFetchDropdown, getData, focusType, taskId, dispatch, ...other }) => ({
    ...other,
  }))
)(FocusDropdown);
