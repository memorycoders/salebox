//@flow
import * as React from 'react';
import { useState, useRef } from 'react'
import ReactCardFlip from 'react-card-flip';
import _l from 'lib/i18n';
import { branch, renderNothing, compose, pure, defaultProps, withHandlers } from 'recompose';
import cx from 'classnames';
import { Icon } from 'semantic-ui-react';
import Avatar from '../../Avatar/Avatar';
import css from './AccountPane.css';
import { Popup } from 'semantic-ui-react';
import moment from 'moment';
import contactAvatar from '../../../../public/Contacts.svg';
import accountAvatar from '../../../../public/Accounts.svg'
import FocusRelationship from '../../Focus/FocusRelationship';
import user from '../../../../public/user.svg';
import accountAdd from '../../../../public/Accounts.svg';
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

const AppointmentPane = ({ route, history, children, fallbackIconAccount, color, appointment }: PropsT) => {


  const contact = appointment.contactList && appointment.contactList.length > 0 ? appointment.contactList[0] : {};
  const account = appointment.organisation;
  let hasTitle = contact.title;
  const [open, setOpen] = useState(false);
  let displayName = `${contact.firstName ? contact.firstName : ''} ${contact.lastName ? contact.lastName : ''}`;
  let hasOrganisation = contact.organisation ? contact.organisation.name : '';
  let location = appointment.location;
  if (!appointment.location || appointment.location == '') {
    // Try to get contact address
    if (appointment.firstContactAddress) {
      location = appointment.firstContactAddress;
    } else if (appointment.organisation && appointment.organisation.fullAddress !== null) {
      location = appointment.organisation.fullAddress;
    }
  }

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


  const onlyAccount = !contact.uuid && account && account.uuid;
  let accountAvatar = '';
  if (onlyAccount) {
    displayName = account.name;

    if (account) {
      industry = account.industry ? account.industry.name : '';
      type = account.type ? account.type.name : '';
      accountAvatar = account.avatar;
    }
    hasTitle = '';
    hasOrganisation = '';
  }


  let relationshipAccountColor = 'YELLOW';
  if (contact) {
    const { relationship } = contact;
    relationshipAccountColor = relationship;
  }
  const shortenValue = (value) => {
    if (value && value.length > 100) {
      return value.slice(0, 100);
    }
    return value;
  };

  return (
    <div className={css.contactContainer}>
      <div className={cx(css.header, color)}>
        <div style={{ cursor: 'pointer' }} onClick={() => {
          if(contact.uuid){
            return history.push(`${route}/contact/${contact.uuid}`)
          }
          if (account.uuid) {
            return history.push(`${route}/account/${account.uuid}`)
          }
        }} className={css.heading}>{displayName}</div>
        <div className={onlyAccount ? css.contentAccount : css.contentContact}>
          {/* {hasTitle ? */}
            <div className={css.subHeading}>{`${contact.title || ''} `}
              <span style={{ fontWeight: '300', fontSize: '13px' }}>{contact.title && account ? ` ${_l`at`} ` : ''}</span>
              <span style={{ cursor: 'pointer' }} onClick={() => account && history.push(`${route}/account/${account.uuid}`)}>{account ? account.name : ''}</span>
              {contact.relation ? <span style={{ fontWeight: 300 }}>{` (${contact.relation.name})`}</span> : ''}</div>
            {/* : <div className={css.noneDiv}></div>} */}
          {/* {!hasTitle && hasOrganisation &&
            <div className={css.subHeading}>
              {hasOrganisation}
            </div>
          } */}
          <div className={css.subHeading}>
            {type && <span>{type}<span style={{ fontWeight: '300', fontSize: '13px' }}>{type && industry ? ` ${_l`in`} ` : ''}</span></span>}
            {industry && <span>{industry}</span>}

          </div>
        </div>
        <div className={css.contactDetails}>
          <ul>
            <li>
              <Icon name="calendar" />
              {moment(appointment.startDate).format('HH:mm DD MMM')} - {moment(appointment.endDate).format('HH:mm DD MMM, YYYY')}
            </li>
            <li style={{ display: 'flex', alignItems: 'center' }}>
              <img style={{ height: 13, marginRight: 5 }} src={require('../../../../public/dot-title.svg')} />
              {appointment.title && appointment.title.length > 0 ? (
                appointment.title.length > 100 ? (
                  <Popup
                    trigger={<div>{`${shortenValue(appointment.title)}...`}</div>}
                    style={{ fontSize: 11 }}
                    content={appointment.title} />
                ) : (
                    appointment.title
                  )
              ) : ('')}
            </li>
            <li>
              <Icon name="building" />
              {location}
            </li>
            {children}
          </ul>
        </div>
      </div>
      {contact.relationship ?
        (contact.avatar ?
          <Popup
            style={styleTooltip}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            className={css.popupAvatar}
            position='top center'
            trigger={<div className={css.centerImage} flipDirection="horizontal">
              <Avatar size={78}
                src={contact.avatar ? contact.avatar : accountAvatar}
                onClick={() => { }}
                fallbackIcon={fallbackIconAccount}
                border={(relationshipAccountColor) || 'YELLOW'}
              />
            </div>}
          >
            <Popup.Content>
              <FocusRelationship noteStyle={{ marginTop: 5, lineHeight: '15px' }} styleBox={{ width: 15, height: 15 }} styleText={{ fontSize: 11, fontWeight: 300 }} discProfile={relationshipAccountColor} />
            </Popup.Content>
          </Popup>
          : <Popup
            style={styleTooltip}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            className={css.popupAvatar}
            position='top center'
            trigger={<div className={css.centerImage} flipDirection="horizontal">
              <Avatar size={78}
                src={null}
                onClick={() => { }}
                fallbackIcon={fallbackIconAccount}
                border={(relationshipAccountColor) || 'YELLOW'}
              />
            </div>}
          >
            <Popup.Content>
              <FocusRelationship noteStyle={{ marginTop: 5, lineHeight: '15px' }} styleBox={{ width: 15, height: 15 }} styleText={{ fontSize: 11, fontWeight: 300 }} discProfile={relationshipAccountColor} />
            </Popup.Content>
          </Popup>)
        :
        (contact.avatar ?
          <div className={css.centerImage} flipDirection="horizontal">
            <Avatar size={78}
              src={contact.avatar ? contact.avatar : accountAvatar}
              onClick={() => { }}
              fallbackIcon={fallbackIconAccount}
              border={(relationshipAccountColor) || 'YELLOW'}
            />
          </div>
          : <div className={css.centerImage} flipDirection="horizontal">
            <Avatar size={78}
              src={null}
              onClick={() => { }}
              fallbackIcon={fallbackIconAccount}
              border={(relationshipAccountColor) || 'YELLOW'}
            />
          </div>
        )

      }
    </div>
  );
};

export default compose(
  defaultProps({
    fallbackIconContact: contactAvatar,
    fallbackIconAccount: accountAvatar,
  }),
  pure
)(AppointmentPane);
