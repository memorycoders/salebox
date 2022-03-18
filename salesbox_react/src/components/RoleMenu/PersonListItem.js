// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Clickable, Avatar } from 'components';
import * as AppActions from 'components/App/app.actions';
import cx from 'classnames';
import css from './List.css';
import { makeGetUser } from 'components/User/user.selector';
import noneAvatar from '../../../public/none_avatar.png';
import _l from 'lib/i18n';

type PropsT = {
  user: {},
  active: boolean,
  chooseRole: () => void,
};

const PersonListItem = ({ user, active, chooseRole, isCurrentUser }: PropsT) => {
  const cn = cx(css.listItem, {
    [css.active]: active,
  });
  const firstNameChar = user.firstName != null && user.firstName.length > 0 ? user.firstName.charAt(0) : '';
  const lastNameChar = user.lastName != null && user.lastName.length > 0 ? user.lastName.charAt(0) : '';

  return (
    <Clickable className={cn} onNavigate={chooseRole}>
      <div className={css.avatar}>
        {user.avatar ? (
          <Avatar size={32} src={user.avatar} fallbackIcon="user" />
        ) : (
          <div className={css.container}>
            <img src={noneAvatar} style={{ width: '34px' }} />
            <div className={css.nameOfImage}>
              {firstNameChar}
              {lastNameChar}
            </div>
          </div>
        )}
      </div>
      {isCurrentUser ? <div className={css.name}>{_l`Me`}</div> : <div className={css.name}>{user.name}</div>}
    </Clickable>
  );
};

const makeMapStateToProps = () => {
  const getUser = makeGetUser();
  const mapStateToProps = (state, { userId }) => ({
    user: getUser(state, userId),
    active: state.ui.app.roleType === 'Person' && state.ui.app.activeRole === userId,
  });
  return mapStateToProps;
};

const mapDispatchToProps = {
  setActiveRole: AppActions.setActiveRole,
};

const handlers = withHandlers({
  chooseRole: ({ user, setActiveRole }) => () => setActiveRole('Person', user.uuid),
});

export default compose(connect(makeMapStateToProps, mapDispatchToProps), handlers)(PersonListItem);
