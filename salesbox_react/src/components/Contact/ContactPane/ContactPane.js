//@flow
import * as React from 'react';
import { useState, useRef } from 'react';
import ReactCardFlip from 'react-card-flip';
import _l from 'lib/i18n';
import { branch, renderNothing, compose, pure, defaultProps, withHandlers } from 'recompose';
import cx from 'classnames';
import { Icon, Popup } from 'semantic-ui-react';
import Avatar from '../../Avatar/Avatar';
import css from './ContactPane.css';
import contactAvatar from '../../../../public/Contacts.svg';
import accountAvatar from '../../../../public/Accounts.svg';
import commonCss from '../../Common/Common.css';

import { ObjectTypes, OverviewTypes, CssNames } from 'Constants';


const styleTooltip = {
  padding: '5px 20px',
  minHeight: 40,
  minWidth: 150,
  // height: '40px',
  // maxHeight: 46,
  // display: 'flex!important',
  // alignItems: 'center',
  // justifyJcontent: 'center'
};

type PropsT = {
  contact: {},
  color: string,
  fallbackIconContact?: string,
  fallbackIconAccount?: string,
  children: React.Node,
};

const ContactPane = ({
  routing,
  history,
  children,
  fallbackIconContact,
  fallbackIconAccount,
  color,
  contact,
  organisation,
  task,
  __DETAIL,
                       isContactDeatail,
}: PropsT) => {
  const [isFlipAvatar, setIsFlipAvatar] = useState(false);
  const [open, setOpen] = useState(false);
  const pupupRef = useRef(null);

  const handleFlip = (type) => {
    setOpen(false);
    setIsFlipAvatar(type);
  };
  console.log("🚀 ~ file: ContactPane.js ~ line 60 ~ contact", contact)

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

  // only for task detail
  if (__DETAIL) {
    const { contactDTO, organisationDTO } = __DETAIL;

    hasTitle = (contactDTO || {}).title;
    industry = (contactDTO || {}).industry ? contactDTO.industry.name : null;
    type = (contactDTO || {}).type ? contactDTO.type.name : null;
    hasOrganisation = organisationDTO ? organisationDTO.name : '';
  }

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
  let colorRela = '';
  let relaDesc = '';
  if (contact.relationship === 'NONE') {
    colorRela = 'None';
    relaDesc = 'Relationship is undefined';
  } else if (contact.relationship === 'RED') {
    colorRela = 'Red';
    relaDesc = 'Relationship is bad';
  } else if (contact.relationship === 'GREEN') {
    colorRela = 'Green';
    relaDesc = 'Relationship is good';
  } else if (contact.relationship === 'YELLOW') {
    colorRela = 'Yellow';
    relaDesc = 'Relationship is neutral';
  }

  if (organisation.displayName === undefined && contact.displayName === undefined) {
    displayName = 'No account/contact connected';
  }

  // logic for only account
  let onlyAccount = false;
  let relationshipAccountColor = 'YELLOW';
  if (task) {
    const { contactId, organisation: account, organisationDTO } = task;
    const onlyAccount = !contactId && account && account.uuid && !__DETAIL.contactDTO;
    let accountAvatar = '';
    if (onlyAccount) {
      displayName = organisation.displayName;
      fullAddress = organisation.fullAddress
        ? organisation.fullAddress
        : organisationDTO
        ? organisationDTO.fullAddress
        : '';
      email = organisation.email ? organisation.email : organisationDTO ? organisationDTO.email : '';
      web = organisation.web ? organisation.web : organisationDTO ? organisationDTO.web : '';
      phone = organisation.phone ? organisation.phone : organisationDTO ? organisationDTO.phone : '';
      if (organisationDTO) {
        industry = organisationDTO.industry ? organisationDTO.industry.name : '';
        type = organisationDTO.type ? organisationDTO.type.name : '';
        accountAvatar = organisationDTO.avatar;
      }
      hasTitle = '';
      hasOrganisation = '';
    }

    if (account) {
      const { relationship } = account;
      relationshipAccountColor = relationship;
    }
  }

  const MAX_LENGTH = 50;
  const shortenName = (name) => {
    if (name && name.length > 30) {
      return name.slice(0, 30);
    }
    return name;
  };
  return (
    <div className={css.contactContainer}>
      <div className={cx(css.header, color)}>
        {displayName && displayName.length > MAX_LENGTH ? (
          <Popup
            position="top center"
            style={{ fontSize: 11, fontWeight: '400', width: '100% !important', wordBreak: 'break-all' }}
            content={displayName}
            trigger={
              <div
                style={{ cursor: 'pointer', wordBreak: 'break-all' }}
                onClick={() => {
                  if (onlyAccount) {
                    routing('ACCOUNT');
                  } else if(!isContactDeatail){
                    routing('CONTACT');
                  }
                }}
                className={css.heading}
              >
                {`${shortenName(displayName)}...`}
              </div>
            }
          />
        ) : (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (onlyAccount) {
                routing('ACCOUNT');
              } else if(!isContactDeatail) {
                routing('CONTACT');
              }
            }}
            className={css.heading}
          >
            {displayName}
          </div>
        )}

        <div className={onlyAccount ? css.contentAccount : css.contentContact}>
          {hasTitle ? (
            <div className={css.subHeading}>
              {`${hasTitle} `}
              <span style={{ fontWeight: '300', fontSize: '13px' }}>
                {hasTitle && hasOrganisation ? ` ${_l`at`} ` : ''}
              </span>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  routing('ACCOUNT');
                }}
              >
                {hasOrganisation}
              </span>
              {contact.relation ? <span style={{ fontWeight: 300 }}>{` (${contact.relation.name})`}</span> : ''}
            </div>
          ) : (
            <div className={css.noneDiv}></div>
          )}
          {!hasTitle && hasOrganisation && <div className={css.subHeading}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                  routing('ACCOUNT');
                                                }}
          >{hasOrganisation}</div>}
          <div className={css.subHeading}>
            {type && (
              <span>
                {type}
                <span style={{ fontWeight: '300', fontSize: '13px' }}>
                  {type && industry ? ` ${_l`in`} ` : ''}
                </span>
              </span>
            )}
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
                <a target="_blank" href={`${web.includes('http') ? web : `http://${web}`}`}>
                  {web}
                </a>
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
      {relaDesc ? (
        <Popup
          style={styleTooltip}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          className={css.popupAvatar}
          position="top center"
          trigger={
            <div className={css.centerImage} isFlipped={isFlipAvatar} flipDirection="horizontal">
              <ReactCardFlip isFlipped={isFlipAvatar} flipDirection="horizontal">
                <Avatar
                  size={78}
                  src={contact.avatar ? contact.avatar : contactAvatar}
                  onClick={() => !onlyAccount && handleFlip(true)}
                  fallbackIcon={onlyAccount ? fallbackIconAccount : fallbackIconContact}
                  border={(onlyAccount ? relationshipAccountColor : contact.relationship) || 'YELLOW'}
                />
                <Avatar
                  isFlip
                  onClick={() => handleFlip(false)}
                  size={78}
                  border={(onlyAccount ? relationshipAccountColor : contact.relationship) || 'YELLOW'}
                  backgroundColor={disc}
                />
              </ReactCardFlip>
            </div>
          }
        >
          <Popup.Content>
            {isFlipAvatar ? (
              <span className={contact.discProfile === 'NONE' ? css.tooltipShortText : css.tooltip}>
                {_l`${discDesc}`}
              </span>
            ) : (
              <>
                <span className={css.headerFont}>{_l`${colorRela}`}</span>
                <span className={css.relationFont}>: {_l`${relaDesc}`}</span>
              </>
            )}
          </Popup.Content>
        </Popup>
      ) : (
        <div className={css.centerImage} isFlipped={isFlipAvatar} flipDirection="horizontal">
          <ReactCardFlip isFlipped={isFlipAvatar} flipDirection="horizontal">
            <Avatar
              size={78}
              src={contact.avatar ? contact.avatar : contactAvatar}
              fallbackIcon={onlyAccount ? fallbackIconAccount : fallbackIconContact}
              border={(onlyAccount ? relationshipAccountColor : contact.relationship) || 'YELLOW'}
              onClick={() => !onlyAccount && handleFlip(true)}
            />
            <Avatar
              isFlip
              onClick={() => handleFlip(false)}
              size={78}
              border={(onlyAccount ? relationshipAccountColor : contact.relationship) || 'YELLOW'}
              backgroundColor={disc}
            />
          </ReactCardFlip>
        </div>
      )}
    </div>
  );
};

export default compose(
  defaultProps({
    fallbackIconContact: contactAvatar,
    fallbackIconAccount: accountAvatar,
  }),
  branch(({ contact }) => !contact, renderNothing),
  pure,
  withHandlers({
    routing: ({ __DETAIL, history, contact, route }) => (type) => {
      if (__DETAIL) {
        const { contactDTO, organisationDTO } = __DETAIL;

        if (type === 'CONTACT') {
          if (contactDTO) {
            history.push(`${route}/contact/${contactDTO.uuid}`);
          } else if (!contactDTO && organisationDTO) {
            history.push(`${route}/account/${organisationDTO.uuid}`);
          }
        } else {
          history.push(`${route}/account/${organisationDTO.uuid}`);
        }

        return;
      }
      if (contact) {
        const { organisation } = contact;
        if (type === 'CONTACT') {
          history.push(`${route}/contact/${contact.uuid}`);
        } else {
          if (organisation) history.push(`${route}/account/${organisation.uuid}`);
        }
        return;
      }
    },
  })
)(ContactPane);
