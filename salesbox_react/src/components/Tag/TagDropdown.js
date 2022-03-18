//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as TagActions from 'components/Tag/tag.actions';
import { getTags, getFilterTags, getTagsSort } from 'components/Tag/tag.selector';
import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';
import { withGetData } from 'lib/hocHelpers';
import type { CategoryT } from 'components/Category/category.types';

type PropsT = {
  tags: Array<CategoryT>,
  handleSearch: (event: Event, { value: string }) => void,
  isFetching: boolean,
};

const TagDropdown = ({ tags, isFetching, _class, colId, calculatingPositionMenuDropdown,...other }: PropsT) => {
  return (
    <Dropdown
      id={colId}
      className={_class}
      onClick={() => { calculatingPositionMenuDropdown && calculatingPositionMenuDropdown(colId)}}
      fluid
      search
      selection
      loading={isFetching}
      options={tags}
      {...other}
      clearable
      defaultValue={tags[0] && tags[0].value}
    />
  );
};

export default compose(
  connect(
    (state, { filter }) => ({
      tags: filter ? getFilterTags(state) : getTagsSort(state),
      isFetching: state.ui.tag.dropdownFetching,
    }),
    {
      requestFetchDropdown: TagActions.requestFetchDropdown,
    }
  ),
  withGetData(({ requestFetchDropdown }) => () => requestFetchDropdown()),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ requestFetchDropdown, getData, filter, ...other }) => ({
    ...other,
  }))
)(TagDropdown);
