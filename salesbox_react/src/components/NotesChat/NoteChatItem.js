import React, { useState } from 'react';
import Avatar from '../Avatar/Avatar';
import { List, Label } from 'semantic-ui-react';
import css from './NoteChatItem.css';
import moment from 'moment';

import taskIcon from '../../../public/Tasks_active.svg';
import contactIcon from '../../../public/Contacts_Active.svg';
import unqualifiedIcon from '../../../public/Unqualified_deals_active.svg';
import qualifiedIcon from '../../../public/Qualified_deals_active.svg';
import accountIcon from '../../../public/Accounts_Active.svg';
import appointmentIcon from '../../../public/Appointments_active.svg';

import ActionNote from './ActionNote.js';

const getIcon = (style) => {
  switch (style) {
    case 'building':
      return {
        icon: accountIcon,
        backgroundColor: 'rgba(95, 106, 124, .1)',
      };
    case 'calendar-check-o':
      return {
        icon: taskIcon,
        backgroundColor: '#fef9f0',
      };
    case 'calendar':
      return {
        icon: appointmentIcon,
        backgroundColor: '#f5f0e6',
      };
    case 'leads':
      return {
        icon: unqualifiedIcon,
        backgroundColor: '#fbe6e3',
      };
    case 'usd':
      return {
        icon: qualifiedIcon,
        backgroundColor: '#fbe6e3',
      };
    case 'user-o':
      return {
        icon: contactIcon,
        backgroundColor: 'rgb(235, 243, 240)',
      };
    default:
      return {
        icon: taskIcon,
        backgroundColor: '#fef9f0',
      };
  }
};

export const NoteChatItem = ({ note, overviewType, objectId }) => {
  const { authorAvatar, subject, content, authorFirstName, authorLastName, createdDate } = note;

  const maxLengthCotent = 80;
  const [collapseNote, setCollapseNote] = useState(true);
  const shortenContent = (value) => {
    if (value && value.length > maxLengthCotent) {
      return value.slice(0, maxLengthCotent);
    }
    return value;
  };
  const handleCollapseNote = () => {
    setCollapseNote(!collapseNote);
  };
  return (
    <div className={css.noteChat}>
      <div className={css.avatarContainer}>
        <Avatar
          size={30}
          isShowName
          firstName={authorFirstName}
          lastName={authorLastName}
          src={authorAvatar}
          fallbackIcon="building outline"
        />
        <ActionNote objectId={objectId} overviewType={overviewType} note={note} />
        <div>{moment(createdDate).format('HH:mm DD MMM, YYYY')}</div>
      </div>
      <div className={css.content}>
        <List className={css.listShow}>
          <List.Item>
            <Label className={css.labelContent} pointing="left">
              <div className={css.subject}> {subject}</div>
              {!content || (content && content.length <= maxLengthCotent) ? (
                <p style={{whiteSpace: 'pre-line'}}>{content}</p>
              ) : collapseNote ? (
                <div style={{whiteSpace: 'pre-line'}}>
                  {shortenContent(content)}
                  <a className={css.collapseNote} onClick={handleCollapseNote}>
                    {' '}
                    ...
                  </a>
                </div>
              ) : (
                <div style={{whiteSpace: 'pre-line'}}>
                  {content}{' '}
                  <a className={css.collapseNote} onClick={handleCollapseNote}>
                    ^
                  </a>
                </div>
              )}

              <div className={css.circleBig}>
                <div style={{ backgroundColor: getIcon(note.style).backgroundColor }} className={css.circle}>
                  <img style={{ height: 12, width: 12 }} src={getIcon(note.style).icon} />
                </div>
              </div>
            </Label>
          </List.Item>
        </List>
      </div>
    </div>
  );
};
