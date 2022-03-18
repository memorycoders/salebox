//@flow
import * as React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, branch, renderNothing } from 'recompose';
import { withRouter } from 'react-router';
import { ContentLoader } from 'components/Svg';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isItemSelected, isItemHighlighted, isShowSpiner } from 'components/Overview/overview.selectors';
import { makeGetOrganisation } from './organisation.selector';

import { Grid, Icon, Checkbox, List, Popup, Label } from 'semantic-ui-react';
import { Avatar } from 'components';

import * as organisationActions from 'components/Organisation/organisation.actions';

import ContactPopup from 'components/Contact/ContactPopup';
import OverviewSelectAll from 'components/Overview/OverviewSelectAll';
import ListActionMenu from 'components/Organisation/Menus/ListActionMenu';

import cx from 'classnames';
import overviewCss from 'components/Overview/Overview.css';
import css from './OrganisationListRow.css';
import moment from 'moment';

import FocusRelationship from '../Focus/FocusRelationship';
import CreatorPane from '../User/CreatorPane/CreatorPane';

//ICONS
import callSvg from '../../../public/call.svg';
import mailSvg from '../../../public/mail.svg';
import dialSvg from '../../../public/dial.svg';
import smsSvg from '../../../public/sms.svg';
import starSvg from '../../../public/myStar.svg';
import starActiveSvg from '../../../public/myStar_active.png';

import emailSvg from '../../../public/email.svg';
import teamChat from '../../../public/msTeams_not_connect.png';
import answerCallSvg from '../../../public/answer_call.svg';
import unAnswerCallSvg from '../../../public/unanswer_call.svg';


type PropsType = {
  organisation: {},
  className?: string,
  overviewType: string,
  selected: boolean,
  highlighted: boolean,
  style: {},
  goto: () => void,
  select: (event: Event, { checked: boolean }) => void,
  current1: (event: Event, {}) => void,
  handleKey: (event: Event) => void,
  handleToggleFavorite: (event: Event) => void,
  setFavoriteDeal: () => void,
};

type PlaceholderPropsType = {
  className: string,
  style: {},
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
    Qualified: 'Qualified',
    Unqualified: 'Unqualified',
    Added: 'Added',
    'View details': 'View details',
    'Received email': 'Received email',
    'Sent email': 'Sent email',
    'Video call': 'Video call',
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
  '4': _l`Video dial`,
  '8': _l`Chat`,
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
  Chat: 8,
  Call: 0,
  Video: 5,
  FaceTime: 4,
  Dial: 1,
  SMS: 3,
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

const InfiniteAccountListRow = ({
  handleToggleFavorite,
  handleKey,
  select,
  highlighted,
  organisation,
  style,
  className,
  goto,
  selected,
  overviewType,
  showSpiner,
  current1,
  setFavoriteDeal,
}: PropsType) => {
  // console.log

  let recentActionTypeIcon = null;
  const { communicationHistoryLatest } = organisation;
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
  // const { latestCallDate, latestDialDate } = organisation;
  // if (latestCallDate && latestCallDate > latestDialDate){
  //   recentActionTypeIcon = callSvg;
  // }

  const listCn = cx(className, {
    [overviewCss.highlighted]: highlighted,
    [overviewCss.selected]: selected,
  });

  const sbAccountFormat = 'DD MMM, YYYY H:mm'; // i.e: 27 Nov, 2018 19:22

  const styleAccountRowTheme = {
    // "color": "#5F6A7B",
    fontWeight: '300',
    fontSize: '11',
  };

  let relationshipAccountColor = 'YELLOW';
  if (organisation) {
    const { relationship } = organisation;
    relationshipAccountColor = relationship;
  }
  let MAX_LENGTH_NAME = 0;
  let url = window.location.pathname;
  let screen_width = window.innerWidth;

  if (screen_width >= 1920) {
    if (url.length > 10) {
      MAX_LENGTH_NAME = 80;
    } else {
      MAX_LENGTH_NAME = 110;
    }
  } else if (screen_width > 1580 && screen_width < 1920) {
    if (url.length > 10) {
      MAX_LENGTH_NAME = 63;
    } else {
      MAX_LENGTH_NAME = 82;
    }
  } else if (screen_width <= 1580) {
    if (url.length > 10) {
      MAX_LENGTH_NAME = 36;
    } else {
      MAX_LENGTH_NAME = 63;
    }
  }
  const shortenValueContactName = (value) => {
    if (value && value.length > MAX_LENGTH_NAME) {
      return value.slice(0, MAX_LENGTH_NAME);
    }
    return value;
  };
  return (
    <div
      className={`${listCn} ${css.itemRow}`}
      style={style}
      onClick={goto}
      role="button"
      tabIndex={0}
      onKeyDown={handleKey}
    >
      <div className={css.content}>
      <div className={css.check}>
        <Checkbox onChange={select} checked={selected} />
      </div>
      {/* {showSpiner && <div className={css.check} />} */}
      <div className={css.contact} style={{ display: 'flex', alignItems: 'center' }}>
        <Popup
          hoverable
          trigger={
            <div className={css.nameShow}>
              <Avatar
                overviewType={overviewType}
                borderSize={4}
                size={30}
                isShowName
                fullName={organisation.name}
                src={organisation.avatar ? organisation.avatar : null}
                fallbackIcon="building outline"
                border={relationshipAccountColor}
              />
            </div>
          }
          position="top left"
        >
          <Popup.Content>
            <FocusRelationship
              noteStyle={{ marginTop: 5, lineHeight: '15px' }}
              styleBox={{ width: 15, height: 15 }}
              styleText={{ fontSize: 11, fontWeight: 300 }}
              discProfile={relationshipAccountColor}
            />
          </Popup.Content>
        </Popup>
        <div className={css.nameWapper}>
          {organisation.displayName && organisation.displayName.length > MAX_LENGTH_NAME ? (
            <Popup
              trigger={
                <div className={css.customName}>{`${shortenValueContactName(organisation.displayName)}...`} </div>
              }
              content={<div className={css.customName}>{organisation.displayName} </div>}
            />
          ) : (
            <div className={css.customName}>{organisation.displayName} </div>
          )}
          {/* <div>{organisation.type.name}</div> */}
        </div>
      </div>
      {organisation.email || organisation.phone ? (
        <div className={css.email}>
          <ContactPopup name={organisation.displayName} email={organisation.email} phone={organisation.phone} />
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
        <div className={css.title}>{organisation.industry ? organisation.industry.name : ''}</div>
        <div className={css.type}>{organisation.type ? organisation.type.name : ''}</div>
        <div className={css.sale} style={styleAccountRowTheme}>
          {organisation.orderIntake !== null && organisation.orderIntake !== undefined
            ? _l`${organisation.orderIntake}:n`
            : ''}
        </div>
        <div className={css.owner_avatar}>
          {organisation.owner != null && (
            <CreatorPane
              size={30}
              creator={{
                avatar: organisation.owner.avatar ? organisation.owner.avatar : null,
                disc: organisation.ownerDiscProfile,
                fullName: organisation.owner ? organisation.owner.name : '',

              }}
              avatar={true}
            />
          )
            // <Avatar
            //   size={30}
            //   src={organisation.owner.avatar ? organisation.owner.avatar : null}
            //   backgroundColor="transparent"
            //   missingColor="red"
            // />
          }
        </div>
        <div className={css.more}>
          <div className={css.moreItemWapper}>
            <Grid.Row centered textAlign="center">
              <div style={{ backgroundColor: organisation.favorite && '#fdf5e8' }} className={css.moreAction}>
                {!organisation.favorite && <img src={starSvg} className={css.beStar} onClick={setFavoriteDeal} />}
                {organisation.favorite && <img src={starActiveSvg} className={css.beStar} onClick={setFavoriteDeal} />}
              </div>
            </Grid.Row>
            <Grid.Row centered textAlign="center">
              <ListActionMenu className={css.moreAction} overviewType={overviewType} organisation={organisation} />
            </Grid.Row>
          </div>
        </div>
      </div>

    </div>
  );
};

const makeMapStateToProps = () => {
  const getOrganisation = makeGetOrganisation();
  const mapStateToProps = (state, { overviewType, itemId }) => ({
    showSpiner: isShowSpiner(state, overviewType),
    organisation: getOrganisation(state, itemId),
    selected: isItemSelected(state, overviewType, itemId),
    highlighted: isItemHighlighted(state, overviewType, itemId),
  });
  return mapStateToProps;
};
const mapDispatchToProps = {
  toggleFavoriteRequest: organisationActions.toggleFavoriteRequest,
  highlight: OverviewActions.highlight,
  setFavoriteDeal: organisationActions.setFavoriteDeal,
};

export default compose(
  withRouter,
  connect(makeMapStateToProps, mapDispatchToProps),
  branch(({ organisation }) => !organisation, renderNothing),
  withHandlers({
    goto: ({ organisation, history, highlight, overviewType }) => () => {
      // event.stopPropagation();
      // current1(organisation.uuid);
      highlight(overviewType, organisation.uuid);
      history.push(`/accounts/${organisation.uuid}`);
    },
    handleKey: ({ organisation, history }) => (event) => {
      if (event.keyCode === 13) {
        history.push(`/accounts/${organisation.uuid}`);
      }
    },
    select: ({ select, organisation }) => (event, { checked }) => {
      event.stopPropagation();
      select(organisation.uuid, checked);
    },
    setFavoriteDeal: ({ setFavoriteDeal, organisation }) => (e) => {
      e.stopPropagation();
      setFavoriteDeal(organisation.uuid, !organisation.favorite);
    },
  })
)(InfiniteAccountListRow);
