// @flow
import * as React from 'react';
import { useState, useRef } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Avatar } from 'components';
import cx from 'classnames';
import { List, Popup } from 'semantic-ui-react';
import css from './UserListItem.css';
import { makeGetUser } from '../user.selector';
import ReactCardFlip from 'react-card-flip';

type PropsT = {
  user: {},
  active: boolean,
};
const styleTooltip = {
  fontSize: 11,
};
const UserListItem = ({ user, active, postion, size }: PropsT) => {
  const cn = cx(css.listItem);
  const [isFlipAvatar, setIsFlipAvatar] = useState(false);
  const [open, setOpen] = useState(false);
  const handleFlip = (type) => {
    setOpen(false);
    setIsFlipAvatar(type);
  };

  const getSourceMess = (discProfile) => {
    let discDesc = '';
    if (discProfile === 'NONE') {
      discDesc = 'Behaviour not defined';
    } else if (discProfile === 'BLUE') {
      discDesc = 'Likes facts, quality and accuracy';
    } else if (discProfile === 'RED') {
      discDesc = 'Likes to take quick decisions, to act and take lead';
    } else if (discProfile === 'GREEN') {
      discDesc = 'Likes socialising, collaboration and security';
    } else if (discProfile === 'YELLOW') {
      discDesc = 'Likes to convince, influence and inspire others';
    }

    return discDesc;
  };
  const getSourceColor = (discProfile) => {
    let disc = '';
    if (discProfile === 'NONE') {
      disc = '#ADADAD';
    } else if (discProfile === 'BLUE') {
      disc = '#2F83EB';
    } else if (discProfile === 'RED') {
      disc = '#ed684e';
    } else if (discProfile === 'GREEN') {
      disc = '#A9D231';
    } else if (discProfile === 'YELLOW') {
      disc = '#F5B342';
    }

    return disc;
  };
  return (
    <div className={cn}>
      <div className={css.avatar}>
        {/* <Avatar src={user.avatar} fallbackIcon="user" /> */}
        <ReactCardFlip isFlipped={isFlipAvatar} flipDirection="horizontal">
          {user.avatar ? (
            <Avatar onClick={() => handleFlip(true)} size={size || 30} src={user.avatar} />
          ) : (
            <Avatar
              isShowName
              onClick={() => handleFlip(true)}
              size={size || 30}
              // backgroundColor={getSourceColor(user.discProfile)}
              firstName={user.firstName}
              lastName={user.lastName}
            />
          )}

          <Popup
            style={styleTooltip}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            position="top center"
            trigger={
              <div isFlipped={isFlipAvatar} flipDirection="horizontal">
                <Avatar
                  isFlip
                  backgroundColor={getSourceColor(user.discProfile)}
                  onClick={() => handleFlip(false)}
                  size={size || 30}
                />
              </div>
            }
          >
            <Popup.Content>
              <span>{getSourceMess(user.discProfile)}</span>
            </Popup.Content>
          </Popup>
        </ReactCardFlip>
      </div>
      <div className={css.list}>
        <List>
          {user.firstName && user.lastName && (
            <List.Item>
              <div className={postion == 0 ? css.firstRepon : css.repon}>
                {user.firstName} {user.lastName}
              </div>
            </List.Item>
          )}

          {user.email && (
            <List.Item>
              <List.Icon name="envelope" />
              <List.Content>
                <a className={css.shortInfor} href={`mailto:${user.email}`}>
                  {user.email}
                </a>
              </List.Content>
            </List.Item>
          )}
          {user.phone && (
            <List.Item>
              <List.Icon name="phone" />
              <List.Content>
                <a className={css.shortInfor} href={`tel:${user.phone}`}>
                  {user.phone}
                </a>
              </List.Content>
            </List.Item>
          )}
        </List>
      </div>
    </div>
  );
};

const makeMapStateToProps = () => {
  const getUser = makeGetUser();
  const mapStateToProps = (state, { userId }) => ({
    user: getUser(state, userId),
  });
  return mapStateToProps;
};

export default compose(connect(null))(UserListItem);
