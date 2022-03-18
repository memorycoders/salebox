//@flow
import * as React from 'react';
import { connect } from 'react-redux';
import { useState } from 'react';
import { compose, withHandlers, branch, renderNothing } from 'recompose';
import { withRouter } from 'react-router';
import { ContentLoader } from 'components/Svg';

import { isItemSelected, isItemHighlighted, isShowSpiner } from 'components/Overview/overview.selectors';
import { makeGetContact } from './contact.selector';
import ReactCardFlip from 'react-card-flip';

import ContactPopup from 'components/Contact/ContactPopup';
import { Grid, Icon, Checkbox, Popup } from 'semantic-ui-react';
import { Avatar } from 'components';
import moment from 'moment';
import * as OverviewActions from 'components/Overview/overview.actions';
import FocusRelationship from '../Focus/FocusRelationship';
import { ContactActionMenu } from 'essentials';
import * as contactActions from 'components/Contact/contact.actions';
import cx from 'classnames';
import overviewCss from 'components/Overview/Overview.css';
import css from './ContactListRow.css';
import smsSvg from '../../../public/sms.svg';
import starSvg from '../../../public/myStar.svg';
import starActiveSvg from '../../../public/myStar_active.png';
import answerCallSvg from '../../../public/answer_call.svg';
import unAnswerCallSvg from '../../../public/unanswer_call.svg';
import CreatorPane from '../User/CreatorPane/CreatorPane';
import teamChat from '../../../public/msTeams_not_connect.png';


type PropsType = {
  contact: {},
  className?: string,
  selected: boolean,
  highlighted: boolean,
  style: {},
  goto: () => void,
  select: (event: Event, { checked: boolean }) => void,
  handleToggleFavorite: (event: Event) => void,
};

type PlaceholderPropsType = {
  className: string,
  style: {},
};

type HeaderPropsType = {
  overviewType: string,
};

const checkLoader = (
  <ContentLoader width={48} height={48}>
    <rect x={12} y={12} rx={4} ry={4} width={24} height={24} />
  </ContentLoader>
);

const noteLoader = (
  <ContentLoader width={200} height={48}>
    <rect x={8} y={16} rx={4} ry={4} width={200 - 16} height={8} />
  </ContentLoader>
);

const daysLoader = (
  <ContentLoader width={32} height={44}>
    <rect x={8} y={16} rx={4} ry={4} width={16} height={8} />
  </ContentLoader>
);

import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    Reminder: 'Reminder',
    Call: 'Call',
    Dial: 'Dial',
    Email: 'Email',
    Note: 'Note',
    Updated: 'Updated',
    SMS: 'SMS',
    Facetime: 'Facetime',
    Document: 'Document',
    Photo: 'Photo',
    'Won deal': 'Won deal',
    'Qualified ': 'Qualified ',
    Unqualified: 'Unqualified',
    Added: 'Added',
    'View details': 'View details',
  },
});

const getRecentActionTranslations = () => ({
  TASK: _l`Reminder`,
  '0': _l`Call`,
  '1': _l`Dial`,
  '2': _l`Email`,
  '7': _l`Received email`,
  '6': _l`Sent email`,
  '5': _l`Video call`,
  '8': _l`Chat`,
  '4': _l`Video dial`,
  NOTE: _l`Note`,
  EDIT: _l`Updated`,
  '3': _l`SMS`,
  FACE_TIME: _l`Facetime`,
  PROGRESS: _l`Deal progress`,
  DOCUMENT: _l`Document`,
  PHOTO: _l`Photo`,
  WON_OPPORTUNITY: _l`Won deal`,
  LOST_OPPORTUNITY: _l`Lost deal`,
  OPPORTUNITY: _l`Deals`,
  LEAD: _l`Prospect`,
  ADD_TO_OBJECT_USER_LIST: _l`Added`,
  APPOINTMENT: _l`Meeting`,
  VIEW_DETAILS: _l`View details`,
});

const CommunicationTypes = {
  Email: {
    Sender: 6,
    Receiver: 7,
    Unknown: 2,
  },
  Dial: 1,
  SMS: 3,
  Chat: 8,
  Call: 0,
  Video: 5,
  FaceTime: 4,
};

const translateRC = (message) => getRecentActionTranslations()[message] || message;

export const PlaceholderComponent = ({ className, style }: PlaceholderPropsType) => {
  return (
    <div className={cx(css.loading, className)} style={style}>
      <div className={css.check}>{checkLoader}</div>
      <div className={css.source}>{daysLoader}</div>
      <div className={css.contact}>{noteLoader}</div>
      <div className={css.lastestAction}>{noteLoader}</div>
      <div className={css.email}>{checkLoader}</div>
      <div className={css.days}>{checkLoader}</div>
      <div className={css.source}>{daysLoader}</div>
      <div className={css.more}>{checkLoader}</div>
    </div>
  );
};

const InfiniteContactListRow = ({
  handleToggleFavorite,
  select,
  highlighted,
  contact,
  style,
  className,
  goto,
  selected,
  overviewType,
  showSpiner,
}: PropsType) => {
  const [isFlipAvatar, setIsFlipAvatar] = useState(false);
  const [open, setOpen] = useState(false);
  const handleFlip = (type) => {
    setOpen(false);
    setIsFlipAvatar(type);
  };
  const styleAccountRowTheme = {
    // "color": "#5F6A7B",
    fontWeight: '300',
    fontSize: '11',
  };

  const listCn = cx(className, {
    [overviewCss.highlighted]: highlighted,
    [overviewCss.selected]: selected,
  });

  let recentActionTypeIcon = null;
  const { communicationHistoryLatest } = contact;
  const { chStartDate, chType, chTypeName } = communicationHistoryLatest || {};

  recentActionTypeIcon =
    chType === CommunicationTypes.Call || chType === CommunicationTypes.Video
      ? answerCallSvg
      : chType === CommunicationTypes.Dial || chType === CommunicationTypes.FaceTime
      ? unAnswerCallSvg
      : chType === CommunicationTypes.Chat
      ? teamChat
      : chType === CommunicationTypes.Email.Receiver
      ? 'rgb(76,139,196)'
      : chType === CommunicationTypes.Email.Sender || chType === CommunicationTypes.Email.Unknown
      ? 'rgb(111,189,209)'
      : chType === CommunicationTypes.SMS
      ? smsSvg
      : null;
  const isUsingIcon =
    chType === CommunicationTypes.Email.Receiver ||
    chType === CommunicationTypes.Email.Sender ||
    chType === CommunicationTypes.Email.Unknown;
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
  let relationshipAccountColor = 'YELLOW';
  if (contact) {
    const { relationship } = contact;
    relationshipAccountColor = relationship
  }
  let limitContact = 0;
  let limitAccount = 0;
  let limitTitle = 0;
  let url = window.location.pathname;
  let screen_width = window.innerWidth;

  if (screen_width >= 1920) {
    if (url.length > 10) {
      limitContact = 72;
      limitAccount = 33;
      limitTitle = 66;
    } else {
      limitContact = 100;
      limitAccount = 40;
      limitTitle = 66;
    }
  } else if (screen_width > 1580 && screen_width < 1920) {
    if (url.length > 10) {
      limitContact = 52;
      limitAccount = 35;
      limitTitle = 48;
    } else {
      limitContact = 80;
      limitAccount = 30;
      limitTitle = 66;
    }
  } else if (screen_width <= 1580) {
    if (url.length > 10) {
      limitContact = 30;
      limitAccount = 22;
      limitTitle = 27;
    } else {
      limitContact = 52;
      limitAccount = 37;
      limitTitle = 55;
    }
  }
  let str = contact?.organisation?.displayName ? contact?.organisation?.displayName : null;
  let accountName = str ? str.trim() : '';
  // const MAX_LENGTH_NAME = 50;
  const shortenValueContactName = (value) => {
    if (value && value.length > limitContact) {
      return value.slice(0, limitContact);
    }
    return value;
  };
  const shortenValueTitle = (value) => {
    if (value && value.length > limitTitle) {
      return value.slice(0, limitTitle);
    }
    return value;
  };
  const shortenValueAccountName = (value) => {
    if (value && value.length > limitAccount) {
      return value.slice(0, limitAccount);
    }
    return value;
  };

  return (
    <div className={`${listCn} ${css.itemRow}`} style={style} onClick={goto}>
      <div className={css.content}>
        <div className={css.check}>
          <Checkbox onChange={select} checked={selected} />
        </div>
        {/* {showSpiner && <div className={css.check} />} */}
        <div className={css.contact} onClick={() => {}} style={{ display: 'flex', alignItems: 'center' }}>
          <Popup
            hoverable
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            trigger={
              <div className={css.nameShow} isFlipped={isFlipAvatar} flipDirection="horizontal">
                <ReactCardFlip isFlipped={isFlipAvatar} flipDirection="horizontal">
                  <Avatar
                    onClick={() => handleFlip(true)}
                    overviewType={overviewType}
                    borderSize={4}
                    size={30}
                    isShowName
                    firstName={contact.firstName}
                    lastName={contact.lastName}
                    src={contact.avatar ? contact.avatar : null}
                    fallbackIcon="building outline"
                    border={relationshipAccountColor}
                  />
                  <Avatar
                    isFlip
                    onClick={() => handleFlip(false)}
                    size={30}
                    borderSize={4}
                    border={relationshipAccountColor}
                    backgroundColor={disc}
                  />
                </ReactCardFlip>
              </div>
            }
            position="top left"
          >
            <Popup.Content>
              {isFlipAvatar ? (
                <div>
                  <span className={css.relationFont}>{discDesc}</span>
                </div>
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
          <div className={css.nameWapper}>
            {contact.displayName && contact.displayName.length > limitContact ? (
              <Popup
                style={{ fontSize: 11, fontWeight: '400', width: '100% !important', wordBreak: 'break-all' }}
                trigger={<div className={css.customName}>{`${shortenValueContactName(contact.displayName)}...`}</div>}
                content={<div className={css.customName}>{contact.displayName}</div>}
              />
            ) : (
              <div className={css.customName}>{contact.displayName}</div>
            )}

            <div>
              {contact.organisation && contact.organisation.displayName ? (
                accountName.length > limitAccount ? (
                  <Popup
                    style={{ fontSize: 11, fontWeight: '400', width: '100% !important', wordBreak: 'break-all' }}
                    trigger={<div>{`${shortenValueAccountName(accountName)}...`}</div>}
                    content={<div>{accountName}</div>}
                  />
                ) : (
                  <div>{accountName}</div>
                )
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        {contact.email || contact.phone ? (
          <div className={css.email}>
            <ContactPopup name={contact.displayName} email={contact.email} phone={contact.phone} />
          </div>
        ) : (
          <div className={css.email}></div>
        )}

        <div className={css.lastestAction}>
          <div className={css.lastestContent}>
            {recentActionTypeIcon && !isUsingIcon && <img className={css.icon} src={recentActionTypeIcon} />}
            {isUsingIcon && <Icon className={css.icon} style={{ color: recentActionTypeIcon }} name={'mail'} />}
            <div className={css.lastestInfo}>
              {chStartDate && <div>{moment(chStartDate).format('DD MMM, YYYY, HH:mm')}</div>}
              <span style={{ fontWeight: '600' }}>{translateRC(chType)}</span>
            </div>
          </div>
        </div>
        <div className={css.title}>
          {contact.title ? (
            contact.title.length > limitTitle ? (
              <Popup
                style={{ fontSize: 11, fontWeight: '400', width: '100% !important', wordBreak: 'break-all' }}
                trigger={<div>{`${shortenValueTitle(contact.title)}...`}</div>}
                content={<div>{contact.title}</div>}
              />
            ) : (
              <div>{contact.title}</div>
            )
          ) : (
            ''
          )}
        </div>
        <div className={css.type}>{contact.type ? contact.type.name : ''}</div>
        <div className={css.sale} style={styleAccountRowTheme}>
          {_l`${contact.orderIntake}:n`}
        </div>
        <div className={css.owner_avatar}>
          {/* <Avatar
          src={contact.participants.length || contact.numberContactTeam ? contact.owner.avatar : null}
          backgroundColor="transparent"
          missingColor="red"
        /> */}
          {contact.participants.length || contact.numberContactTeam ? (
            contact.owner ? (
              <CreatorPane
                size={30}
                creator={{
                  avatar: contact.participants.length || contact.numberContactTeam ? contact.owner.avatar : null,
                  disc: contact.discProfile,
                  fullName: contact.owner ? contact.owner.name : '',
                }}
                avatar={true}
              />
            ) : (
              ''
            )
          ) : (
            ''
          )}
        </div>
        <div className={css.more}>
          <div className={css.moreItemWapper}>
            <Grid.Row centered textAlign="center">
              <div style={{ backgroundColor: contact.favorite && '#fdf5e8' }} className={css.moreAction}>
                {!contact.favorite && <img src={starSvg} className={css.beStar} onClick={handleToggleFavorite} />}
                {contact.favorite && <img src={starActiveSvg} className={css.beStar} onClick={handleToggleFavorite} />}
              </div>
            </Grid.Row>
            <Grid.Row centered textAlign="center">
              <ContactActionMenu className={css.moreAction} overviewType={overviewType} contact={contact} />
            </Grid.Row>
          </div>
        </div>
      </div>
    </div>
  );
};

const makeMapStateToProps = () => {
  const getContact = makeGetContact();
  const mapStateToProps = (state, { overviewType, itemId }) => ({
    contact: getContact(state, itemId),
    showSpiner: isShowSpiner(state, overviewType),
    selected: isItemSelected(state, overviewType, itemId),
    highlighted: isItemHighlighted(state, overviewType, itemId),
  });
  return mapStateToProps;
};
const mapDispatchToProps = {
  toggleFavoriteRequest: contactActions.toggleFavoriteRequest,
  highlight: OverviewActions.highlight,
  notAllowshowPopupInviteToTeam: contactActions.notAllowshowPopupInviteToTeam,
  showListChannelMsTeam: contactActions.showListChannelMsTeam
};

export default compose(
  withRouter,
  connect(makeMapStateToProps, mapDispatchToProps),
  branch(({ contact }) => !contact, renderNothing),
  withHandlers({
    goto: ({ contact, history, highlight, overviewType, notAllowshowPopupInviteToTeam, showListChannelMsTeam }) => () => {
      highlight(overviewType, contact.uuid);
      history.push(`/contacts/${contact.uuid}`);
    },
    select: ({ select, contact }) => (event, { checked }) => {
      event.stopPropagation();
      select(contact.uuid, checked);
    },
    handleToggleFavorite: ({ toggleFavoriteRequest, contact }) => (event) => {
      event.stopPropagation();
      toggleFavoriteRequest(contact.uuid, !contact.favorite);
    },
  })
)(InfiniteContactListRow);
