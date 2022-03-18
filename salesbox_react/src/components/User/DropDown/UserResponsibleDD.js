//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { getUsersForDropdown, getUsersDeactive } from 'components/User/user.selector';
import { compose, mapProps, lifecycle, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import Sortable from 'sortablejs';
import type { UserT } from 'components/User/user.types';

type PropsT = {
  users: Array<UserT>,
  handleSearch: (event: Event, { value: string }) => void,
  isFetching: (event: Event, { searchQuery: string }) => void,
  isFetching: boolean,
  handleOnChange: Function
};

// ParticipantList
const UserResponsibleDD = ({handleOnChange, users, ...other }: PropsT) => {
  return (
    <Dropdown closeOnChange search onChange={handleOnChange} fluid selection multiple size="small" options={users} {...other} />
  );
};
export default compose(
  connect(
    (state, props) => {
      return {
        users: getUsersForDropdown(state),
        allUsers: state.entities.user,
      };
    }
  ),
  withHandlers({
    handleSwapLabel: ({value, _onChange}) => (id) => {
      console.log("value", value)
      let el = document.getElementById(id)
      if(el) {
        new Sortable(el, {
          swap: true, // Enable swap mode
          swapClass: "label",
          onUpdate: (evt) => {
            let list = Array.from(value)
            let oldItem = list[evt.oldIndex];
            let newItem = list[evt.newIndex]
            if(oldItem && newItem) {
              list[evt.newIndex] = oldItem;
              list[evt.oldIndex] = newItem;
              _onChange(evt, {value: list})
            }
          }
        });
      }
    }
  }),
  withHandlers({
    handleOnChange: ({_onChange, id, handleSwapLabel}) => (e, data) => {
      _onChange(e, data)
      handleSwapLabel(id)
    }
  }),
  lifecycle({
    componentDidMount() {
      setTimeout(() => {
        const {handleSwapLabel} = this.props
        handleSwapLabel(this.props.id)
      })
    },
    componentWillReceiveProps(nextProps){
      if (nextProps.value) {
        let deactiveUsersFIlter = nextProps.value.filter(element => !nextProps.users.find(e => e.value === element));
      
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
  }),

  // eslint-disable-next-line no-unused-vars
  mapProps(({ dispatch, uuid, ...other }) => ({
    ...other,
  }))
)(UserResponsibleDD);
