// @flow
import * as React from 'react';
import { compose, withHandlers, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import { getActiveUsers, getActiveUsersDTO } from 'components/User/user.selector';
import PersonListItem from './PersonListItem';
import css from './List.css';
import { Form, Icon, Input, TextArea } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { withGetData } from 'lib/hocHelpers';
import * as UserActions from 'components/User/user.actions';
import { getUser } from '../Auth/auth.selector';

type PropsT = {
  users: Array<{}>,
};
addTranslations({
  'en-US': {},
});

const PersonList = ({ users, name, handleChangeName, usersFilter, userLoggedIn, usersDTO }: PropsT) => {
  return (
    <>
      <Input
        className={css.inputSearch}
        fluid
        focus
        size="medium"
        value={name}
        onChange={handleChangeName}
        iconPosition="right"
        icon={<Icon size={3} className={css.searchIcon} name="search" link />}
        placeholder={_l`Search for a person`}
      />
      {/* <Input value={name} onChange={handleChangeName} className={css.inputSearch}
           placeholder={_l`Search for a contact`}
           iconPosition='left'
           icon={<Icon size={18} cl name='search' />}/> */}
      <div className={css.scrollList}>
        <div className={css.list}>
          {userLoggedIn?.permission?.own_unit?.read && !userLoggedIn?.permission?.all_company?.read
            ? usersFilter?.filter(e => usersDTO?.[e]?.unit === usersDTO?.[userLoggedIn?.uuid]?.unit).map((userId) => {
                return <PersonListItem isCurrentUser={userId == userLoggedIn.uuid} userId={userId} key={userId} />;
              })
            : usersFilter.map((userId) => {
                return <PersonListItem isCurrentUser={userId == userLoggedIn.uuid} userId={userId} key={userId} />;
              })}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state, props) => {
  let listUser = getActiveUsers(state);
  let currentUser = getUser(state);
  let users = [
    ...listUser.filter((userId) => userId === currentUser.uuid),
    ...listUser.filter((userId) => userId !== currentUser.uuid),
  ];

  let usersDTO = getActiveUsersDTO(state);
  return {
    users: users,
    usersDTO: usersDTO,
    userLoggedIn: currentUser,
  };
};

const mapDispatchToProps = {
  requestFetchList: UserActions.requestFetchList,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('name', 'setName', ''),
  withState('usersFilter', 'setUsersFilter', (props) => props.users),
  withGetData(({ requestFetchList }) => () => requestFetchList()),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      //fix not render when change props
      if (nextProps.users.length != this.props.users.length) {
        this.props.setUsersFilter(nextProps.users);
      }
    },
  }),
  withHandlers({
    handleChangeName: (props) => (event, { value: name }) => {
      props.setName(name);
      let userResults =
        name === null || name === ''
          ? Object.keys(props.usersDTO).filter((userId) => props.usersDTO[userId].active)
          : Object.keys(props.usersDTO).filter(
              (userId) =>
                props.usersDTO[userId].active &&
                props.usersDTO[userId].name != null &&
                props.usersDTO[userId].name.toLowerCase().includes(name.toLowerCase().trim())
            );
      let newA = userResults.sort(function(a, b) {
        var nameA = props.usersDTO[a].name ? props.usersDTO[a].name.toUpperCase() : ''; // ignore upper and lowercase
        var nameB = props.usersDTO[b].name ? props.usersDTO[b].name.toUpperCase() : ''; // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });
      let newB = [
        ...newA.filter((userId) => userId === props.userLoggedIn.uuid),
        ...newA.filter((userId) => userId !== props.userLoggedIn.uuid),
      ];
      props.setUsersFilter(newB);
    },
  })
)(PersonList);
