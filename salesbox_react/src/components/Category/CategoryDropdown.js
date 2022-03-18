//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as CategioryActions from 'components/Category/category.actions';
import { getCategories } from 'components/Category/category.selector';
import { compose, mapProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withGetData } from 'lib/hocHelpers';
import AddDropdown from '../AddDropdown/AddDropdown';
import * as OverviewActions from './../Overview/overview.actions.js';
import type { CategoryT } from 'components/Category/category.types';

type PropsT = {
  categories: Array<CategoryT>,
  handleSearch: (event: Event, { value: string }) => void,
  isFetching: (event: Event, { searchQuery: string }) => void,
  isFetching: boolean,
  size?: string,
  addCategory: () => void,
};

const CategoryDropdown = ({
  size,
  categories,
  isFetching,
  addCategory,
  onChange,
  addLabel,
  value,
  _class,
  colId,
  calculatingPositionMenuDropdown,
  ...other
}: PropsT) => {
  return (
    <AddDropdown
      colId={colId}
      className={_class}
      onClick={() => {
        calculatingPositionMenuDropdown && calculatingPositionMenuDropdown(colId);
      }}
      loading={isFetching}
      fluid
      selection
      clearable
      size="small"
      search
      options={categories}
      onClickAdd={addCategory}
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
    (state) => ({
      categories: getCategories(state),
      isFetching: state.ui.category.dropdownFetching,
    }),
    {
      requestFetchDropdown: CategioryActions.requestFetchDropdown,
      highlight: OverviewActions.highlight,
    }
  ),
  withHandlers({
    addCategory: ({ highlight, overviewType, task }) => () => {
      highlight(overviewType, '', 'addCategory');
    },
  }),
  withGetData(({ requestFetchDropdown }) => () => requestFetchDropdown()),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ requestFetchDropdown, getData, ...other }) => ({
    ...other,
  }))
)(CategoryDropdown);
