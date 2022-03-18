//@flow
import React from 'react';
import { getUsersForDropdown } from 'components/User/user.selector';
import * as UserActions from 'components/User/user.actions';
import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';
import { withGetData } from 'lib/hocHelpers';
import type { UserT } from 'components/User/user.types';
import AddDropdown from '../AddDropdown/AddDropdown'

type PropsT = {
  users: Array<UserT>,
  handleSearch: (event: Event, { value: string }) => void,
  isFetching: (event: Event, { searchQuery: string }) => void,
  isFetching: boolean,
};

const UserDropdown = ({ users, object, handleOnClick, id, ...other  }: PropsT) => {

    return <AddDropdown dropdownType='user' type='notAdd' id={id} fluid selection size="small" onClick={() => {handleOnClick && handleOnClick(id)}} options={users} {...other} search />;
};

export default compose(
  connect((state, props) => ({
    users: getUsersForDropdown(state, props.unitId),
  }),
  {
    requestFetchList: UserActions.requestFetchList,
  }),
  withGetData(({ requestFetchList }) => () => requestFetchList()),
  mapProps(({ requestFetchList, dispatch, unitId, isAll, ...other }) => ({
    ...other,
  }))
)(UserDropdown);
