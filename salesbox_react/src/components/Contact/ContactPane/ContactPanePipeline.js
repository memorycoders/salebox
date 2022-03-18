//@flow
import * as React from 'react';
import { useState, useRef } from 'react'
import ReactCardFlip from 'react-card-flip';
import _l from 'lib/i18n';
import { branch, renderNothing, compose, pure, defaultProps, withHandlers } from 'recompose';
import cx from 'classnames';
import { Icon } from 'semantic-ui-react';
import Avatar from 'components/Avatar/Avatar';
import css from './ContactPane.css';
import { Popup } from 'semantic-ui-react';
import contactAvatar from '../../../../public/Contacts.svg';
import accountAvatar from '../../../../public/Accounts.svg'


const styleTooltip = {
  padding: '5px 20px',
  minHeight: 40,
  minWidth: 150
  // height: '40px',
  // maxHeight: 46,
  // display: 'flex!important',
  // alignItems: 'center',
  // justifyJcontent: 'center'
}

type PropsT = {
  contact: {},
  color: string,
  fallbackIconContact?: string,
  fallbackIconAccount?: string,
  children: React.Node,
};

const ContactPanePipeline = ({ children, fallbackIconContact, fallbackIconAccount, color, contact, organisation, task }: PropsT) => {

  const [isFlipAvatar, setIsFlipAvatar] = useState(false);
  const [open, setOpen] = useState(false);

  const handleFlip = type => {
    setOpen(false);
    setIsFlipAvatar(type);

  }
  let hasTitle = contact.title;
  let hasOrganisation = contact.organisation ? contact.organisation.name : '';
  const hasSize = contact.size && contact.size.name;
  let displayName = contact.displayName;
  let fullAddress = contact.fullAddress;
  let email = contact.email;
  let web = contact.web;
  let phone = contact.phone;
  let industry = contact.industry ? contact.industry.name : null;
  let type = contact.type ? contact.type.name : null;
  let disc = '';
  let discDesc = '';
  if (contact.discProfile === "NONE") {
    disc = '#ADADAD';
    discDesc = 'Behaviour not defined';
  } else if (contact.discProfile === 'BLUE') {
    disc = '#2F83EB';
    discDesc = 'Likes facts, quality and accuracy';
  } else if (contact.discProfile === 'RED') {
    disc = '#ed684e'
    discDesc = 'Likes to take quick decisions, to act and take lead'
  } else if (contact.discProfile === 'GREEN') {
    disc = '#A9D231'
    discDesc = 'Likes socialising, collaboration and security'
  } else if (contact.discProfile === 'YELLOW') {
    disc = '#F5B342'
    discDesc = 'Likes to convince, influence and inspire others'
  }
  let colorRela = '';
  let relaDesc = '';
  if (contact.relationship === "NONE") {
    colorRela = 'None'
    relaDesc = 'Relationship is undefined'
  } else if (contact.relationship === "RED") {
    colorRela = 'Red'
    relaDesc = 'Relationship is bad'
  } else if (contact.relationship === "GREEN") {
    colorRela = 'Green'
    relaDesc = 'Relationship is good'
  } else if (contact.relationship === "YELLOW") {
    colorRela = 'Yellow'
    relaDesc = 'Relationship is neutral'
  }


  if (contact.displayName === undefined) {
    displayName = organisation.displayName;
    fullAddress = organisation.fullAddress;
    email = organisation.email;
    web = organisation.web;
    phone = organisation.phone;
    industry = '';
    type = null;
    hasTitle = '';
    hasOrganisation = '';
  }

  if (organisation.displayName === undefined && contact.displayName === undefined) {
    displayName = "No account/contact connected";
  }

  // logic for only account
  // const { contactId, organisation: account } = task;
  const onlyAccount = false;



  // let relationshipAccountColor = 'YELLOW';
  // if (account) {
  //     const { relationship } = account;
  //     if (parseFloat(relationship) < -0.25) {
  //         relationshipAccountColor = 'RED';
  //     } else if (parseFloat(relationship) <= 0.25) {
  //         relationshipAccountColor = 'YELLOW';
  //     } else if (parseFloat(relationship) > 0.25) {
  //         relationshipAccountColor = 'GREEN';
  //     }
  // }


  return (
    <div className={css.contactContainer}>
      <div className={cx(css.header, color)}>
        <div className={css.heading}>{displayName}</div>
        <div className={onlyAccount ? css.contentAccount : css.contentContact}>
          {hasTitle ?
            <div className={css.subHeading}>{`${contact.title} `}
              <span style={{ fontWeight: '300', fontSize: '13px' }}>{type && industry ? ` ${_l`at`} ` : ''}</span>
              {contact.organisation.name}
              {contact.relation ? <span style={{ fontWeight: 300 }}>{` (${contact.relation.name})`}</span> : ''}</div>
            : <div className={css.noneDiv}></div>}
          {!hasTitle && hasOrganisation &&
            <div className={css.subHeading}>
              {hasOrganisation}
            </div>
          }
          <div className={css.subHeading}>
            {type && <span>{type}<span style={{ fontWeight: '300', fontSize: '13px' }}>{type && industry ? ` ${_l`in`} ` : ''}</span></span>}
            {industry && <span>{industry}</span>}

          </div>
        </div>
        <div className={css.contactDetails}>
          <ul>
            {hasSize && (
              <li>
                <Icon name="users" />
                {contact.size.name}
              </li>
            )}
            <li>
              {onlyAccount ? <Icon name="world" /> : <div></div>}
              {web && (
                <a target="_blank" href={`${web.includes('http') ? web : `http://${web}`}`}>{web}</a>
              )}
            </li>
            <li>
              <Icon name="phone" />
              <a href={`tel:${phone}`}>{phone}</a>
            </li>
            <li>
              <Icon name="envelope" />
              <a href={`mailto:${email}`}>{email}</a>
            </li>
            <li>
              <Icon name="building" />
              {fullAddress}
            </li>
            {children}
          </ul>
        </div>
      </div>
      {relaDesc ? <Popup
        style={styleTooltip}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        className={css.popupAvatar}
        position='top center'
        trigger={<div className={css.centerImage} isFlipped={isFlipAvatar} flipDirection="horizontal">
          <ReactCardFlip isFlipped={isFlipAvatar} flipDirection="horizontal">
            <Avatar size={78}
              src={contact.avatar ? contact.avatar : ''}
              onClick={() => !onlyAccount && handleFlip(true)}
              fallbackIcon={onlyAccount ? fallbackIconAccount : fallbackIconContact}
              border={(onlyAccount ? relationshipAccountColor : contact.relationship) || 'YELLOW'}
            />
            <Avatar isFlip onClick={() => handleFlip(false)} size={78}
              border={(onlyAccount ? relationshipAccountColor : contact.relationship) || 'YELLOW'}
              backgroundColor={disc} />
          </ReactCardFlip>
        </div>}
      >
        <Popup.Content>
          {isFlipAvatar ?
            <span className={contact.discProfile === "NONE" ? css.tooltipShortText : css.tooltip}>
              {_l`${discDesc}`}
            </span>
            : <>
              <span className={css.headerFont}>
              {_l`${colorRela}`}
              </span><span className={css.relationFont}>: {_l`${relaDesc}`}</span>
            </>}
        </Popup.Content>
      </Popup> : <div className={css.centerImage} isFlipped={isFlipAvatar} flipDirection="horizontal">
          <ReactCardFlip isFlipped={isFlipAvatar} flipDirection="horizontal">
            <Avatar size={78}
              src={contact.avatar}
              fallbackIcon={onlyAccount ? fallbackIconAccount : fallbackIconContact}
              border={(onlyAccount ? relationshipAccountColor : contact.relationship) || 'YELLOW'}
              onClick={() => !onlyAccount && handleFlip(true)} />
            <Avatar isFlip onClick={() => handleFlip(false)} size={78}
              border={(onlyAccount ? relationshipAccountColor : contact.relationship) || 'YELLOW'}
              backgroundColor={disc} />
          </ReactCardFlip>
        </div>}

    </div>
  );
};

export default compose(
  defaultProps({
    fallbackIconContact: contactAvatar,
    fallbackIconAccount: accountAvatar,
  }),
  branch(({ contact }) => !contact, renderNothing),
  pure
)(ContactPanePipeline);
