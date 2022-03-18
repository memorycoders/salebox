//@flow
import React from 'react';
import { useState, useRef } from 'react';
import _l from 'lib/i18n';
import { List, Popup } from 'semantic-ui-react';
import ReactCardFlip from 'react-card-flip';
import { connect } from 'react-redux';
import Avatar from 'components/Avatar/Avatar';
import { branch, renderNothing, compose, pure } from 'recompose';
import Collapsible from 'components/Collapsible/Collapsible';
import css from './CreatorPane.css';
import { WIDTH_DEFINE } from '../../../Constants';
import globalIconGray from '../../../../public/global_icon_gray.png';
import { getFirstName, getLastName } from 'components/Auth/auth.selector';

type PropsT = {
  creator: {},
  firstName: {},
  lastName: {},
};
const styleTooltip = {
  fontSize: 11,
};
addTranslations({
  'en-US': {
    '{0}': '{0}',
    Responsible: 'Responsible',
  },
});

const ContentPaneGlobalF = ({ size, title, qualifiedDeal }) => {
  const [isFlipAvatar, setIsFlipAvatar] = useState(false);
  const listItems =
    qualifiedDeal != null && qualifiedDeal.leadBoxerList != null && qualifiedDeal.leadBoxerList.length > 0 ? (
      qualifiedDeal.leadBoxerList.map((item) => {
        return (
          <List.Item key={item.uuid}>
            {/*<List.Icon name="envelope" />*/}
            <List.Content>
              <a className={css.shortInfor} href={item.domainName} target="_blank">
                {item.domainName}
              </a>
            </List.Content>
          </List.Item>
        );
      })
    ) : (
      <></>
    );

  return (
    <Collapsible
      hasDragable
      width={WIDTH_DEFINE.DETAIL_WIDTH_CONTENT}
      padded
      flex
      horizontal
      title={title ? title : _l`Responsible`}
    >
      <div className={css.creatorPaneContainer}>
        <div className={css.avatar}>
          <ReactCardFlip isFlipped={isFlipAvatar} flipDirection="horizontal">
            <div className={css.container} onClick={() => setIsFlipAvatar(true)}>
              <img src={globalIconGray} style={{ width: '63px' }} />
            </div>

            <Avatar isFlip backgroundColor={'#eb6953'} onClick={() => setIsFlipAvatar(false)} size={size || 60} />
          </ReactCardFlip>
        </div>
        <div className={css.info}>
          {/*<div className={css.creatorName}>
            {creator.name
              ? creator.name
              : creator.firstName && creator.lastName
                ? creator.firstName + ' ' + creator.lastName
                : creator.firstName
                  ? creator.firstName
                  : creator.lastName
                    ? creator.lastName
                    : ''}
          </div>*/}
          <div className={css.moreInfo}>
            <List>{listItems}</List>
          </div>
        </div>
        {/* <div className={qualifiedDeal ? css.shared : css.blank}>
            <span className={!title  ? css.sharedPercent : css.blank}>{creator.participantList[0].sharedPercent}%</span>
          </div> */}
      </div>
    </Collapsible>
  );
};
export const ContentPaneGlobal = compose(connect(null, null))(ContentPaneGlobalF);

const CreatorPane = ({
  creator,
  avatar,
  size,
  firstName,
  lastName,
  title,
  qualifiedDeal,
  showGlobal = false,
  styleCircle,
}: PropsT) => {
  const firstNameChar = firstName != null && firstName.length > 0 ? firstName.charAt(0) : '';
  const lastNameChar = lastName != null && lastName.length > 0 ? lastName.charAt(0) : '';
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
  if (avatar) {
    return (
      <ReactCardFlip isFlipped={isFlipAvatar} flipDirection="horizontal">
        {creator.avatar ? (
          <Avatar onClick={() => handleFlip(true)} size={size || 30} src={creator.avatar} />
        ) : !showGlobal ? (
          <Avatar
            isShowName
            onClick={() => handleFlip(true)}
            size={size || 30}
            border={creator.relationship}
            firstName={firstName}
            lastName={lastName}
            fullName={creator.fullName}
          />
        ) : (
          <Avatar
            isShowName
            onClick={() => handleFlip(true)}
            size={size || 30}
            border={creator.relationship}
            firstName={firstName}
            lastName={lastName}
            fullName={creator.fullName}
          />
        )}

        <Popup
          style={styleTooltip}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          className={css.popupAvatar}
          position="top center"
          trigger={
            <div isFlipped={isFlipAvatar} flipDirection="horizontal">
              <Avatar
                isFlip
                backgroundColor={getSourceColor(creator.disc)}
                onClick={() => handleFlip(false)}
                size={size || 30}
              />
            </div>
          }
        >
          <Popup.Content>
            <span>{getSourceMess(creator.disc)}</span>
          </Popup.Content>
        </Popup>
      </ReactCardFlip>
    );
  } else {
    return (
      <Collapsible
        width={WIDTH_DEFINE.DETAIL_WIDTH_CONTENT}
        padded
        hasDragable
        flex
        horizontal
        title={title ? title : _l`Responsible`}
      >
        <div className={css.creatorPaneContainer}>
          <div className={css.avatar}>
            <ReactCardFlip isFlipped={isFlipAvatar} flipDirection="horizontal">
              {creator.avatar ? (
                <Avatar
                  onClick={() => handleFlip(true)}
                  size={size || 60}
                  src={creator.avatar}
                  border={title ? creator.relationship : ''}
                />
              ) : (
                <Avatar
                  isShowName
                  onClick={() => handleFlip(true)}
                  size={size || 60}
                  // backgroundColor={getSourceColor(creator.discProfile)}
                  border={creator.relationship}
                  firstName={firstName}
                  lastName={lastName}
                  fullName={creator.fullName}
                />
              )}
              <Popup
                style={styleTooltip}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                className={css.popupAvatar}
                position="top center"
                trigger={
                  <div isFlipped={isFlipAvatar} flipDirection="horizontal">
                    <Avatar
                      isFlip
                      backgroundColor={getSourceColor(creator.discProfile)}
                      onClick={() => handleFlip(false)}
                      size={size || 60}
                    />
                  </div>
                }
              >
                <Popup.Content>
                  <span>{getSourceMess(creator.discProfile)}</span>
                </Popup.Content>
              </Popup>
            </ReactCardFlip>
          </div>
          <div className={css.info}>
            <div className={css.creatorName}>
              {creator.name
                ? creator.name
                : creator.firstName && creator.lastName
                ? creator.firstName + ' ' + creator.lastName
                : creator.firstName
                ? creator.firstName
                : creator.lastName
                ? creator.lastName
                : ''}
            </div>
            <div className={css.moreInfo}>
              <List>
                {creator.email && (
                  <List.Item>
                    <List.Icon name="envelope" />
                    <List.Content>
                      <a className={css.shortInfor} href={`mailto:${creator.email}`}>
                        {creator.email}
                      </a>
                    </List.Content>
                  </List.Item>
                )}
                {creator.phone && (
                  <List.Item>
                    <List.Icon name="phone" />
                    <List.Content>
                      <a className={css.shortInfor} href={`tel:${creator.phone}`}>
                        {creator.phone}
                      </a>
                    </List.Content>
                  </List.Item>
                )}
              </List>
            </div>
          </div>
          {/* <div className={qualifiedDeal ? css.shared : css.blank}>
            <span className={!title  ? css.sharedPercent : css.blank}>{creator.participantList[0].sharedPercent}%</span>
          </div> */}
        </div>
      </Collapsible>
    );
  }
};

export default compose(
  connect((state, { firstName, lastName }) => ({
    firstName: firstName || getFirstName(state),
    lastName: lastName || getLastName(state),
  })),
  branch(({ creator }) => !creator, renderNothing),
  pure
)(CreatorPane);
