// @flow
import React, { useState } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Popup, Image, List, Icon } from 'semantic-ui-react';
import ReactCardFlip from 'react-card-flip';
import { makeGetContact } from 'components/Contact/contact.selector';
import { getAvatarUrl } from 'lib';
import noneAvatar from '../../../../public/none_avatar.png';
import Avatar from 'components/Avatar/Avatar';
import FocusRelationship from 'components/Focus/FocusRelationship';
import type { ContactType } from 'components/Contact/contact.types';
import css from '../../User/CreatorPane/CreatorPane.css';
type PropsT = {
  contact: ContactType,
};

const doNothing = (event: Event) => {
  // event.preventDefault();
  event.stopPropagation();
};

const ContactAvatar = ({ contact }: PropsT) => {
  const [isFlipAvatar, setIsFlipAvatar] = useState(false);
  const [open, setOpen] = useState(false);
  const handleFlip = (type) => {
    setOpen(false);
    setIsFlipAvatar(type);
  };
  let discDesc = '';
  if (contact.discProfile === 'NONE') {
    discDesc = 'Behaviour not defined';
  } else if (contact.discProfile === 'BLUE') {
    discDesc = 'Likes facts, quality and accuracy';
  } else if (contact.discProfile === 'RED') {
    discDesc = 'Likes to take quick decisions, to act and take lead';
  } else if (contact.discProfile === 'GREEN') {
    discDesc = 'Likes socialising, collaboration and security';
  } else if (contact.discProfile === 'YELLOW') {
    discDesc = 'Likes to convince, influence and inspire others';
  }
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
  const { firstName, lastName, email, phone } = contact;

  const src = getAvatarUrl(contact.avatar);
  const firstNameChar = firstName != null && firstName.length > 0 ? firstName.charAt(0) : '';
  const lastNameChar = lastName != null && lastName.length > 0 ? lastName.charAt(0) : '';

  return (
    <div className={css.creatorPaneContainer}>
      <div className={css.avatar} onClick={() => {}} isFlipped={isFlipAvatar} flipDirection="horizontal">
        {discDesc ? (
          <Popup
            hoverable
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            trigger={
              <div className={css.nameShow} isFlipped={isFlipAvatar} flipDirection="horizontal">
                <ReactCardFlip isFlipped={isFlipAvatar} flipDirection="horizontal">
                  {contact.avatar ? (
                    <Avatar
                      onClick={() => handleFlip(true)}
                      size={60}
                      src={contact.avatar}
                      backgroundColor={getSourceColor(contact.discProfile)}
                      border={contact.relationship}
                    />
                  ) : (
                    <Avatar
                      isShowName
                      onClick={() => handleFlip(true)}
                      size={60}
                      // backgroundColor={getSourceColor(contact.discProfile)}
                      border={contact.relationship}
                      firstName={firstName}
                      lastName={lastName}
                    />
                  )}
                  <Avatar
                    border={contact.relationship}
                    isFlip
                    backgroundColor={getSourceColor(contact.discProfile)}
                    onClick={() => handleFlip(false)}
                    size={60}
                  />
                </ReactCardFlip>
                <div className={css.nameWapper}>
                  <div className={css.customName}>{contact.displayName} </div>
                </div>
              </div>
            }
            position="top center"
          >
            <Popup.Content>
              {isFlipAvatar ? (
                <div>
                  <span className={contact.discProfile === 'NONE' ? css.tooltipShortText : css.tooltip}>
                    {discDesc}
                  </span>
                </div>
              ) : (
                <FocusRelationship
                  noteStyle={{ marginTop: 5, lineHeight: '15px' }}
                  styleBox={{ width: 15, height: 15 }}
                  styleText={{ fontSize: 11, fontWeight: 300 }}
                  discProfile={contact.relationship}
                />
              )}
            </Popup.Content>
          </Popup>
        ) : (
          <div className={css.avatar} isFlipped={isFlipAvatar} flipDirection="horizontal">
            <ReactCardFlip isFlipped={isFlipAvatar} flipDirection="horizontal">
              {contact.avatar ? (
                <Avatar
                  onClick={() => handleFlip(true)}
                  size={60}
                  src={contact.avatar}
                  backgroundColor={getSourceColor(contact.discProfile)}
                  border={contact.relationship}
                />
              ) : (
                <Avatar
                  isShowName
                  onClick={() => handleFlip(true)}
                  size={60}
                  // backgroundColor={getSourceColor(contact.discProfile)}
                  border={contact.relationship}
                  firstName={firstName}
                  lastName={lastName}
                />
              )}
              <Avatar
                border={contact.relationship}
                isFlip
                backgroundColor={getSourceColor(contact.discProfile)}
                onClick={() => handleFlip(false)}
                size={60}
              />
            </ReactCardFlip>
          </div>
        )}
      </div>

      <div className={css.info}>
        <div className={css.creatorName}>
          {firstName} {lastName}
        </div>
        <List>
          {email && (
            <List.Item>
              <List.Icon name="envelope" />
              <List.Content>
                <a href={`mailto:${email}`}>{email}</a>
              </List.Content>
            </List.Item>
          )}
          {phone && (
            <List.Item>
              <List.Icon name="phone" />
              <List.Content>
                <a href={`tel:${phone}`}>{phone}</a>
              </List.Content>
            </List.Item>
          )}
        </List>
      </div>
    </div>
  );
};

export default compose()(ContactAvatar);
