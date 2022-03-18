//@flow
import React, { useState } from 'react';
import _l from 'lib/i18n';
import { Header, List, Popup } from 'semantic-ui-react';
import ReactCardFlip from 'react-card-flip';
import { connect } from 'react-redux';
import Avatar from 'components/Avatar/Avatar';
import { branch, renderNothing, compose, pure } from 'recompose';
import Collapsible from 'components/Collapsible/Collapsible';
import css from './CreatorPane.css';
import { WIDTH_DEFINE } from '../../../Constants';
import noneAvatar from '../../../../public/none_avatar.png';
import { getFirstName, getLastName } from 'components/Auth/auth.selector';
import { withRouter } from 'react-router';

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
  },
});

const CreatorQualifiedPane = ({ creator, avatar, size, title, qualifiedDeal, route, history }: PropsT) => {
  const creatorLength = ' (' + creator.length + ')';
  const firstNameChar = creator.firstName != null && creator.firstName.length > 0 ? creator.firstName.charAt(0) : '';
  const lastNameChar = creator.lastName != null && creator.lastName.length > 0 ? creator.lastName.charAt(0) : '';
  const [isFlipAvatar, setIsFlipAvatar] = useState(false);
  const [open, setOpen] = useState(false);
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
        {(creator ? creator : []).map((cr) => {
          return (
            <div>
              {cr.avatar ? (
                <Avatar onClick={() => setIsFlipAvatar(true)} size={size || 30} src={cr.avatar} />
              ) : (
                <div className={css.container} onClick={() => setIsFlipAvatar(true)}>
                  <img src={noneAvatar} style={{ width: '34px' }} />
                  <div className={css.nameOfImage}>
                    {firstNameChar}
                    {lastNameChar}
                  </div>
                </div>
              )}
              <Avatar
                isFlip
                backgroundColor={getSourceColor(cr.discProfile)}
                onClick={() => setIsFlipAvatar(false)}
                size={size || 30}
              />
            </div>
          );
        })}
      </ReactCardFlip>
    );
  } else {
    return (
      <Collapsible
        hasDragable
        width={WIDTH_DEFINE.DETAIL_WIDTH_CONTENT}
        padded
        flex
        horizontal
        title={title ? title + creatorLength : _l`Responsible` + creatorLength}
      >
        {(creator ? creator : []).map((cr) => {
          const positionCr = creator.indexOf(cr);
          const firstNameChar = cr.firstName != null && cr.firstName.length > 0 ? cr.firstName.charAt(0) : '';
          const lastNameChar = cr.lastName != null && cr.lastName.length > 0 ? cr.lastName.charAt(0) : '';

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
            <div className={css.creatorPaneContainer}>
              <div className={css.avatar}>
                <ReactCardFlip isFlipped={isFlipAvatar} flipDirection="horizontal">
                  {cr.avatar ? (
                    <Avatar
                      firstName={cr.firstName}
                      lastName={cr.lastName}
                      isShowName
                      onClick={() => handleFlip(true)}
                      size={size || 60}
                      src={cr.avatar}
                      border={title ? cr.relationship : ''}
                    />
                  ) : (
                    <div className={css.container} onClick={() => handleFlip(true)}>
                      <img src={noneAvatar} style={{ width: '43px' }} />
                      <div className={css.nameOfImage}>
                        {firstNameChar}
                        {lastNameChar}
                      </div>
                    </div>
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
                          backgroundColor={getSourceColor(cr.discProfile)}
                          onClick={() => handleFlip(false)}
                          size={size || 30}
                        />
                      </div>
                    }
                  >
                    <Popup.Content>
                      <span>{getSourceMess(cr.discProfile)}</span>
                    </Popup.Content>
                  </Popup>
                </ReactCardFlip>
              </div>
              <div className={css.info}>
                <div
                  className={positionCr == 0 ? css.creatorNameFirst : css.creatorName}
                  onClick={() => {
                    if (route && title) {
                      history.push(`${route}/contact/${cr.uuid}`);
                    }
                  }}
                >
                  {cr.name
                    ? cr.name
                    : cr.firstName && cr.lastName
                    ? cr.firstName + ' ' + cr.lastName
                    : cr.firstName
                    ? cr.firstName
                    : cr.lastName
                    ? cr.lastName
                    : ''}
                </div>
                <div className={css.moreInfo}>
                  <List>
                    {cr.email && (
                      <List.Item>
                        <List.Icon name="envelope" />
                        <List.Content>
                          <a className={css.shortInfor} href={`mailto:${cr.email}`} target="blank">
                            {cr.email}
                          </a>
                        </List.Content>
                      </List.Item>
                    )}
                    {cr.phone && (
                      <List.Item>
                        <List.Icon name="phone" />
                        <List.Content>
                          <a className={css.shortInfor} href={`tel:${cr.phone}`}>
                            {cr.phone}
                          </a>
                        </List.Content>
                      </List.Item>
                    )}
                  </List>
                </div>
              </div>
              <div className={cr ? css.shared : css.blank}>
                <span className={!title && cr ? css.sharedPercent : css.blank}>{cr.sharedPercent}%</span>
              </div>
            </div>
          );
        })}
      </Collapsible>
    );
  }
};

export default compose(
  withRouter,
  connect((state) => ({
    firstName: getFirstName(state),
    lastName: getLastName(state),
  })),
  branch(({ creator }) => !creator, renderNothing),
  pure
)(CreatorQualifiedPane);
