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

const AccountPane = ({ children, fallbackIconAccount, color, account, history, fromTask, route }: PropsT) => {

  console.log('day chinh la; ', account)

  const [open, setOpen] = useState(false);
  let displayName = account.name;
  let fullAddress = account.fullAddress;
  let hasSize = account.size ? account.size.name : '';
  let email = account.email;
  let web = account.web;
  let phone = account.phone;
  let industry = account.industry ? account.industry.name : null;
  let type = account.type ? account.type.name : null;

  let relationshipAccountColor = 'YELLOW';
  if (account) {
    const { relationship } = account;
    relationshipAccountColor = relationship;
  }

  return (
    <div className={css.contactContainer}>
      <div style={{ cursor: 'pointer'}} className={cx(css.header, color)}>
        <div onClick={()=> {
          if (route){
            history.push(`${route}/account/${account.uuid}`)
          }
        }} className={css.heading}>{displayName}</div>
        <div className={css.contentAccount}>
          <div className={css.subHeading}>
            {type && <span>{type}<span style={{ fontWeight: '300', fontSize: '13px' }}>{type && industry ? ' in ' : ''}</span></span>}
            {industry && <span>{industry}</span>}

          </div>
        </div>
        <div className={css.contactDetails}>
          <ul>
            <li>
              <Icon name="users" />
              {hasSize}
            </li>
            <li>
              <Icon name="world" />
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
      {account.relationship ?
        <Popup
          style={styleTooltip}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          className={css.popupAvatar}
          position='top center'
          trigger={<div className={css.centerImage} flipDirection="horizontal">
            <Avatar size={78}
              src={account.avatar}
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
        :
        (
          <div className={css.centerImage} flipDirection="horizontal">
            <Avatar size={78}
              src={account.avatar ? account.avatar : accountAvatar}
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
  branch(({ account }) => !account, renderNothing),
  pure
)(AccountPane);
