// @flow
import React, { useState } from 'react';
import { compose, branch, renderComponent, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Avatar } from 'components';
import ReactCardFlip from 'react-card-flip';
import { Icon, Popup, Button } from 'semantic-ui-react';

import ContactPopup from 'components/Contact/ContactPopup';

import { ContactActionMenu } from 'essentials';
import FocusRelationship from '../../../components/Focus/FocusRelationship';
import * as contactActions from 'components/Contact/contact.actions';

import { makeGetContact } from 'components/Contact/contact.selector';

import cx from 'classnames';
import css from './ColleagueItem.css';
import starSvg from '../../../../public/myStar.svg';
import starActiveSvg from '../../../../public/myStar_active.png';

import qualifiedSvg from '../../../../public/Qualified_deals.svg';
import appointmentAdd from '../../../../public/Appointments.svg';
import taskAdd from '../../../../public/Tasks.svg';

import _l from 'lib/i18n';
import { withRouter } from 'react-router';
addTranslations({
  'en-US': {
    Responsible: 'Responsible',
    Reminders: 'Reminders',
    Qualified: 'Qualified',
    name: 'Name',
    'Resp.': 'Resp.',
  },
});

type PropsT = {
  contact: {},
  handleToggleFavorite: (event: Event) => void,
};

const ColleagueListHeader = ({ orderBy, setOrderBy }) => {
  return (
    <div className={cx(css.listItem, css.header)}>
      {/* <div className={css.avatar} /> */}
      <div
        style={{ flexDirection: 'row', paddingRight: 25 }}
        className={css.name}
        onClick={() => setOrderBy('contactName')}
      >
        {_l`name`}
        <span className={orderBy === 'contactName' ? `${css.activeIcon}` : `${css.normalIcon}`}>
          <i class="angle down icon"></i>
        </span>
      </div>
      <div style={{ width: 30 }} className={css.kpi} />
      <div className={css.kpi}></div>
      <div style={{ width: 38 }} className={css.avatar} onClick={() => setOrderBy('owner')}>
        {_l`Resp.`}
        <span className={orderBy === 'owner' ? `${css.activeIcon}` : `${css.normalIcon}`}>
          <i class="angle down icon"></i>
        </span>
      </div>
      <div className={css.button} />
    </div>
  );
};

const FavoriteIcon = <Icon name="star" color="yellow" />;
const NotFavoriteIcon = <Icon name="star outline" />;

const ColleagueItem = ({ contact, handleToggleFavorite, overviewType, history, route, style }: PropsT) => {
  const favoriteIton = contact.favorite ? FavoriteIcon : NotFavoriteIcon;
  const [isFlipAvatar, setIsFlipAvatar] = useState(false);

  let relationshipAccountColor = contact.relationship;

  let disc = '';
  let discDesc = '';
  if (contact.discProfile === 'NONE') {
    disc = '#ADADAD';
    discDesc = 'Behaviour not defined';
  } else if (contact.discProfile === 'BLUE') {
    disc = '#2F83EB';
    discDesc = 'Likes facts, quality and accuracy';
  } else if (contact.discProfile === 'RED') {
    disc = '#ed684e';
    discDesc = 'Likes to take quick decisions, to act and take lead';
  } else if (contact.discProfile === 'GREEN') {
    disc = '#A9D231';
    discDesc = 'Likes socialising, collaboration and security';
  } else if (contact.discProfile === 'YELLOW') {
    disc = '#F5B342';
    discDesc = 'Likes to convince, influence and inspire others';
  }

  return (
    <div
      style={style}
      onClick={() => {
        if (route) {
          history.push(`${route}/contact/${contact.uuid}`);
        }
      }}
      className={css.listItem}
    >
      {contact.avatar ? (
        <Popup
          hoverable
          style={{ zIndex: 9 }}
          trigger={
            <div className={css.avatar}>
              <ReactCardFlip isFlipped={isFlipAvatar} flipDirection="horizontal">
                <Avatar
                  onClick={() => setIsFlipAvatar(true)}
                  containerStyle={{ height: 38 }}
                  borderSize={3}
                  size={32}
                  src={contact.avatar}
                  border={contact.relationship}
                  fallbackIcon="user"
                />
                <Avatar
                  borderSize={3}
                  isFlip
                  onClick={() => setIsFlipAvatar(false)}
                  size={32}
                  border={contact.relationship || 'YELLOW'}
                  backgroundColor={disc}
                />
              </ReactCardFlip>
            </div>
          }
          position="top left"
        >
          <Popup.Content style={{ fontSize: 11 }}>
            {isFlipAvatar ? (
              discDesc
            ) : (
              <FocusRelationship
                noteStyle={{ marginTop: 5, lineHeight: '15px' }}
                styleBox={{ width: 15, height: 15 }}
                styleText={{ fontSize: 11, fontWeight: 300 }}
                discProfile={relationshipAccountColor}
              />
            )}
          </Popup.Content>
        </Popup>
      ) : (
        <div className={css.avatar}/>
      )}

      <div className={css.name}>
        {contact.displayName}
        {contact.title && <div className={css.organisation}>{contact.title}</div>}
      </div>
      <div style={{ width: 30 }} className={css.kpi}>
        {contact.name == null && contact.email == null ? (
          ''
        ) : (
          <ContactPopup name={contact.name} email={contact.email} phone={contact.phone} />
        )}
      </div>
      <div className={css.kpi}></div>
      {/* <div className={css.kpi}></div>
      <div className={css.kpi}></div> */}
      <div className={css.avatar}>
        <Avatar size={32} src={contact.owner.avatar} fallbackIcon="user" />
      </div>
      <div className={css.button}>
        <div style={{ backgroundColor: contact.favorite && '#fdf5e8' }} className={css.moreAction}>
          {!contact.favorite && <img src={starSvg} className={css.beStar} onClick={handleToggleFavorite} />}
          {contact.favorite && <img src={starActiveSvg} className={css.beStar} onClick={handleToggleFavorite} />}
        </div>
        <ContactActionMenu className={css.moreAction} contact={contact} overviewType={overviewType} />
      </div>
    </div>
  );
};

const makeMapStateToProps = () => {
  const getContact = makeGetContact();
  const mapStateToProps = (state, { contactId }) => ({
    contact: getContact(state, contactId),
  });
  return mapStateToProps;
};
const mapDispatchToProps = {
  toggleFavoriteRequest: contactActions.toggleFavoriteRequest,
};

export default compose(
  withRouter,
  branch(({ header }) => header, renderComponent(ColleagueListHeader)),
  connect(makeMapStateToProps, mapDispatchToProps),
  withHandlers({
    handleToggleFavorite: ({ toggleFavoriteRequest, contact }) => (event) => {
      event.stopPropagation();
      toggleFavoriteRequest(contact.uuid, !contact.favorite);
    },
  })
)(ColleagueItem);
