// @flow
import * as React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { Menu, Popup, Icon } from 'semantic-ui-react';
import * as AppActions from 'components/App/app.actions';
import Avatar from 'components/Avatar/Avatar2';
import { getAvatar, getFirstName, getLastName } from 'components/Auth/auth.selector';
import PersonList from './PersonList';
import UnitList from './UnitList';
import _l from 'lib/i18n';
import CompanyList from './CompanyList';
import css from './RoleMenu.css';
import noneAvatar from '../../../public/none_avatar.png';

type PropsT = {
  setPerson: () => void,
  setUnit: () => void,
  setOrganisation: () => void,
  open: boolean,
  onOpen: () => void,
  onClose: () => void,
  activeTab: string,
  avatar: string,
  firstName: {},
  lastName: {},
};

addTranslations({
  'en-US': {
    Profile: 'Profile',
    'My settings': 'My settings',
    Person: 'Person',
    Unit: 'Unit',
    Company: 'Company',
    'Sign out': 'Sign out',
    'Billing info': 'Billing info',
    'Terms of use': 'Terms of use',
  },
});

const popupStyle = {
  padding: '8px 0 0 0',
  maxWidth: 246,
  minWidth: 246,
  maxHeight: 340,
  minHeight: 340,
};

const RoleMenu = ({
  user,
  avatar,
  activeTab,
  open,
  onOpen,
  onClose,
  setPerson,
  setUnit,
  setOrganisation,
  firstName,
  lastName,
}: PropsT) => {
  const firstNameChar = firstName != null && firstName.length > 0 ? firstName.charAt(0) : '';
  const lastNameChar = lastName != null && lastName.length > 0 ? lastName.charAt(0) : '';

  // const checkInsightPage = location.pathname.includes('/insights');
  // console.log('location.pathname: ', location.pathname)
  // if(checkInsightPage){
  //   const avatarSelf = user.avatar;
  //   return <Menu.Item name="profile" className={css.avatar}>
  //     <div name="profile" className={css.roleMenu}>
  //       {avatar ? <Avatar size={36} src={avatarSelf} fallbackIcon="user" />
  //         : <div className={css.container}>
  //           <img src={noneAvatar} style={{ width: '34px' }} />
  //           <div className={css.nameOfImage}>{firstNameChar}{lastNameChar}</div>
  //         </div>}
  //     </div>
  //   </Menu.Item>
  // }

  const profileMenuItem = (
    <Menu.Item name="profile" className={css.avatar}>
      <div name="profile" className={css.roleMenu}>
        {avatar ? (
          <Avatar size={36} src={avatar} fallbackIcon="user" />
        ) : (
          <div className={css.container}>
            <img src={noneAvatar} style={{ width: '34px' }} />
            <div className={css.nameOfImage}>
              {firstNameChar}
              {lastNameChar}
            </div>
          </div>
        )}
        <Icon style={{ color: '#808080' }} name="chevron down" />
      </div>
    </Menu.Item>
  );
  return (
    <Popup
      trigger={profileMenuItem}
      onOpen={onOpen}
      onClose={onClose}
      open={open}
      flowing
      hoverable
      position="bottom center"
      size="huge"
      style={popupStyle}
      on="click"

      // onClick={onClose}
    >
      <Menu pointing secondary className={css.menu}>
        <Menu.Item className={css.blankItems}></Menu.Item>
        <Menu.Item active={activeTab === 'person'} onClick={setPerson}>
          <p className={css.tab}>{_l`Person`}</p>
        </Menu.Item>
        {user?.permission?.own_unit?.read && (
          <>
            <Menu.Item active={activeTab === 'unit'} onClick={setUnit}>
              <p className={css.tab}>{_l`Unit`}</p>
            </Menu.Item>
          </>
        )}
        {user?.permission?.all_company?.read && user?.permission?.own_unit?.read && (
          <Menu.Item active={activeTab === 'organisation'} onClick={setOrganisation}>
            <p className={css.tab}>{_l`Company`}</p>
          </Menu.Item>
        )}
      </Menu>
      {activeTab === 'person' && <PersonList />}
      {user?.permission?.own_unit?.read && (
        <>
          {activeTab === 'unit' && <UnitList />}
        </>
      )}
      {user?.permission?.all_company?.read && user?.permission?.own_unit?.read && (
        <>
          {activeTab === 'organisation' && <CompanyList />}
        </>
      )}
    </Popup>
  );
};

export default compose(
  connect(
    (state) => ({
      activeTab: state.ui.app.roleTab,
      avatar: getAvatar(state),
      firstName: getFirstName(state),
      lastName: getLastName(state),
      user: state.auth.user,
    }),
    {
      setActiveTab: AppActions.setRoleTab,
    }
  ),
  withState('open', 'setOpen', false),
  withHandlers({
    onOpen: ({ setOpen, user }) => () => {
      if (user?.permission?.all_company?.read || user?.permission?.own_unit?.read) {
        setOpen(true);
      }
    },
    onClose: ({ setOpen }) => () => {
      setOpen(false);
    },
    setPerson: ({ setActiveTab }) => (event) => {
      event.stopPropagation();
      setActiveTab('person');
    },
    setUnit: ({ setActiveTab }) => (event) => {
      event.stopPropagation();
      setActiveTab('unit');
    },
    setOrganisation: ({ setActiveTab }) => (event) => {
      event.stopPropagation();
      setActiveTab('organisation');
    },
  })
)(RoleMenu);
