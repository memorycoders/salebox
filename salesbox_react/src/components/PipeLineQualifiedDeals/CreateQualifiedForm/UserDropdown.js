/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//@flow
import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { getUsersForDropdown } from 'components/User/user.selector';
import { compose, lifecycle, mapProps } from 'recompose';
import { connect } from 'react-redux';
import type { UserT } from 'components/User/user.types';
import {  OverviewTypes } from 'Constants';
import AddDropdown from '../../AddDropdown/AddDropdown'

type PropsT = {
  users: Array<UserT>,
  handleSearch: (event: Event, { value: string }) => void,
  isFetching: (event: Event, { searchQuery: string }) => void,
  isFetching: boolean,
};

const UserDropdown = ({ users, object, value, handleOnClick, participantOpts, onLabelClick, mutilChange, overviewType, id, ...other }: PropsT) => {
  // console.log("UserDropdown users: ",users);
  return (
    <AddDropdown
      overviewType={overviewType}
      fluid
      selection
      size="small"
      options={users}
      {...other}
      multiple={overviewType === OverviewTypes.CallList.Account ? false : true}
      search
      value={ overviewType === OverviewTypes.CallList.Account ? value.toString() : value}
      renderLabel={(item) => {
        if (mutilChange){
          const firstItem = value.findIndex(valueItem => valueItem === item.value);
          return firstItem === 0 ? `${item.text} - 100%` : `${item.text} - 0%`;
        }
        const active = participantOpts.find((x) => x.uuid === item.key);
        if(active){
        if (overviewType === OverviewTypes.CallList.SubAccount){
          return `${item.text}`;
        }
        if (overviewType === OverviewTypes.CallList.SubContact){
          return `${item.text}`;
        }
        if (overviewType === OverviewTypes.CallList.Account){
          return `${item.text}`;
        }
        if (overviewType === OverviewTypes.Contact){
          return `${item.text}`;
        }
        if (overviewType !== OverviewTypes.Account) {
          return `${item.text} - ${active.sharedPercent}%`;
        } if (overviewType === OverviewTypes.Account){
          return `${item.text}`;
        }
        }
        return null;
      }}
      onLabelClick={onLabelClick}
    />
  );
};

export default compose(
  connect((state, props) => ({
    users: getUsersForDropdown(state, props.unitId),
    allUsers: state.entities.user,

  })),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ dispatch, unitId, isAll, ...other }) => ({
    ...other,
  })),
  lifecycle({
    componentWillReceiveProps(nextProps){
      if (nextProps.value && Array.isArray(nextProps.value)) {
        let deactiveUsersFIlter = nextProps?.value?.filter(element => !nextProps.users.find(e => e.value === element));

        if(deactiveUsersFIlter?.length > 0) {
          deactiveUsersFIlter.map(e => {
            nextProps.users.push({
              key: nextProps.allUsers[e]?.uuid,
              value: nextProps.allUsers[e]?.uuid,
              text: nextProps.allUsers[e]?.name,
              image: {
                src: `https://d3si3omi71glok.cloudfront.net/salesboxfiles/${nextProps.allUsers[e]?.avatar?.slice(-3)}/${nextProps.allUsers[e]?.avatar}`,
                avatar: true,
                style:{
                  width: '22px'
                }
              },
              disabled: true
            })
          })
        }

      }
    }
  })
)(UserDropdown);
